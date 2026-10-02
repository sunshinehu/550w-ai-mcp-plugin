# 550W Watermark & Text Eraser

Version 3.1.4 · Native Cursor plugin. This plugin uses OAuth MCP, not an API Key setup form. The [separate standalone Skill](https://github.com/sunshinehu/550w-ai-subtitle-remover) supports both routes. MIT licensed; no private server source or account credentials are included. Local upload helpers require explicit processing approval before transmitting selected media. Read-only inspection does not upload files.

## Capabilities

- Upload images to erase watermarks or unwanted text.
- Upload local MP4/MOV videos to erase hard subtitles or visual watermarks. Full-frame cleanup is the default; a rectangle is used only when the user explicitly supplies coordinates.
- Paste a TikTok, X, or other supported video/content link copied through Share → Copy link. If downloading the resolved video fails, return the resolved video URL for browser download, not the original share link.

## Install

Download `550w-github-cursor-global.zip` from the [latest GitHub release](https://github.com/sunshinehu/550w-ai-mcp-plugin/releases/latest) for the plugin files. The archive includes `.cursor-plugin/plugin.json`, the global MCP configuration, the local uploader, the workflow Skill, the brand logo, and third-party license notices. Use Cursor's supported plugin installation flow; extracting this archive alone does not install or authorize the plugin. GitHub distribution does not imply approval in the Cursor marketplace.

Connect Cursor to 550W AI's global remote MCP service for video subtitle removal, supported public video-sharing link watermark removal, image watermark removal, and task or credit lookup.

The plugin installs the remote OAuth MCP connection, a local file-upload MCP helper, and an English workflow Skill. On first use, Cursor opens the 550W website for email sign-in and consent. The local helper reads a user-selected absolute file path and uploads it with the short-lived ticket returned by the remote MCP; it never reads OAuth tokens or API keys. Node.js 18+ and permission to run the local helper and read the selected file are required. Queries do not use credits; media processing is charged to the connected 550W account under the current website prices. Upload only media you own or are authorized to process.

MCP endpoint: `https://www.550wai.cn/mcp/global` (Streamable HTTP). The global user guide is at <https://eraser.550wai.com/agent/>. Manage connections at <https://eraser.550wai.com/mcp-connect/>.

For source builds run `npm ci`, `npm run bundle`, and `npm test`. Run `npm run package:release` to create the versioned release directory with the fixed-name ZIP, SHA-256 manifest, and licenses collected from the bundle's actual dependencies. The TypeScript runtime source rebuilds the local upload MCP helper without the private monorepo. The upload tests do not replace installed-Cursor acceptance. Runtime credentials belong in the authorized host, not repository files.

If Cursor cannot run the local helper or read the selected file, direct image or local-video processing to https://eraser.550wai.com/ for file upload. A supported public video-sharing link can still be used for platform-watermark removal, but it is not a substitute for the local file. The Skill must never claim a processing result without a successful service response.
