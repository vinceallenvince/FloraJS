import DOMRenderer from './dom-renderer';

/**
 * The active renderer. Items and the System resolve it at call time,
 * so it can be swapped (e.g. setRenderer(new CanvasRenderer())) before
 * System.setup() runs.
 */
let renderer: DOMRenderer = new DOMRenderer();

export function getRenderer(): DOMRenderer {
  return renderer;
}

export function setRenderer(r: DOMRenderer): void {
  renderer = r;
}

export { DOMRenderer };
