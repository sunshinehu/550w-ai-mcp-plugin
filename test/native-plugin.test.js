const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
test('native plugin version, root-relative uploader, brand logo and region agree', () => {
  const pkg = require('../package.json');
  const plugin = require('../.cursor-plugin/plugin.json');
  const config = require('../mcp.json');
  assert.equal(plugin.version, pkg.version);
  assert.equal(config.mcpServers['550w-ai-media'].url, 'https://www.550wai.cn/mcp/global');
  assert.deepEqual(config.mcpServers['550w-local-upload'].args, ['${CURSOR_PLUGIN_ROOT}/dist/550w-upload-mcp.cjs']);
  assert.ok(fs.statSync(path.join(root, plugin.logo)).size > 0);
});
test('bundled local MCP handshake reports the release version and discovers two upload tools', async () => {
  const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
  const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');
  const transport = new StdioClientTransport({ command: process.execPath, args: [path.join(root, 'dist/550w-upload-mcp.cjs')] });
  const client = new Client({ name: 'native-plugin-release-test', version: '1.0.0' });
  try {
    await client.connect(transport);
    assert.equal(client.getServerVersion().version, require('../package.json').version);
    const result = await client.listTools();
    assert.deepEqual(result.tools.map(t => t.name).sort(), ['inspect_local_media', 'upload_prepared_media']);
    const upload = result.tools.find(t => t.name === 'upload_prepared_media');
    assert.ok(upload.inputSchema.required.includes('confirmProcessing'));
  } finally { await client.close(); }
});
