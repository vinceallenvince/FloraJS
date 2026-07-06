/**
 * Flat description of an item's visual state for one frame. Items
 * produce this from getStyle(); a renderer consumes it. Only the keys
 * an item provides are rendered.
 */
export interface StyleProps {
  x: number;
  y: number;
  angle: number;
  scale: number;
  width?: number;
  height?: number;
  colorMode?: string;
  color0?: number;
  color1?: number;
  color2?: number;
  borderWidth?: number;
  borderStyle?: string;
  borderColor0?: number;
  borderColor1?: number;
  borderColor2?: number;
  borderRadius?: number;
  boxShadowOffsetX?: number;
  boxShadowOffsetY?: number;
  boxShadowBlur?: number;
  boxShadowSpread?: number;
  boxShadowColor0?: number;
  boxShadowColor1?: number;
  boxShadowColor2?: number;
  opacity?: number;
  zIndex?: number;
  visibility?: string;
  /** When set, the item renders as this glyph instead of a box. */
  text?: string;
  fontFamily?: string;
  [key: string]: any;
}

/**
 * Renders items as absolutely-positioned DOM elements — the classic
 * FloraJS renderer. Owns the element lifecycle (creation, per-frame
 * style writes); items only carry simulation state and a getStyle()
 * description of how they look.
 */
export default class DOMRenderer {
  /** Template for an item's transform style. */
  static _stylePosition =
      'transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>);';

  /**
   * Creates the DOM element backing an item and appends it to the
   * item's world. Called once from Item.init for new (non-recycled)
   * items.
   */
  addItem(item: any): void {
    item.el = document.createElement('div');
    item.el.id = item.id;
    item.el.className = 'item ' + item.name.toLowerCase();
    item.el.style.position = 'absolute';
    item.el.style.top = '-5000px';
    item.world.add(item.el);
  }

  /**
   * Draws one frame. Iterates in reverse record order (the historical
   * order) and defers to each item's draw() so classes with custom
   * draw behavior keep it.
   */
  drawFrame(records: any[]): void {
    for (var i = records.length - 1; i >= 0; i -= 1) {
      records[i].draw();
    }
  }

  /**
   * Writes an item's current visual state to its DOM element.
   */
  drawItem(item: any): void {
    if (typeof item.getStyle !== 'function') {
      return;
    }
    var style = item.getStyle();
    item.el.style.cssText = this.buildCSSText(style);
    // Text entities render their glyph as the element's content. Only
    // elements that have been in text mode are ever touched: writing
    // textContent on anything else would destroy child elements — a
    // World's element contains every item, and demos may decorate an
    // item's element with children (e.g. Flora.Sim.FishFood's eyes).
    if (typeof style.text !== 'undefined') {
      var text = String(style.text);
      if ((item.el as any)._floraText !== text) {
        item.el.textContent = text;
        (item.el as any)._floraText = text;
      }
    } else if (typeof (item.el as any)._floraText !== 'undefined') {
      item.el.textContent = '';
      delete (item.el as any)._floraText;
    }
  }

  /**
   * Builds a cssText string from a style description. Segments are
   * emitted only for the keys present, which reproduces the per-class
   * css of the pre-renderer code (base items have no border; range
   * displays have no background; particle systems are transform-only).
   */
  buildCSSText(props: StyleProps): string {
    var hsl = props.colorMode === 'hsl';

    var css = DOMRenderer._stylePosition
        .replace(/<x>/g, String(props.x))
        .replace(/<y>/g, String(props.y))
        .replace(/<angle>/g, String(props.angle))
        .replace(/<scale>/g, String(props.scale));

    if (typeof props.width !== 'undefined') {
      css += ' width: ' + props.width + 'px;';
    }
    if (typeof props.height !== 'undefined') {
      css += ' height: ' + props.height + 'px;';
    }
    if (typeof props.text !== 'undefined') {
      // Glyph mode: the item's color colors the text; no box fill.
      if (typeof props.color0 !== 'undefined') {
        css += ' color: ' + props.colorMode + '(' + props.color0 + ', ' +
            props.color1 + (hsl ? '%' : '') + ', ' + props.color2 + (hsl ? '%' : '') + ');';
      }
      css += ' font-family: ' + (props.fontFamily || 'sans-serif') + ';' +
          ' font-size: ' + props.height + 'px;' +
          ' line-height: ' + props.height + 'px;' +
          ' text-align: center;';
    } else if (typeof props.color0 !== 'undefined') {
      css += ' background-color: ' + props.colorMode + '(' + props.color0 + ', ' +
          props.color1 + (hsl ? '%' : '') + ', ' + props.color2 + (hsl ? '%' : '') + ');';
    }
    if (typeof props.borderWidth !== 'undefined' && typeof props.text === 'undefined') {
      css += ' border: ' + props.borderWidth + 'px ' + props.borderStyle + ' ' +
          (props.colorMode || 'rgb') + '(' + props.borderColor0 + ', ' +
          props.borderColor1 + (hsl ? '%' : '') + ', ' + props.borderColor2 + (hsl ? '%' : '') + ');';
    }
    if (typeof props.borderRadius !== 'undefined' && typeof props.text === 'undefined') {
      css += ' border-radius: ' + props.borderRadius + '%;';
    }
    if (typeof props.boxShadowOffsetX !== 'undefined' && typeof props.text === 'undefined') {
      css += ' box-shadow: ' + props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' +
          props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' +
          (props.colorMode || 'rgb') + '(' + props.boxShadowColor0 + ', ' +
          props.boxShadowColor1 + (hsl ? '%' : '') + ', ' + props.boxShadowColor2 + (hsl ? '%' : '') + ');';
    }
    if (typeof props.opacity !== 'undefined') {
      css += ' opacity: ' + props.opacity + ';';
    }
    if (typeof props.zIndex !== 'undefined') {
      css += ' z-index: ' + props.zIndex + ';';
    }
    if (typeof props.visibility !== 'undefined') {
      css += ' visibility: ' + props.visibility + ';';
    }
    return css;
  }
}
