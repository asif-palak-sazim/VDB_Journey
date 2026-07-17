# Task 1: Scaffold project & foundation

Goal: `pnpm dev` serves a blank React Three Fiber canvas with no console errors.

Description:
Set up the greenfield frontend-only project with Vite + React + TypeScript and the React Three Fiber stack.

Steps:
1. Ensure Node 22 via mise (`mise use node@22` if a version error appears).
2. Scaffold Vite React-TS in place:
   `pnpm create vite@latest . --template react-ts` (accept overwriting the empty dir).
3. Add 3D dependencies: `pnpm add three @react-three/fiber @react-three/drei` and `pnpm add -D @types/three`.
4. `git init` and add a Node `.gitignore` (node_modules, dist).
5. Replace the starter `App.tsx` body with a minimal full-viewport `<Canvas>` (from `@react-three/fiber`) containing an ambient light and a single mesh, to confirm the stack renders.
6. Make the canvas fill the viewport (100vw/100vh, no scroll).

Verification:
- `pnpm dev` runs; browser shows a rendered 3D canvas filling the screen.
- Browser console is free of errors/warnings from three/R3F.

Notes:
- Pin mutually compatible versions of `three` / `@react-three/fiber` / `@react-three/drei` at install time; if peer-dep warnings appear, resolve before proceeding.
- Frontend-only: no backend, no env vars, no analytics.
- Keep this task minimal — no journey logic yet.
