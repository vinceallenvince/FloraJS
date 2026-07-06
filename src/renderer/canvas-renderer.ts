import DOMRenderer, { StyleProps } from './dom-renderer';

/**
 * Renders items into a single <canvas> per World instead of one DOM
 * element per item. Worlds keep their DOM element (background, border,
 * camera transform) with the canvas as its only child, so page layout,
 * captions and menus behave exactly as with the DOMRenderer.
 *
 * Trade-offs vs the DOMRenderer:
 * - Scales to thousands of items (one draw list, no per-item style
 *   recalc).
 * - Items have no DOM element, so per-item CSS styling and the
 *   `draggable` option are unavailable (drag needs canvas hit-testing,
 *   not yet implemented).
 * - CSS box-shadow "spread" is approximated with a backing shape.
 */
export default class CanvasRenderer extends DOMRenderer {
  /**
   * Rasterized glyphs for text entities, keyed by
   * text|font|size|color. fillText per item per frame rasterizes the
   * glyph every draw (~19fps at 800 emoji); drawing a cached sprite
   * costs about the same as a rect fill.
   */
  _glyphSprites: Map<string, HTMLCanvasElement> = new Map();

  /**
   * Canvas items carry no DOM element; simulation state only.
   */
  addItem(item: any): void {
    item.el = null;
  }

  /**
   * Returns (rasterizing on first use) the sprite for a glyph.
   * Sprites render at 2x for crispness, with padding for glyphs that
   * overhang their em box.
   */
  _glyphSprite(text: string, fontFamily: string, size: number, fill: string): HTMLCanvasElement {
    var key = text + '|' + fontFamily + '|' + size + '|' + fill;
    var sprite = this._glyphSprites.get(key);
    if (!sprite) {
      if (this._glyphSprites.size >= 256) {
        // Backstop against unbounded growth (e.g. per-frame color
        // animation on text items); a rebuild costs one frame.
        this._glyphSprites.clear();
      }
      sprite = document.createElement('canvas');
      var pad = Math.ceil(size * 0.3);
      var logical = size + pad * 2;
      sprite.width = logical * 2;
      sprite.height = logical * 2;
      var sctx = sprite.getContext('2d')!;
      sctx.scale(2, 2);
      sctx.font = size + 'px ' + fontFamily;
      sctx.textAlign = 'center';
      sctx.textBaseline = 'middle';
      sctx.fillStyle = fill;
      sctx.fillText(text, logical / 2, logical / 2);
      this._glyphSprites.set(key, sprite);
    }
    return sprite;
  }

  /**
   * Draws one frame: style each World's element (as the DOMRenderer
   * would), then paint all items into their world's canvas in zIndex
   * order.
   */
  drawFrame(records: any[]): void {
    var i, max;

    // Prepare each world: element style + sized canvas.
    for (i = 0, max = records.length; i < max; i++) {
      if (records[i].name === 'World') {
        this._prepareWorld(records[i]);
      }
    }

    // Painter's algorithm: ascending zIndex, insertion order for ties
    // (matches DOM stacking of equal z-indexes).
    var items = [];
    for (i = 0, max = records.length; i < max; i++) {
      if (records[i].name !== 'World' && typeof records[i].getStyle === 'function') {
        items.push(records[i]);
      }
    }
    items.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (i = 0, max = items.length; i < max; i++) {
      var ctx = items[i].world._canvasCtx;
      if (ctx) {
        this._drawShape(ctx, items[i].getStyle());
      }
    }
  }

  /**
   * Draws a single item immediately (compatibility with direct
   * item.draw() calls; the normal path is drawFrame).
   */
  drawItem(item: any): void {
    if (typeof item.getStyle !== 'function') {
      return;
    }
    if (item.name === 'World') {
      this._prepareWorld(item);
      return;
    }
    var ctx = item.world && item.world._canvasCtx;
    if (ctx) {
      this._drawShape(ctx, item.getStyle());
    }
  }

  /**
   * Styles the world's DOM element and keeps a device-pixel-ratio-aware
   * canvas sized to the world inside it, cleared for this frame.
   */
  _prepareWorld(world: any): void {
    world.el.style.cssText = this.buildCSSText(world.getStyle());

    var canvas: HTMLCanvasElement = world._canvas;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'flora-canvas';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      world.el.appendChild(canvas);
      world._canvas = canvas;
      world._canvasCtx = canvas.getContext('2d');
    }

    var dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    var w = Math.max(1, Math.round(world.width * dpr));
    var h = Math.max(1, Math.round(world.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = world.width + 'px';
      canvas.style.height = world.height + 'px';
    }

    var ctx = world._canvasCtx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, world.width, world.height);
  }

  /**
   * Paints one style description. Mirrors the CSS semantics the
   * DOMRenderer produces: transform about the box center, border-box
   * borders, percentage border-radius, rgb/hsl fills.
   */
  _drawShape(ctx: CanvasRenderingContext2D, s: StyleProps): void {
    if (typeof s.width === 'undefined' || typeof s.height === 'undefined') {
      return; // transform-only items (e.g. ParticleSystem containers) are invisible
    }
    if (s.visibility === 'hidden') {
      return;
    }

    var w = s.width, h = s.height;

    ctx.save();
    // CSS: translate3d(x, y) rotate() scale() with origin at box center.
    ctx.translate(s.x + w / 2, s.y + h / 2);
    if (s.angle) {
      ctx.rotate(s.angle * Math.PI / 180);
    }
    if (s.scale && s.scale !== 1) {
      ctx.scale(s.scale, s.scale);
    }
    ctx.globalAlpha = typeof s.opacity === 'undefined' ? 1 : s.opacity;

    var fill = this._colorString(s.colorMode, s.color0, s.color1, s.color2);

    // Glyph mode: draw the item as text (sized by height, colored by
    // the item's color — color emoji ignore fillStyle) instead of a
    // box. Inherits the transform, so glyphs rotate with their item.
    if (typeof s.text !== 'undefined') {
      var sprite = this._glyphSprite(String(s.text), s.fontFamily || 'sans-serif',
          Math.round(h), fill || 'rgb(255, 255, 255)');
      var logicalSize = sprite.width / 2;
      ctx.drawImage(sprite, -logicalSize / 2, -logicalSize / 2, logicalSize, logicalSize);
      ctx.restore();
      return;
    }

    var radius = this._cornerRadius(s.borderRadius, w, h);

    // CSS box-shadow spread has no canvas equivalent: approximate with
    // a backing shape inflated by the spread, using the shadow color.
    if (s.boxShadowSpread) {
      var shadowColor = this._colorString(s.colorMode, s.boxShadowColor0, s.boxShadowColor1, s.boxShadowColor2);
      if (shadowColor) {
        var sw = w + s.boxShadowSpread * 2,
            sh = h + s.boxShadowSpread * 2;
        if (s.boxShadowBlur) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = s.boxShadowBlur;
        }
        ctx.fillStyle = shadowColor;
        this._roundRectPath(ctx, sw, sh, this._cornerRadius(s.borderRadius, sw, sh), 0);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    } else if (s.boxShadowBlur || s.boxShadowOffsetX || s.boxShadowOffsetY) {
      var blurColor = this._colorString(s.colorMode, s.boxShadowColor0, s.boxShadowColor1, s.boxShadowColor2);
      if (blurColor) {
        ctx.shadowColor = blurColor;
        ctx.shadowBlur = s.boxShadowBlur || 0;
        ctx.shadowOffsetX = s.boxShadowOffsetX || 0;
        ctx.shadowOffsetY = s.boxShadowOffsetY || 0;
      }
    }

    if (fill) {
      ctx.fillStyle = fill;
      this._roundRectPath(ctx, w, h, radius, 0);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    if (s.borderWidth && s.borderStyle && s.borderStyle !== 'none') {
      var stroke = this._colorString(s.colorMode || 'rgb', s.borderColor0, s.borderColor1, s.borderColor2);
      if (stroke) {
        var bw = s.borderWidth;
        ctx.strokeStyle = stroke;
        if (s.borderStyle === 'dashed') {
          ctx.setLineDash([bw * 3, bw * 2]);
        } else if (s.borderStyle === 'dotted') {
          ctx.setLineDash([1, bw * 2]);
          ctx.lineCap = 'round';
        }
        // CSS borders paint inside the border-box (.item is
        // box-sizing: border-box); centered canvas strokes inset to
        // match. 'double' is two lines of a third the width with a
        // third-width gap, as CSS renders it.
        var lines = s.borderStyle === 'double' ?
            [{ size: bw / 3, inset: bw / 3 }, { size: bw / 3, inset: bw * 5 / 3 }] :
            [{ size: bw, inset: bw }];
        for (var i = 0; i < lines.length; i++) {
          ctx.lineWidth = lines[i].size;
          this._roundRectPath(ctx, w - lines[i].inset, h - lines[i].inset, radius, 0);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
    }

    ctx.restore();
  }

  /**
   * A rounded-rect path centered on the current origin.
   */
  _roundRectPath(ctx: CanvasRenderingContext2D, w: number, h: number, radius: number, inset: number): void {
    ctx.beginPath();
    if (radius > 0) {
      ctx.roundRect(-w / 2 + inset, -h / 2 + inset, w - inset * 2, h - inset * 2, radius);
    } else {
      ctx.rect(-w / 2 + inset, -h / 2 + inset, w - inset * 2, h - inset * 2);
    }
  }

  /**
   * Maps a CSS percentage border-radius onto a circular corner radius:
   * radii are p% of the box, clamped to half the box as CSS does
   * (100% on a square = circle).
   */
  _cornerRadius(borderRadius: number | undefined, w: number, h: number): number {
    if (!borderRadius) {
      return 0;
    }
    var min = Math.min(w, h);
    return Math.min((borderRadius / 100) * min, min / 2);
  }

  /**
   * Builds an rgb()/hsl() color string, or null when the components
   * are not numeric (e.g. Connector's 'transparent' color, which the
   * DOM path also renders as no fill).
   */
  _colorString(mode: string | undefined, c0: any, c1: any, c2: any): string | null {
    if (typeof c0 !== 'number' || typeof c1 !== 'number' || typeof c2 !== 'number') {
      return null;
    }
    var hsl = mode === 'hsl';
    return (hsl ? 'hsl' : 'rgb') + '(' + c0 + ', ' + c1 + (hsl ? '%' : '') + ', ' + c2 + (hsl ? '%' : '') + ')';
  }
}
