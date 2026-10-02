import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const output = path.join(root, 'release', pkg.version);
if (fs.existsSync(output)) throw new Error('Release directory already exists; do not overwrite verified releases');
const staging = fs.mkdtempSync(path.join(os.tmpdir(), '550w-cursor-release-'));
try {
  const result = await build({ absWorkingDir: root, entryPoints: ['dist/oauth-upload-mcp-server.js'], bundle: true, platform: 'node', target: 'node18', format: 'cjs', outfile: path.join(root, 'dist/550w-upload-mcp.cjs'), metafile: true });
  const notices = [];
  for (const item of ['.cursor-plugin', 'mcp.json', 'skills', 'assets', 'README.md', 'LICENSE']) fs.cpSync(path.join(root, item), path.join(staging, item), { recursive: true });
  fs.mkdirSync(path.join(staging, 'dist'));
  fs.copyFileSync(path.join(root, 'dist/550w-upload-mcp.cjs'), path.join(staging, 'dist/550w-upload-mcp.cjs'));
  const packages = new Map();
  for (const input of Object.keys(result.metafile.inputs)) {
    if (!input.includes('node_modules/')) continue;
    let dir = path.dirname(path.resolve(root, input));
    while (dir !== root && (!fs.existsSync(path.join(dir, 'package.json')) || !JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).name)) dir = path.dirname(dir);
    if (dir === root) throw new Error(`Cannot resolve package for ${input}`);
    const dep = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    packages.set(dep.name, { dir, dep });
  }
  for (const [name, { dir, dep }] of [...packages].sort()) {
    const files = fs.readdirSync(dir).filter(n => /^(license|licence|copying|notice)(\.|$)/i.test(n) && fs.statSync(path.join(dir, n)).isFile());
    if (!files.length) throw new Error(`Missing license for ${name}`);
    const dest = path.join(staging, 'third-party-licenses', name);
    fs.mkdirSync(dest, { recursive: true });
    for (const file of files) fs.copyFileSync(path.join(dir, file), path.join(dest, file));
    notices.push({ name, version: dep.version, license: dep.license, files });
  }
  fs.writeFileSync(path.join(staging, 'THIRD-PARTY-NOTICES.json'), JSON.stringify(notices, null, 2) + '\n');
  fs.mkdirSync(output, { recursive: true });
  const archive = path.join(output, '550w-github-cursor-global.zip');
  execFileSync('zip', ['-q', '-r', archive, '.'], { cwd: staging });
  execFileSync('unzip', ['-tq', archive]);
  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  fs.writeFileSync(path.join(output, 'checksums.json'), JSON.stringify({ version: pkg.version, artifact: path.basename(archive), sha256, bundledDependencies: notices }, null, 2) + '\n');
  console.log(JSON.stringify({ archive, sha256, bundledPackages: notices.length }));
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
