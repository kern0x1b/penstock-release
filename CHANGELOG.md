# Changelog

All notable changes to Penstock are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Each release ships as two Marketplace builds from the same source: an odd patch version for
IDEs 2025.2–2026.1 and the next even patch version for 2026.2 and later.

## [Unreleased]

## [2.4.1] - 2026-08-31

### Added
- A one-time notification after the plugin updates, offering the changelog in an editor tab.
  Nothing is shown on a fresh install
- Third-party license notices bundled with the plugin and viewable from
  Settings | Tools | Penstock | About | Open source licenses, generated from the
  installed packages and including a written source offer for the LGPL-licensed components

### Changed
- Renamed from "Camunda BPMN Editor" to **Penstock**. The plugin ID is unchanged, so the rename
  arrives as an ordinary update and keeps every existing installation, review, and download
- The plugin is now distributed under a proprietary end-user license agreement instead of MIT
- Both compatibility variants now carry the paid `product-descriptor`; the 2026.2+ build had been
  shipping without it and would have been listed as free
- The Marketplace description, change notes, and product descriptor are injected at build time from
  a single source, and the second `plugin.xml` is generated from the first, so the two variants can
  no longer drift apart

### Removed
- Dropped four unused frontend dependencies (`@dagrejs/dagre`, `elkjs`, `web-worker`,
  `classnames`), which also removes the last EPL/GPL-licensed component from the distribution

### Fixed
- Restored the bpmn.io watermark, which the editor stylesheet had been hiding contrary to the
  bpmn-js license
- Replaced the deprecated `ReadAction.compute`/`ReadAction.run` and `SimpleListCellRenderer.create`
  calls; the plugin now verifies as Compatible with no deprecated or internal API usages on 2025.2,
  2026.1, and 2026.2

## [2.3.7] - 2026-08-27

### Changed
- Re-added the paid `product-descriptor` (code, release-date, release-version) per JetBrains Marketplace support: vendor/banking details are now verified, and the Sales tab only unlocks after a build with these parameters is uploaded. No in-app license check — the platform enforces licensing on its own (and grants unlicensed users a 30-day trial), so the custom `CheckLicense`/"Buy License" panel from 2.3.3 isn't needed.

## [2.3.5] - 2026-08-27

### Changed
- Reverted the license enforcement added in 2.3.3: JetBrains Marketplace hasn't yet enabled selling for this plugin (no Sales tab / pricing plan available), so shipping a license-gated build now would have left updated users unable to open BPMN diagrams *or* buy a license. The plugin is free again until monetization is actually live; license enforcement will return in a future release once pricing is enabled on Marketplace.

## [2.3.3] - 2026-08-27

### Changed
- Plugin registered as Fully Paid on JetBrains Marketplace: removed the free read-only viewer mode added for the (never-published) Freemium plan — a valid license is now required to open BPMN diagrams at all. Unlicensed users see a "Buy License" prompt instead of a degraded editor.
- `product-descriptor` `optional` flag set to `false` to match the registered pricing model

## [2.3.1] - 2026-08-27

### Fixed
- Restored the ability to switch between the diagram and the raw XML/text editor for `.bpmn` files — a 2025-12-29 recovery after an accidental file deletion had silently swapped the editor policy to `HIDE_DEFAULT_EDITOR`, hiding the default XML editor tab entirely

### Changed
- Updated Gradle plugins (OpenAPI Generator 7.25.0, Spring Boot 4.1.1) and webview dependencies (bpmn-js, camunda-bpmn-js, bpmn-js-properties-panel, bpmnlint, and others) to their latest compatible releases

## [2.3.0] - 2026-07-30

### Added
- Freemium licensing: without a license, the editor opens as a read-only viewer (pan/zoom, no editing) with an upgrade banner; a valid license unlocks the full editor unchanged
- Product descriptor and vendor ID added to plugin.xml for JetBrains Marketplace monetization

### Changed
- License check is defensively wrapped so a licensing failure degrades to the free viewer instead of breaking the editor entirely

## [2.2.0] - 2026-07-29

### Added
- External file change detection: editing a `.bpmn` file outside the IDE (git checkout/pull, another editor) now prompts to reload instead of silently overwriting it on the next autosave
- Support for WebStorm/IntelliJ IDEA 2026.2 and later (published as a second compatibility variant of the plugin, alongside the existing 2025.2–2026.1 build)

### Changed
- Token Simulation now blocks Undo/Redo/Copy/Paste/Delete/Auto Layout while a simulation is running, instead of silently allowing edits to the real diagram
- BPMN Lint now requires trusting the project first, and no longer allows starting a second run on a file that's still linting
- Settings dialog writes and the webview's own config reads/writes are now properly synchronized (closes a gap left by the 2.1.0 fix)
- Autosave debounce shortened from 400ms to 200ms

### Fixed
- Fixed "Save and Continue" doing nothing after selecting an engine on first-time project setup — the actual failure was being silently swallowed, and a redundant background request could report an error even after the save had already succeeded
- Fixed a renamed/moved BPMN file resurrecting a stale copy at its old path on the next autosave
- Fixed several usages of deprecated platform APIs (`ReadAction.compute`/`run`, `SimpleListCellRenderer.create`) and an incorrect `since-build` declaration

## [2.1.0] - 2026-07-16

### Architecture
- Restructured to flat module layout: `jetbrains/`, `webview/`, `sandbox/`
- Removed `backend/` wrapper directory
- PlatformBridge abstraction — webview is platform-agnostic
- HttpPlatformBridge for JetBrains CEF + sandbox (fetch-based)
- Bridge injection API for future VSCode support
- Each platform module owns its build (decoupled from root)
- Module READMEs with architecture docs

### Added
- Copy/paste now syncs through the OS clipboard (IntelliJ `CopyPasteManager`), so elements can be copied in one diagram tab and pasted into another
- `.editorconfig`, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- GitHub issue/PR templates

### Changed
- All dependencies updated to latest versions
- Kotlin 2.4.10, IntelliJ Platform Plugin 2.18.1, IntelliJ IDEA SDK 2026.1.4
- Spring Boot 3.4.1 → 4.1.0 (sandbox)
- Frontend: Vite 7 → 8.1, TypeScript 5 → 6, ESLint 9 → 10.7, Node.js 24 LTS (24.18)
- Gradle wrapper 9.2.1 → 9.6.1
- CEF Generator upgraded to 3.1.1, OpenAPI Generator upgraded to 7.23.0
- bpmn-js/camunda-bpmn-js and the properties panel updated to their latest releases
- Redesigned toolbar with a more compact, icon-based layout
- Updated Camunda connector element templates to the latest upstream release

### Removed
- Deploy and Auto Layout toolbar actions temporarily hidden — returning in a future release

### Fixed
- Kotlin idioms: computed properties, `Unit`, `jacksonObjectMapper()`
- Unified logging to IntelliJ `Logger.getInstance`
- Removed hardcoded `gradle.java.home`, duplicate `.gitignore`, `lombok.config`
- Crash when pasting a copied pool/participant into a different editor tab
- Paste occasionally re-inserting a previously copied element instead of the current clipboard content
- CEF browser resources not being released when a project closes
- Tightened CORS origin validation on the plugin's local API

## [2.0.1] - 2025-12-15

### Fixed
- Opening Camunda 7 scripts in external tab

## [2.0.0] - 2025-12-01

### Added
- Element templates support for Camunda 8
- Tool window for managing BPMN diagrams in project

### Changed
- Updated component design
- Updated library versions

## [1.4.4] - 2025-09-15

### Fixed
- Base64 encoding

### Added
- Custom file logo

## [1.4.3] - 2025-09-01

### Added
- Toolbar (can be hidden) and context menu
- Export to SVG

### Fixed
- Chinese language support

## [1.4.2] - 2025-08-15

### Added
- BPMN Linter integration

### Fixed
- Copy/paste elements between diagrams

## [1.4.1] - 2025-08-01

### Added
- Dracula theme
- Sketchy schema theme (disabled by default)

## [1.4.0] - 2025-07-15

### Changed
- Performance and size optimizations
- Refactored init JS queries and context

## [1.3.1] - 2025-07-01

### Fixed
- Performance improvements
- Copy/paste between diagrams

## [1.3.0] - 2025-06-15

### Fixed
- Performance (project context, UI build optimization)

## [1.2.0] - 2025-06-01

### Changed
- Migrated from Spring context to PicoContainer

### Fixed
- Dark theme styles

## [1.1.0] - 2025-05-15

### Added
- Token simulation support

### Fixed
- Dark theme styles

[Unreleased]: https://github.com/kern0x1b/penstock/compare/v2.4.1...HEAD
[2.4.1]: https://github.com/kern0x1b/penstock/compare/v2.3.7...v2.4.1
[2.3.7]: https://github.com/kern0x1b/penstock/compare/v2.3.5...v2.3.7
[2.3.5]: https://github.com/kern0x1b/penstock/compare/v2.3.3...v2.3.5
[2.3.3]: https://github.com/kern0x1b/penstock/compare/v2.3.1...v2.3.3
[2.3.1]: https://github.com/kern0x1b/penstock/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/kern0x1b/penstock/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/kern0x1b/penstock/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/kern0x1b/penstock/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/kern0x1b/penstock/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/kern0x1b/penstock/compare/v1.4.4...v2.0.0
[1.4.4]: https://github.com/kern0x1b/penstock/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/kern0x1b/penstock/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/kern0x1b/penstock/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/kern0x1b/penstock/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/kern0x1b/penstock/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/kern0x1b/penstock/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/kern0x1b/penstock/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/kern0x1b/penstock/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/kern0x1b/penstock/releases/tag/v1.1.0
