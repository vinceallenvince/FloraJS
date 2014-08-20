var System = require('burner').System,
    Utils = require('burner').Utils;

/**
 * Creates a new Caption object.
 * Use captions to communicate short messages to users like a title
 * or simple instructions like 'click for more particles'.
 *
 * @constructor
 */
function Caption() {
  this.name = 'Caption';
}

/**
 * A noop.
 */
//Caption.prototype.reset = function () {};

/**
 * Intializes an instance of Caption.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {Object} [opt_options.world] A world.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the caption's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {string} [opt_options.text = ''] The caption's text.
 * @param {number} [opt_options.opacity = 0.75] The caption's opacity.
 * @param {Array} [opt_options.color = 255, 255, 255] The caption's color.
 * @param {number} [opt_options.borderWidth = 1] The caption's border width.
 * @param {string} [opt_options.borderStyle = 'solid'] The caption's border style.
 * @param {Array} [opt_options.borderColor = 204, 204, 204] The caption's border color.
 */
Caption.prototype.init = function (world, opt_options) {

  var options = opt_options || {}, i, max, classNames;

  if (!world) {
    throw new Error('Caption.init requires an instance of World.');
  }
  this.world = world;

  this.position = options.position || 'top left';
  this.text = options.text || '';
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [204, 204, 204];

  //

  this.colorMode = 'rgb';

  /**
   * Holds a reference to the caption's DOM elements.
   * @private
   */
  this.el = document.createElement('div');
  this.el.id = 'caption';
  this.el.className = 'caption ';
  classNames = this.position.split(' ');
  for (i = 0, max = classNames.length; i < max; i++) {
    this.el.className = this.el.className + 'caption' + Utils.capitalizeFirstLetter(classNames[i]) + ' ';
  }
  this.el.style.opacity = this.opacity;
  this.el.style.color = this.colorMode + '(' + this.color[0] + ', ' + this.color[1] +
        ', ' + this.color[2] + ')';
  this.el.style.borderWidth = this.borderWidth + 'px';
  this.el.style.borderStyle = this.borderStyle;
  if (typeof this.borderColor === 'string') {
    this.el.style.borderColor = this.borderColor;
  } else {
    this.el.style.borderColor = this.colorMode + '(' + this.borderColor[0] + ', ' + this.borderColor[1] +
        ', ' + this.borderColor[2] + ')';
  }
  this.el.style.zIndex = 100;
  this.el.appendChild(document.createTextNode(this.text));
  if (document.getElementById('caption')) {
    document.getElementById('caption').parentNode.removeChild(document.getElementById('caption'));
  }
  this.world.el.appendChild(this.el);
};

/**
 * A noop.
 */
Caption.prototype.draw = function() {};

/**
 * Updates the caption's text.
 * @param {string} text The text to replace the caption's current text.d
 */
Caption.prototype.update = function(text) {
  this.el.textContent = text;
};

/**
 * Removes the caption's DOM element.
 */
Caption.prototype.remove = function() {
  this.el.parentNode.removeChild(this.el);
};

module.exports.Caption = Caption;
