# same payer takeover

A single self-contained static page. It displays `same payer takeover` and, when present, a sorted list of files already under `dist/line-1/`. There were no such files in this assignment, so the delivered page contains only the requested heading.

## Install, rebuild and preview

Use Node.js 24.2 or newer and npm. Python 3 is needed only for the local preview.

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/`. Stop the preview with Ctrl+C. You can also open `dist/index.html` directly. Building and testing need only Node; the locked development dependencies provide TypeScript and Node types for typechecking.

The source template is `src/index.html`; `scripts/build.ts` generates `dist/index.html`. The build replaces only that file, preserving `dist/line-1/`. Existing regular files, including nested files, become native links with escaped labels and relative, encoded URLs. Symlinks and prohibited `.git`, `.github`, `.env`, `.env.*` and `node_modules` entries are not traversed or listed. Rebuild after adding or removing files. No browser JavaScript, external fonts, images, runtime dependencies or backend are needed.

## Publish

Publish the contents of `dist/` to the static host for the intended held label, preserving any `line-1/` hierarchy. No build is required on the host. Relative links work at a subpath; all page styles are inline. Serve HTML as UTF-8; serve any text files with their correct charset. Include the complete `dist/`, source, package manifest, lockfile and documentation in the submission. `dist/` is deliberately not ignored.

This delivery prepares the static export; it does not change a hosted label or make a deployment. No Git commit was created because the assignment forbids touching `.git/`.

## Actual validation

Checked on 2026-10-07 with Node 24.21.0 and npm 11.19.0:

- `npm install --package-lock-only --ignore-scripts --no-audit --no-fund --cache /tmp/same-payer-npm-cache` — passed. No `node_modules` directory was created or modified.
- `npm run build` — passed; zero existing files listed.
- `node "$TYPECHECK_ROOT/typescript/bin/tsc" --noEmit --typeRoots "$TYPECHECK_ROOT/types"` — passed with strict checking of build and test code. Here `TYPECHECK_ROOT` names the temporary directory used during validation. The exact locked packages were downloaded, integrity-checked and extracted under `/tmp` to respect the prohibition on touching `node_modules`. Normal `npm ci` / `npm run typecheck` remains the documented installation workflow, but that workflow was not run in this restricted workspace.
- `npm test` — passed (one integration test covering empty and populated exports, nested names, HTML escaping, encoded links, preserved file bytes and deterministic rebuilds).
- Browser review of the production export at `/preview/` — checked at 320×640, 768×800 and 1280×800. No horizontal overflow. The final page had no console warnings/errors and no external asset requests. Also checked 200% text enlargement, separately from native browser zoom.
- Populated scratch fixture — native keyboard activation and pointer navigation worked; all three linked files returned 200 and the expected bytes. This fixture is not part of `dist/`.

See [DESIGN.md](DESIGN.md) for implemented design values and [artifacts/validation.md](artifacts/validation.md) for the six-domain review, screenshots, findings and limitations. Native zoom, real screen readers, physical mobile devices and a full automated accessibility scanner were not tested. Plain-text fixture navigation exposed preview-only favicon and charset limitations documented there.

## Submission budget

The explicit path budget for `.gitignore` is **512 bytes maximum**. It excludes dependency/cache directories at every nesting level, TypeScript caches and disposable scratch files. Source, required runtime output, lockfile and selected evidence remain included. No package archives, vendored registry, dependency directories or submodules are delivered. The complete deliverable is checked against the 8,388,608-byte limit in the validation record.
