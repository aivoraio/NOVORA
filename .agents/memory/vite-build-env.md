---
name: Vite standalone builds
description: Environment variables required to run the Novora Vite production build outside its managed workflow.
---

The Novora Vite config intentionally requires both `PORT` and `BASE_PATH`. The managed workflow injects them automatically; a manual production build must provide them explicitly.

**Why:** Running the package build without workflow context fails before Vite loads the app, which can look like a code regression even when the dev workflow is healthy.

**How to apply:** Use the artifact’s workflow port and root base path, for example `PORT=<workflow-port> BASE_PATH=/ pnpm --filter @workspace/novora-site run build`.