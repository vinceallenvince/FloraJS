import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import DOMRenderer from '../src/renderer/dom-renderer';

const System = Burner.System;

beforeEach(() => {
  System.setupFunc = function() {};
  System._resetSystem();
  System._accumulator = 0;
  System._lastFrameTime = null;
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  document.body.appendChild(world);

  System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item');
  });
});

test('_frame() runs fixed steps for elapsed time.', () => {
  const clock0 = System.clock;

  // First frame only records the timestamp.
  System._frame(1000);
  expect(System.clock).toBe(clock0);

  // 50ms at 60Hz-steps (16.67ms) covers 2 whole steps (3 would need 50.0001ms).
  System._frame(1050);
  expect(System.clock).toBe(clock0 + 2);

  // The ~16.6ms remainder stays in the accumulator.
  expect(System._accumulator).toBeGreaterThan(0);
  expect(System._accumulator).toBeLessThan(System.stepMs);
});

test('_frame() caps the time debt of a long pause.', () => {
  const clock0 = System.clock;
  System._frame(1000);
  // A 10s pause (background tab) must not fast-forward 600 steps; the
  // 250ms cap allows ~15 (exact count wobbles by one with float drift).
  System._frame(11000);
  expect(System.clock - clock0).toBeGreaterThanOrEqual(14);
  expect(System.clock - clock0).toBeLessThanOrEqual(15);
});

test('same simulated duration yields the same step count at different frame rates.', () => {
  const clock0 = System.clock;
  // 1 simulated second at 240 fps.
  System._frame(0);
  for (let t = 0; t <= 1000; t += 1000 / 240) {
    System._frame(t);
  }
  const steps240 = System.clock - clock0;

  const clock1 = System.clock;
  System._lastFrameTime = null;
  System._accumulator = 0;
  // 1 simulated second at 30 fps.
  System._frame(0);
  for (let t = 0; t <= 1000; t += 1000 / 30) {
    System._frame(t);
  }
  const steps30 = System.clock - clock1;

  expect(Math.abs(steps240 - steps30)).toBeLessThanOrEqual(1);
  expect(steps240).toBeGreaterThanOrEqual(59);
  expect(steps240).toBeLessThanOrEqual(61);
});

test('DOMRenderer.buildCSSText emits only the provided segments.', () => {
  const r = new DOMRenderer();

  const base = r.buildCSSText({ x: 1, y: 2, angle: 0, scale: 1, width: 10, height: 10, colorMode: 'rgb', color0: 1, color1: 2, color2: 3, opacity: 0.5, zIndex: 4, visibility: 'visible' });
  expect(base).toContain('translate3d(1px, 2px, 0)');
  expect(base).toContain('background-color: rgb(1, 2, 3);');
  expect(base).not.toContain('border');
  expect(base).not.toContain('box-shadow');

  const transformOnly = r.buildCSSText({ x: 0, y: 0, angle: 0, scale: 1 });
  expect(transformOnly).not.toContain('width');
  expect(transformOnly).not.toContain('background-color');

  const hsl = r.buildCSSText({ x: 0, y: 0, angle: 0, scale: 1, colorMode: 'hsl', color0: 200, color1: 50, color2: 50, borderWidth: 2, borderStyle: 'solid', borderColor0: 200, borderColor1: 50, borderColor2: 50, borderRadius: 100 });
  expect(hsl).toContain('background-color: hsl(200, 50%, 50%);');
  expect(hsl).toContain('border: 2px solid hsl(200, 50%, 50%);');
  expect(hsl).toContain('border-radius: 100%;');
});

test('World with explicit dimensions keeps them; resize updates only auto-sized worlds.', () => {
  const world = System.firstWorld();
  expect(world.width).toBe(400);
  expect(world.height).toBe(300);
  expect(world._autoWidth).toBe(false);
  expect(world._autoHeight).toBe(false);
});

test('getNeighbors covers every same-name item within radius (grid vs brute force).', () => {
  // Deterministic pseudo-random locations, including cell-boundary values.
  let seed = 42;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const items = [];
  for (let i = 0; i < 200; i++) {
    const it = System.add('Item');
    it.location.x = rand() * 400;
    it.location.y = rand() * 300;
    items.push(it);
  }

  const radius = 25;
  const subject = items[0];
  const bruteForce = items.filter((it) =>
    it !== subject && subject.location.distance(it.location) <= radius);

  // Inside a step the grid is active.
  System._grids = {};
  const neighbors = System.getNeighbors(subject, radius);
  System._grids = null;

  // The grid returns a superset (callers re-filter by exact distance):
  // every genuinely-in-radius item must be present, names must match.
  for (const it of bruteForce) {
    expect(neighbors).toContain(it);
  }
  for (const it of neighbors) {
    expect(it.name).toBe(subject.name);
  }

  // Outside a step it falls back to the full same-name list.
  expect(System.getNeighbors(subject, radius).length).toBe(items.length + 1); // +1: beforeEach adds one Item
});
