import esbuild from 'esbuild';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const banner = `/*! florajs v${pkg.version} - ${new Date().toISOString().slice(0, 10)}
Vince Allen | Brooklyn, NY | vince@vinceallen.com | License: MIT */`;

await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  globalName: 'Flora',
  banner: { js: banner },
  outfile: 'public/scripts/flora.min.js'
});

await esbuild.build({
  entryPoints: [{ in: 'css/main.css', out: 'flora.min' }],
  minify: true,
  banner: { css: banner },
  outdir: 'public/css'
});

console.log('Built public/scripts/flora.min.js and public/css/flora.min.css');
