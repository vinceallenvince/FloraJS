# Vendored dependencies

These are FloraJS's former npm dependencies (all by the same author,
unmaintained since ~2014), absorbed into the repo so the library can be
built and patched without resurrecting the abandoned packages. They are
now first-class FloraJS source, maintained here.

Provenance — each module began as the `src/` contents of the exact npm
tarball FloraJS 3.1.2 resolved to:

| Path | Package | Source |
| --- | --- | --- |
| `burner/` | burner@3.1.5 | https://registry.npmjs.org/burner/-/burner-3.1.5.tgz |
| `soundbed/` | soundbed@0.1.8 | https://registry.npmjs.org/soundbed/-/soundbed-0.1.8.tgz |
| `colorpalette.ts` | colorpalette@0.1.5 | https://registry.npmjs.org/colorpalette/-/colorpalette-0.1.5.tgz |
| `borderpalette.ts` | borderpalette@0.1.7 | https://registry.npmjs.org/borderpalette/-/borderpalette-0.1.7.tgz |
| `quietriot.ts` | quietriot@0.1.2 | https://registry.npmjs.org/quietriot/-/quietriot-0.1.2.tgz |
| `drawing-utils-lib.ts` | drawing-utils-lib@0.1.5 | https://registry.npmjs.org/drawing-utils-lib/-/drawing-utils-lib-0.1.5.tgz |
| `vector2d-lib.ts` | vector2d-lib@0.0.7 | https://registry.npmjs.org/vector2d-lib/-/vector2d-lib-0.0.7.tgz |
| `fpsdisplay.ts` | fpsdisplay@0.1.3 | https://registry.npmjs.org/fpsdisplay/-/fpsdisplay-0.1.3.tgz |

Notable changes since vendoring:

- Converted from CommonJS + prototype inheritance to TypeScript ES
  modules and classes, matching the rest of the codebase. Behavior
  preserved; `Utils.extend` and 2014-era shims (vendor-prefixed
  requestAnimationFrame/transform, IE event fallbacks) removed.
- `burner/world.ts`, `burner/system.ts`: world sizing measures the
  viewport via `World.measureSize()` instead of `body.scrollWidth/
  scrollHeight`, which report 0 height in post-2017 browsers when the
  body has no statically-positioned content.
- `soundbed/`: the package's `main.js` became `index.ts`; its files
  keep the guarded AudioParam defaults that fix a TypeError in modern
  browsers (non-finite AudioParam values throw).
