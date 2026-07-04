# Vendored dependencies

These are FloraJS's former npm dependencies (all by the same author,
unmaintained since ~2014), absorbed into the repo so the library can be
built and patched without resurrecting the abandoned packages.

Each file is a byte-identical copy of the `src/` contents of the exact
npm tarball that FloraJS 3.1.2 resolved to:

| Path | Package | Source |
| --- | --- | --- |
| `burner/` | burner@3.1.5 | https://registry.npmjs.org/burner/-/burner-3.1.5.tgz |
| `soundbed/` | soundbed@0.1.8 | https://registry.npmjs.org/soundbed/-/soundbed-0.1.8.tgz |
| `colorpalette.js` | colorpalette@0.1.5 | https://registry.npmjs.org/colorpalette/-/colorpalette-0.1.5.tgz |
| `borderpalette.js` | borderpalette@0.1.7 | https://registry.npmjs.org/borderpalette/-/borderpalette-0.1.7.tgz |
| `quietriot.js` | quietriot@0.1.2 | https://registry.npmjs.org/quietriot/-/quietriot-0.1.2.tgz |
| `drawing-utils-lib.js` | drawing-utils-lib@0.1.5 | https://registry.npmjs.org/drawing-utils-lib/-/drawing-utils-lib-0.1.5.tgz |
| `vector2d-lib.js` | vector2d-lib@0.0.7 | https://registry.npmjs.org/vector2d-lib/-/vector2d-lib-0.0.7.tgz |
| `fpsdisplay.js` | fpsdisplay@0.1.3 | https://registry.npmjs.org/fpsdisplay/-/fpsdisplay-0.1.3.tgz |

Deviations from the tarballs:

- Bare package specifiers (`require('drawing-utils-lib')` etc.) are
  rewritten to relative paths within `src/vendor/`, so the codebase is
  self-contained and resolvable by Node, Vitest, and esbuild without
  alias configuration. No other lines changed.
- `soundbed/index.js` is the package's `main.js` with its
  `require('./src/player')` changed to `require('./player')`, since the
  package's `src/` files were flattened into `soundbed/`.

Patches applied since vendoring (the point of vendoring is that these
files are now maintained here):

- `burner/world.js`, `burner/system.js`: world sizing measures the
  viewport via `World.measureSize()` instead of `body.scrollWidth/
  scrollHeight`, which report 0 height in post-2017 browsers when the
  body has no statically-positioned content.
