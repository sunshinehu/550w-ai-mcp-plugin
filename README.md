# 550W Watermark & Text Eraser for Cursor

Version 3.1.3. This native Cursor plugin uses OAuth MCP, not an API Key setup form. The separate standalone Skill supports both routes. MIT licensed; no private server source or account credentials are included. Local upload helpers require explicit processing approval before opening or transmitting selected media.

Connect Cursor to 550W AI's global remote MCP service for video subtitle removal, supported public video-sharing link watermark removal, image watermark removal, and task or credit lookup.

The plugin installs the remote OAuth MCP connection, a local file-upload MCP helper, and an English workflow Skill. On first use, Cursor opens the 550W website for email sign-in and consent. The local helper reads a user-selected absolute file path and uploads it with the short-lived ticket returned by the remote MCP; it never reads OAuth tokens or API keys. Node.js 18+ and permission to run the local helper and read the selected file are required. Queries do not use credits; media processing is charged to the connected 550W account under the current website prices. Upload only media you own or are authorized to process.

MCP endpoint: `https://www.550wai.cn/mcp/global` (Streamable HTTP). The global user guide is at <https://eraser.550wai.com/agent/>. Manage connections at <https://eraser.550wai.com/mcp-connect/>.

For source builds run `npm ci`, `npm test`, and `npm run bundle`. The TypeScript runtime source rebuilds the local upload MCP helper without the private monorepo. The upload tests do not replace installed-Cursor acceptance. Runtime credentials belong in the authorized host, not repository files.

If Cursor cannot run the local helper or read the selected file, direct image or local-video processing to https://eraser.550wai.com/ for file upload. A supported public video-sharing link can still be used for platform-watermark removal, but it is not a substitute for the local file. The Skill must never claim a processing result without a successful service response.
