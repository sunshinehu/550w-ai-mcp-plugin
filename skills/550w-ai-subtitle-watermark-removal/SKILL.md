---
name: 550w-ai-subtitle-watermark-removal
description: Use 550W AI's remote OAuth MCP to remove image watermarks, local video subtitles or visual watermarks, or platform watermarks from copied TikTok or X video links.
metadata:
  version: 3.1.3
---

# 550W Watermark & Text Eraser

<!-- 550w-capabilities:start -->
## Capabilities and inputs

- Image watermark removal: upload a user-selected image to erase a watermark or unwanted text.
- Local video subtitle and visual-watermark removal: upload a user-selected MP4/MOV video for processing. Erase the full frame by default; use pixel coordinates x1, y1, x2, y2 for a rectangle only when the user explicitly supplies them. Never guess coordinates.
- Video-link watermark removal: ask the user to choose Share → Copy link in the relevant app or platform website and provide the video/content share URL. TikTok and X are examples; actual support depends on the service response. Return the resolved platform-watermark-free video URL.
- If the agent cannot download the resolved video URL or the download times out, give the user the resolved data.video URL to download in a browser. Do not substitute the platform share URL or claim the file was downloaded. Successful resolution and client download are separate outcomes.
<!-- 550w-capabilities:end -->

Use this workflow only for media the user owns or is authorized to process. This Skill provides instructions; the actual processing is performed by 550W AI's remote MCP server.

If the MCP server is not connected, ask the user to add the Streamable HTTP endpoint `https://www.550wai.cn/mcp/global`. The first connection opens the 550W website for email sign-in and consent. Do not request a user number, API key, sub-key, password, or OAuth token. If the client cannot connect to remote OAuth MCP servers, explain the limitation and point to <https://eraser.550wai.com/agent/>. Never imply that a task ran when it did not.

## Workflow

1. Identify whether the request is for hardcoded subtitles, a supported public video-sharing link, or image watermark/text removal. Before upload or paid submission, tell the user that the media or link will be sent to 550W AI and that processing uses account credits. Reading credits and task status does not consume credits.
2. Use `query_credits` to check the balance. For a user-selected local file, call the local `inspect_local_media` tool to obtain its actual byte size, then call remote `prepare_media_upload` with that size and media type. Pass its `uploadUrl` and `uploadTicket`, the same file path, media type, and `region: "global"` to local `upload_prepared_media`. Do not pass OAuth tokens. For video, use the returned `mediaId`, width, height, and duration for `estimate_subtitle_cost` and `submit_subtitle_task`; do not invent media properties. Submit with a stable 8–128 character `idempotencyKey`. On a timeout, check the task and retry only with the same inputs and key.
3. For a supported public video-sharing link, use `remove_video_watermark` with a stable 8–64 character `operationId`. Reuse that ID on retries. Supported sources and the final price are determined by the service response; do not promise support for an unverified platform.
4. For image watermark or text removal, follow the local inspect and remote prepare flow above for each image. Before calling local `upload_prepared_media`, choose a stable 8–64 character `operationId` and pass it with the file and ticket; the upload can create a billed image task. Use the returned `taskId` with `get_image_watermark_task`. If the upload response is lost, do not generate a new operation ID or blindly repeat the upload. Process multiple images separately.
5. For subtitle jobs, use `get_subtitle_task` or `list_subtitle_tasks` to report progress. Before `delete_subtitle_task`, confirm the exact task with the user. Deletion does not imply a credit refund. While processing, provide the task ID and a way to check it later.

If credits are insufficient, direct the user to <https://eraser.550wai.com/purchase/>; do not purchase credits on their behalf. Account connections can be reviewed at <https://eraser.550wai.com/mcp-connect/>. If Cursor cannot run the local helper or access the selected file, direct subtitle, visual-watermark, or image-watermark requests to <https://eraser.550wai.com/> for file upload. Do not treat a platform share link as a substitute for a local file or imply that processing succeeded. Share-link platform-watermark removal remains available when its tool works. Explain other tool or consent failures plainly.

Before local media upload, obtain approval to transmit the selected media and for applicable processing charges. The bundled local upload MCP tool requires `confirmProcessing: true`; this acknowledgement does not replace host permissions or user approval. Read-only inspection and queries do not require it.
