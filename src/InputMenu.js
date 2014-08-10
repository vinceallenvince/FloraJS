var System = require('Burner').System,
    config = require('./config').config,
    Utils = require('Burner').Utils;

/**
 * Creates a new InputMenu object.
 * An Input Menu lists key strokes and other input available
 * for the user to interact with the system.
 *
 * @constructor
 *
 */
function InputMenu() {
  this.name = 'InputMenu';
}

/**
 * Initialize an instance of InputMenu.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {Object} [opt_options.world] A world.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the menu's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {number} [opt_options.opacity = 0.75] The menu's opacity.
 * @param {Array} [opt_options.color = 255, 255, 255] The menu's color.
 * @param {number} [opt_options.borderWidth = 1] The menu's border width.
 * @param {string} [opt_options.borderStyle = 'solid'] The menu's border style.
 * @param {Array} [opt_options.borderColor = 204, 204, 204] The menu's border color.
 */
InputMenu.prototype.init = function (world, opt_options) {

  var me = this, options = opt_options || {}, i, max, classNames;

  this.world = world || Burner.System.firstWorld();
  this.position = options.position || 'top left';
  this.opacity = typeof options.opacity === 'undefined' ? 0.75 : options.opacity;
  this.color = options.color || [255, 255, 255];
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || [204, 204, 204];
  this.colorMode = 'rgb';

  this.text = '\'' + String.fromCharCode(config.keyMap.pause).toLowerCase() + '\' = pause | ' +
    '\'' + String.fromCharCode(config.keyMap.resetSystem).toLowerCase() + '\' = reset | ' +
    '\'' + String.fromCharCode(config.keyMap.stats).toLowerCase() + '\' = stats';

  /**
   * Holds a reference to the caption's DOM elements.
   * @private
   */
  this.el = document.createElement('div');
  this.el.id = 'inputMenu';
  this.el.className = 'inputMenu ';
  classNames = this.position.split(' ');
  for (i = 0, max = classNames.length; i < max; i++) {
    this.el.className = this.el.className + 'inputMenu' + Utils.capitalizeFirstLetter(classNames[i]) + ' ';
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
  this.el.appendChild(document.createTextNode(this.text));
  if (document.getElementById('inputMenu')) {
    document.getElementById('inputMenu').parentNode.removeChild(document.getElementById('inputMenu'));
  }

  this.world.el.appendChild(this.el);

};

/**
 * A noop.
 */
InputMenu.prototype.draw = function() {};


/**
 * Removes the menu's DOM element.
 */
InputMenu.prototype.remove = function() {

  var id = this.el.id;

  this.el.parentNode.removeChild(this.el);
  if (!document.getElementById(id)) {
    return true;
  }
  return;
};

module.exports.InputMenu = InputMenu;

