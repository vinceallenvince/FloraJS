/*global exports */
/**
    A module representing a Caption object.
    @module Attractor
 */

/**
 * Creates a new Caption object.
 * Use captions to communicate short messages to users like a title
 * or simple instructions like 'click for more particles'.
 *
 * @constructor
 *
 * @param {Object} [opt_options] Options.
 * @param {string} [opt_options.position = 'top left'] A text representation
 *    of the object's location. Possible values are 'top left', 'top center', 'top right',
 *    'bottom left', 'bottom center', 'bottom right', 'center'.
 * @param {string} [opt_options.text = ''] The caption's text.
 * @param {number} [opt_options.opacity = 0.75] The caption's opacity.
 */
function Caption(opt_options) {

  'use strict';

  var options = opt_options || {},
      textNode;

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
  this.position = options.position || 'top left';
  this.text = options.text || '';
  textNode = document.createTextNode(this.text);
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.75;
  this.borderWidth = options.borderWidth || '1px';
  this.borderStyle = options.borderStyle || 'solid';
  this.borderColor = options.borderColor || '#ccc';
  this.el = document.createElement('div');
  this.el.id = 'caption';
  this.el.className = 'caption ' + this.position;
  this.el.style.opacity = this.opacity;
  this.el.style.borderWidth = this.borderWidth;
  this.el.style.borderStyle = this.borderStyle;
  this.el.style.borderColor = this.borderColor;
  this.el.appendChild(textNode);
  this.world.el.appendChild(this.el);
}

/**
 * Define a name property.
 */
Caption.name = 'caption';

exports.Caption = Caption;