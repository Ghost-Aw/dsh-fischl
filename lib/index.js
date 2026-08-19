import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// 插件包内置模型目录：菲谢尔模型 + 渲染库随插件分发（安装即用，无需联网/自备模型）
const BUNDLE_MODEL_DIR = fileURLToPath(new URL('../model/', import.meta.url));
const BUNDLE_MODELS = ['fischl_1.6', 'fischl-libs'];

export const inject = ['webServer'];
export function apply(ctx) {
  const webServer = ctx.webServer;

  // ---- 定位工作区根目录（用于外部模型与诊断；内置模型不依赖它） ----
  const candidates = [];
  try {
    const policy = ctx.get('sandboxPolicy');
    if (policy && typeof policy.workspaceRoot === 'string' && policy.workspaceRoot) candidates.push(policy.workspaceRoot.replace(/[\\/]+$/, ''));
  } catch (error) { /* ignore */ }
  try {
    const registry = ctx.get('workspaceRegistry');
    if (registry && typeof registry.list === 'function') {
      for (const ws of registry.list()) {
        if (ws && typeof ws.path === 'string' && ws.path) candidates.push(ws.path.replace(/[\\/]+$/, ''));
      }
    }
  } catch (error) { /* ignore */ }
  const roots = [];
  for (const c of candidates) if (c && !roots.includes(c)) roots.push(c);

  let resolvedRoot = '';
  async function workingRoot() {
    if (resolvedRoot) return resolvedRoot;
    for (const candidate of roots) {
      try {
        const s = await stat(join(candidate, 'fischl_1.6', 'fischl_live2d_1.6.model3.json'));
        if (s) { resolvedRoot = candidate; return candidate; }
      } catch (error) { /* try next */ }
    }
    return '';
  }

  const CONTENT_TYPES = {
    '.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
    '.json': 'application/json; charset=utf-8', '.moc3': 'application/octet-stream', '.js': 'text/javascript; charset=utf-8',
  };
  const LIGHT_TEXTURE = 'fischl_live2d_1.6.8192/texture_00_2048.png';
  let lightTextureReady = false;
  void (async () => {
    try {
      lightTextureReady = (await stat(join(BUNDLE_MODEL_DIR, 'fischl_1.6', 'fischl_live2d_1.6.8192', 'texture_00_2048.png'))) !== undefined;
    } catch (error) { /* keep original 8K texture */ }
  })();

  async function listDir(dir) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      return entries.map((e) => e.name);
    } catch (e) { return []; }
  }

  /** 解析 folderKey → 物理目录：内置模型优先，其次绝对路径（外部文件夹）或工作区内相对路径。 */
  function folderDirOf(folderKey, base) {
    const key = String(folderKey || '');
    if (BUNDLE_MODELS.includes(key)) return join(BUNDLE_MODEL_DIR, key);
    if (/^[a-zA-Z]:[\\/]/.test(key) || key.startsWith('\\\\') || key.indexOf(':') >= 0) {
      return key.replace(/\//g, '\\').replace(/[\\/]+$/, '');
    }
    return join(base, key.replace(/[\\/]+$/, ''));
  }
  function safeToken(s) {
    return !String(s).includes('..') && !String(s).includes('\u0000');
  }
  function stripExt(file) {
    return String(file || '').replace(/\.(motion3|exp3)\.json$/i, '').split('/').pop();
  }
  function contentTypeFor(name) {
    const lower = String(name).toLowerCase();
    if (lower.endsWith('.motion3.json')) return 'application/json; charset=utf-8';
    if (lower.endsWith('.exp3.json')) return 'application/json; charset=utf-8';
    const dot = lower.lastIndexOf('.');
    const ext = dot < 0 ? '' : lower.slice(dot);
    return CONTENT_TYPES[ext] || 'application/octet-stream';
  }

  function readJsonBody(req) {
    return new Promise((resolve) => {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch (e) { resolve({}); }
      });
      req.on('error', () => resolve({}));
    });
  }

  function sendJson(res, value) {
    const text = JSON.stringify(value);
    const bytes = Buffer.from(text, 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': bytes.byteLength, 'Cache-Control': 'no-store' });
    res.end(bytes);
  }

  // ---- 模型列表：内置模型 + 工作区扫描 ----
  async function listModels() {
    const models = [];
    for (const name of BUNDLE_MODELS) {
      if (name === 'fischl-libs') continue;
      const dir = join(BUNDLE_MODEL_DIR, name);
      for (const file of await listDir(dir)) {
        if (file.toLowerCase().endsWith('.model3.json')) models.push({ folder: name, model3: file });
      }
    }
    const base = await workingRoot();
    if (base) {
      for (const entry of await listDir(base)) {
        try {
          const s = await stat(join(base, entry));
          if (!s.isDirectory()) continue;
          for (const file of await listDir(join(base, entry))) {
            if (file.toLowerCase().endsWith('.model3.json')) models.push({ folder: entry, model3: file });
          }
        } catch (e) { /* skip */ }
      }
    }
    return { models };
  }

  // ---- 选择模型文件夹：支持 base 内外任意路径（base 缺失时仅接受绝对路径） ----
  async function setFolder(raw) {
    const base = await workingRoot();
    const rawPath = String(raw || '').trim();
    if (!rawPath) return { ok: false, error: 'bad path' };
    const norm = rawPath.replace(/\\/g, '/').replace(/\/+$/, '');
    let folderKey = '';
    if (base && norm.toLowerCase().indexOf(base.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()) === 0) {
      // base 内：取第一级目录名
      folderKey = norm.slice(base.replace(/\\/g, '/').replace(/\/+$/, '').length).replace(/^\/+/, '').split('/')[0];
    } else if (/^[a-zA-Z]:\//.test(norm)) {
      // 外部绝对路径：完整保留
      folderKey = norm;
    } else {
      return { ok: false, error: 'bad path' };
    }
    if (!folderKey || !safeToken(folderKey)) return { ok: false, error: 'bad path' };
    const dir = folderDirOf(folderKey, base);
    const files = await listDir(dir);
    const model3 = files.find((f) => f.toLowerCase().endsWith('.model3.json'));
    if (!model3) return { ok: false, error: 'no model3.json in folder' };
    return { ok: true, folder: folderKey, model3: model3 };
  }

  // ---- 模型资产（表情/动作）：model3.json FileReferences 优先，目录回退 ----
  async function listAssets(folderKey) {
    const base = await workingRoot();
    if (!safeToken(folderKey)) return { expressions: [], motions: [] };
    const dir = folderDirOf(folderKey, base);
    const expressions = [];
    const motions = [];
    const seenExp = {};
    const seenMot = {};
    try {
      const files = await listDir(dir);
      const model3 = files.find((f) => f.toLowerCase().endsWith('.model3.json'));
      if (model3) {
        const doc = JSON.parse(await readFile(join(dir, model3), 'utf8'));
        const fr = doc && doc.FileReferences;
        if (fr && Array.isArray(fr.Expressions)) {
          for (const e of fr.Expressions) {
            if (e && typeof e.File === 'string') {
              const id = typeof e.Name === 'string' && e.Name ? e.Name : stripExt(e.File);
              if (!seenExp[id]) { seenExp[id] = 1; expressions.push({ id: id, file: e.File }); }
            }
          }
        }
        if (fr && Array.isArray(fr.Motions)) {
          for (const m of fr.Motions) {
            if (m && typeof m.File === 'string') {
              const id = typeof m.Id === 'string' && m.Id ? m.Id : stripExt(m.File);
              if (!seenMot[id]) { seenMot[id] = 1; motions.push({ id: id, file: m.File }); }
            }
          }
        }
      }
    } catch (e) { /* model3.json 解析失败，走目录回退 */ }
    if (!motions.length) {
      for (const sub of ['motion', 'motions', 'animations']) {
        const entries = await listDir(join(dir, sub));
        for (const f of entries) {
          if (f.toLowerCase().endsWith('.motion3.json')) {
            const id = stripExt(f);
            if (!seenMot[id]) { seenMot[id] = 1; motions.push({ id: id, file: sub + '/' + f }); }
          }
        }
        if (motions.length) break;
      }
    }
    if (!expressions.length) {
      for (const sub of ['exp', 'expressions']) {
        const entries = await listDir(join(dir, sub));
        for (const f of entries) {
          if (f.toLowerCase().endsWith('.exp3.json')) {
            const id = stripExt(f);
            if (!seenExp[id]) { seenExp[id] = 1; expressions.push({ id: id, file: sub + '/' + f }); }
          }
        }
        if (expressions.length) break;
      }
    }
    return { expressions: expressions, motions: motions };
  }

  // ---- 动作曲线 ----
  async function motionCurves(folderKey, file) {
    const base = await workingRoot();
    if (!folderKey || !file || !safeToken(folderKey) || !safeToken(file)) return { ok: false };
    try {
      const dir = folderDirOf(folderKey, base);
      const relFile = String(file).replace(/\//g, '\\');
      let content = null;
      try {
        content = await readFile(join(dir, relFile), 'utf8');
      } catch (e) {
        // 兼容旧配置：file 无子目录前缀时回退探测常见动作目录
        for (const sub of ['motion', 'motions', 'animations']) {
          try { content = await readFile(join(dir, sub, relFile), 'utf8'); break; }
          catch (e2) { /* try next */ }
        }
      }
      if (content === null) return { ok: false, error: 'motion file not found' };
      const doc = JSON.parse(content);
      const curves = [];
      if (Array.isArray(doc.Curves)) {
        for (const c of doc.Curves) {
          if (c && c.Target === 'Parameter' && typeof c.Id === 'string' && Array.isArray(c.Segments) && c.Segments.length >= 4) {
            curves.push({ id: c.Id, segments: c.Segments });
          }
        }
      }
      const meta = doc.Meta || {};
      return {
        ok: true,
        duration: typeof meta.Duration === 'number' ? meta.Duration : 4,
        fadeIn: typeof meta.FadeInTime === 'number' ? meta.FadeInTime : 0.5,
        fadeOut: typeof meta.FadeOutTime === 'number' ? meta.FadeOutTime : 0.5,
        curves: curves,
      };
    } catch (error) {
      return { ok: false, error: String(error && error.message) };
    }
  }

  // ---- 表情数据 ----
  async function expressions(folderKey) {
    const exps = [];
    const base = await workingRoot();
    if (!safeToken(folderKey)) return { exps };
    const dir = folderDirOf(folderKey, base);
    for (const sub of ['exp', 'expressions']) {
      const entries = await listDir(join(dir, sub));
      for (const f of entries) {
        if (!f.toLowerCase().endsWith('.exp3.json')) continue;
        try {
          const parsed = JSON.parse(await readFile(join(dir, sub, f), 'utf8'));
          const params = Array.isArray(parsed && parsed.Parameters)
            ? parsed.Parameters.filter((p) => p && typeof p.Id === 'string' && typeof p.Value === 'number')
                .map((p) => ({ id: p.Id, value: p.Value, blend: p.Blend === undefined ? 'Overwrite' : p.Blend }))
            : [];
          exps.push({ id: f.replace(/\.exp3\.json$/i, ''), params: params });
        } catch (e) { /* skip broken */ }
      }
      if (exps.length) break;
    }
    return { exps: exps };
  }

  async function writeDiag(payload) {
    try {
      const base = await workingRoot();
      if (!base) return;
      const target = join(base, 'fischl-diag.txt');
      let existing = '';
      try { existing = await readFile(target, 'utf8'); } catch (e) { existing = ''; }
      let lines = (existing + JSON.stringify(payload) + '\n').split('\n').filter((l) => l.length > 0);
      if (lines.length > 60) lines = lines.slice(lines.length - 60);
      await writeFile(target, lines.join('\n') + '\n', 'utf8');
    } catch (error) { /* ignore */ }
  }

  const disposeRoute = webServer.register({
    kind: 'prefix',
    path: '/fischl',
    handler: async (req, res) => {
      try {
        const base = await workingRoot();
        const url = new URL(req.url || '/', 'http://localhost');
        const pathname = url.pathname;
        const sub = decodeURIComponent(pathname).slice('/fischl'.length).replace(/^\//, '');

        // ---- API ----
        if (sub === 'api/models') return sendJson(res, await listModels());
        if (sub === 'api/assets') return sendJson(res, await listAssets(url.searchParams.get('folder') || 'fischl_1.6'));
        if (sub === 'api/set-folder') return sendJson(res, await setFolder((await readJsonBody(req)).path));
        if (sub === 'api/motion-curves') return sendJson(res, await motionCurves(url.searchParams.get('folder') || '', url.searchParams.get('file') || ''));
        if (sub === 'api/expressions') return sendJson(res, await expressions(url.searchParams.get('folder') || 'fischl_1.6'));
        if (sub === 'api/diag') { await writeDiag(await readJsonBody(req)); res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end('{"ok":true}'); return; }

        // ---- 诊断文本 ----
        if (sub === 'fischl-diag.txt') {
          if (!base) {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('(no diagnostics yet)');
            return;
          }
          try {
            const text = await readFile(join(base, 'fischl-diag.txt'), 'utf8');
            const bytes = Buffer.from(text, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': bytes.byteLength, 'Cache-Control': 'no-store' });
            res.end(bytes);
          } catch (error) {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('(no diagnostics yet)');
          }
          return;
        }

        // ---- 模型资产 ----
        const slash = sub.indexOf('/');
        const folderKey = slash < 0 ? sub : sub.slice(0, slash);
        const rest = slash < 0 ? '' : sub.slice(slash + 1);
        if (!folderKey || !safeToken(folderKey) || !safeToken(rest) || rest.indexOf(':') >= 0) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('not found');
          return;
        }
        const dir = folderDirOf(folderKey, base);
        // 菲谢尔 8K 纹理降级：仅对 fischl_1.6 的 model3.json 生效
        if (folderKey === 'fischl_1.6' && rest === 'fischl_live2d_1.6.model3.json') {
          const doc = JSON.parse(await readFile(join(dir, rest.replace(/\//g, '\\')), 'utf8'));
          if (lightTextureReady && doc && doc.FileReferences && Array.isArray(doc.FileReferences.Textures)) {
            doc.FileReferences.Textures = [LIGHT_TEXTURE];
          }
          const bytes = Buffer.from(JSON.stringify(doc), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': bytes.byteLength, 'Cache-Control': 'no-store' });
          res.end(bytes);
          return;
        }
        const target = join(dir, rest.replace(/\//g, '\\'));
        const bytes = await readFile(target);
        res.writeHead(200, { 'Content-Type': contentTypeFor(rest), 'Content-Length': bytes.byteLength, 'Cache-Control': 'public, max-age=3600' });
        res.end(bytes);
      } catch (error) {
        const missing = error && (error.code === 'ENOENT' || error.code === 'ENOTDIR');
        console.error('fischl route error: ' + (error && (error.stack || error.message)));
        try {
          res.writeHead(missing ? 404 : 500, { 'Content-Type': 'text/plain' });
          res.end(missing ? 'not found' : 'internal error');
        } catch (e) { /* socket gone */ }
      }
    },
  });
  ctx.effect(() => disposeRoute, 'fischl: model asset route');
}
