# Windows shell evaluation

The owner requested a narrow prototype before choosing permanent packaging. Neither shell is an official release. No installer, signing, updater, new backend or privileged project-file integration is provided. Both use the same allowlisted `dist` assets and common DC engine, with empty cloud configuration and a restrictive local-only content policy.

Electron 44.7.2 is the stable release checked on the official release feed on October 14, 2026. Its prototype uses a secure standard `eu-lab://app` protocol, sandboxed renderer, no Node integration/preload/IPC, denied permissions/new windows and external request blocking. This supports ES modules and Web Locks without an HTTP server. Playwright launches the real Windows process and exercises the same desktop acceptance routine as Chromium, plus native window bounds and renderer isolation checks.

Tauri CLI 2.12.2 is the checked official CLI release. Its debug prototype embeds the same public assets in WebView2, exposes no Rust commands/plugins/capabilities and has no installer bundle. Cargo runtime dependencies currently resolve within major 2; CI retains `Cargo.lock` for reproducibility review. The Windows trial builds the executable and uses `tauri-driver` with a matching Microsoft Edge driver to test native pointer probe snapping, docking, clearing/undo and secure Web Locks. This is runtime evidence only after that job actually passes.

| Criterion | Electron trial | Tauri trial |
| --- | --- | --- |
| Rendering | Bundled Chromium | Windows WebView2 |
| Application tooling | Node shell, JS tests | Rust/MSVC, JS frontend, Edge driver |
| Reused UI and calculations | Same desktop modules and DC engine | Same desktop modules and DC engine |
| Local persistence | Separate secure prototype origin/profile | Separate secure prototype origin/profile |
| Windows validation | Playwright native process and direct mouse actions | WebDriver native process and pointer actions |
| Evidence | Screenshot, launch time, process metrics | Screenshot, launch time, debug executable size, driver capabilities |
| Permanent selection | Pending measured results and owner test | Pending measured results and owner test |

The trial does not transfer browser learning progress into native storage automatically. Existing browser data remains intact and recoverable through its current exports. Account/cloud transport, signed installer behavior, native file dialogs, accessibility/HiDPI/multi-monitor coverage and sustained performance need separate work. Debug executable bytes are not a fair release-size comparison; process metrics are observations on CI hardware, not performance guarantees.

Run the jobs in `.github/workflows/v2-checks.yml` on the development branch. `windows-electron-evaluation` and `windows-tauri-evaluation` artifacts contain synthetic screenshots/metrics. No real personal progress is tested. Native jobs are part of the exact-commit staging quality gate; cold Rust builds may take longer, so the read-only gate now allows up to 32 minutes and still fails closed.

References: [Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/), [Tauri WebDriver CI](https://v2.tauri.app/develop/tests/webdriver/ci/), [Electron security](https://www.electronjs.org/docs/latest/tutorial/security), [Electron testing](https://www.electronjs.org/docs/latest/tutorial/automated-testing), [Electron stable releases](https://releases.electronjs.org/release?channel=stable). These informed the trial; no permanent winner is selected by documentation alone.
