# Sidebar navigation and resizing — 2026-10-13

Latest user request supersedes the dashboard link grid: use the sidebar for navigation, remove top bubble links, and allow its width to change while open.

Removed the dashboard study-area grid, top Dashboard/account shortcuts and dashboard Continue shortcut. Book/chapter/lesson dropdowns and their charts remain intact. Sidebar labels retain TBD for areas without published graded exercises or scheduled review checks. Account and cloud status remain in the sidebar; sync behavior is unchanged.

The right-edge separator supports mouse and actual touch dragging, arrow keys (10px; Shift 40px), Home/End bounds, and accessible width attributes. Local UI preferences store distinct desktop and phone widths. Viewport changes clamp the displayed width without discarding the saved preference. Small screens retain at least 44px beyond the drawer; the drawer has an internal Close button and Escape closes it. Its hidden controls are no longer keyboard-focusable when closed. Storage failures do not block navigation or resize. No learner-progress records, source material, lesson/question identities, paid calls or database schema changes.

Verification covers syntax, 206 unit/contract tests, static build/deployment validation, and eleven desktop/mobile browser suites. The new resize suite exercises actual touch events and mouse dragging, keyboard limits, reload persistence, viewport shrinking, separate widths, sidebar routes and no navigation bubbles. All browser service access is local or mocked; no paid inference or real learner writes. Staging publication waits for complete CI on the exact commit; production is unchanged.
