import esbuild from 'esbuild';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const banner = `/*! florajs v${pkg.version} - ${new Date().toISOString().slice(0, 10)}
Vince Allen | Brooklyn, NY | vince@vinceallen.com | License: MIT */`;

// Demo bundle: IIFE exposing window.Flora, used by the pages in public/.
await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  globalName: 'Flora',
  banner: { js: banner },
  outfile: 'public/scripts/flora.min.js'
});

// Library build: ESM for npm consumers (package.json "exports").
await esbuild.build({
  entryPoints: [{ in: 'src/main.ts', out: 'florajs' }],
  bundle: true,
  sourcemap: true,
  format: 'esm',
  banner: { js: banner },
  outdir: 'dist'
});

// Type declarations for the library build.
execSync('npx tsc -p tsconfig.build.json', { stdio: 'inherit' });

await esbuild.build({
  entryPoints: [{ in: 'css/main.css', out: 'flora.min' }],
  minify: true,
  banner: { css: banner },
  outdir: 'public/css'
});

console.log('Built public/scripts/flora.min.js, public/css/flora.min.css and dist/');
