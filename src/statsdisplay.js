/*global exports */
/**
    A module representing a StatsDisplay object.
    @module StatsDisplay
 */

/**
 * Creates a new StatsDisplay object.
 *
 * @constructor
 *
 * @param {Object} [opt_options] Options.
 */
function StatsDisplay(opt_options) {

  'use strict';

  var options = opt_options || {},
      labelContainer,
      label;

  if (!Date.now) {
    return;
  }

  this._time = Date.now();
  this._timeLastFrame = this._time;
  this._timeLastSecond = this._time;
  this._frameCount = 0;

  this._el = document.createElement('div');
  this._el.id = 'statsDisplay';
  this._el.className = 'statsDisplay';
  this._el.style.color = 'white';

  // create totol elements label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  label = document.createTextNode('total elements: ');
  labelContainer.appendChild(label);
  this._el.appendChild(labelContainer);

  // create textNode for totalElements
  this._totalElementsValue = document.createTextNode('0');
  this._el.appendChild(this._totalElementsValue);

  // create fps label
  labelContainer = document.createElement('span');
  labelContainer.className = 'statsDisplayLabel';
  label = document.createTextNode('fps: ');
  labelContainer.appendChild(label);
  this._el.appendChild(labelContainer);

  // create textNode for fps
  this._fpsValue = document.createTextNode('0');
  this._el.appendChild(this._fpsValue);

  document.body.appendChild(this._el);

  this.update();
}

StatsDisplay.prototype.update = function() {

  'use strict';

  this._time = Date.now();
  this._frameCount++;

  // at least a second has passed
  if (this._time > this._timeLastSecond + 1000) {

    this._fps = this._frameCount;
    this._fpsValue.nodeValue = this._fps;
    this._totalElementsValue.nodeValue = exports.elementList.count();

    this._timeLastSecond = this._time;
    this._frameCount = 0;
  }
  window.requestAnimFrame(this.update.bind(this));
};

StatsDisplay.prototype.getFPS = function() {

  'use strict';

  return this._fps;
};

/**
 * Define a name property.
 */
StatsDisplay.name = 'statsDisplay';

exports.StatsDisplay = StatsDisplay;