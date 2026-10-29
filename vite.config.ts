import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// Keep this checkout's own worktrees/ out of the dev server's file watcher. It's anchored to this
// folder because a "**/worktrees/**" glob also matches every file of a checkout that is itself a
// worktree (<root>/worktrees/<branch>/...), so its dev server would never see changes.
const worktrees = fileURLToPath(new URL("./worktrees", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  server: { watch: { ignored: [`${worktrees}/**`] } },
  plugins: [react(), tailwindcss()],
});
