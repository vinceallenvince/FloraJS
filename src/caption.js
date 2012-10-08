/*global exports */
/**
 * Creates a new Caption object.
 * Use captions to communicate short messages to users like a title
 * or simple instructions like 'click for more particles'.
 *
 * @constructor
 *
 * @param {Object} [opt_options] Options.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the caption's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {string} [opt_options.text = ''] The caption's text.
 * @param {number} [opt_options.opacity = 0.75] The caption's opacity.
 * @param {string} [opt_options.borderWidth = '1px'] The caption's border width.
 * @param {string} [opt_options.borderStyle = 'solid'] The caption's border style.
 * @param {Array|string} [opt_options.borderColor = 0.75] The caption's border color.
 */
function Caption(opt_options) {

  'use strict';

  var options = opt_options || {};

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
  this.position = options.position || 'top left';
  this.text = options.text || '';
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.borderWidth = options.borderWidth || '1px';
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || [204, 204, 204];
  this.colorMode = options.colorMode || 'rgb';

  /**
   * Holds a reference to the caption's DOM elements.
   * @private
   */
  this._el = document.createElement('div');
  this._el.id = 'caption';
  this._el.className = 'caption ' + this.position;
  this._el.style.opacity = this.opacity;
  this._el.style.borderWidth = this.borderWidth;
  this._el.style.borderStyle = this.borderStyle;
  if (typeof this.borderColor === 'string') {
    this._el.style.borderColor = this.borderColor;
  } else {
    this._el.style.borderColor = this.colorMode + '(' + this.borderColor[0] + ', ' + this.borderColor[1] +
        ', ' + this.borderColor[2] + ')';
  }
  this._el.appendChild(document.createTextNode(this.text));
  if (document.getElementById('caption')) {
    document.getElementById('caption').parentNode.removeChild(document.getElementById('caption'));
  }
  this.world.el.appendChild(this._el);
}

/**
 * Define a name property.
 */
Caption.prototype.name = 'caption';

/**
 * Removes the caption's DOM element.
 */
Caption.prototype.destroy = function() {

  'use strict';

  this._el.parentNode.removeChild(this._el);
};

exports.Caption = Caption;