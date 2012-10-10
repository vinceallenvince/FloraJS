/*global exports */
/**
 * Creates a new StatsDisplay object.
 *
 * Use this class to create a field in the
 * top-left corner that displays the current
 * frames per second and total number of
 * processed in the System.animLoop.
 *
 * @constructor
 */
function StatsDisplay() {

  'use strict';

  var labelContainer, label;

  if (!Date.now) {
    return;
  }

  /**
   * Frames per second.
   * @private
   */
  this._fps = 0;

  /**
   * The current time.
   * @private
   */
  this._time = Date.now();

  /**
   * The time at the last frame.
   * @private
   */
  this._timeLastFrame = this._time;

  /**
   * The time the last second was sampled.
   * @private
   */
  this._timeLastSecond = this._time;

  /**
   * Holds the total number of frames
   * between seconds.
   * @private
   */
  this._frameCount = 0;

  /**
   * A reference to the DOM element containing the display.
   * @private
   */
  this._el = document.createElement('div');
  this._el.id = 'statsDisplay';
  this._el.className = 'statsDisplay';
  this._el.style.color = 'white';

  /**
   * A reference to the textNode displaying the total number of elements.
   * @private
   */
  this._totalElementsValue = null;

  /**
   * A reference to the textNode displaying the frame per second.
   * @private
   */
  this._fpsValue = null;

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

  /**
   * Initiates the requestAnimFrame() loop.
   */
  this._update();
}

/**
 * Returns the current frames per second value.
 * @returns {number} Frame per second.
 */
StatsDisplay.prototype.getFPS = function() {

  'use strict';

  return this._fps;
};

/**
 * If 1000ms have elapsed since the last evaluated second,
 * _fps is assigned the total number of frames rendered and
 * its corresponding textNode is updated. The total number of
 * elements is also updated.
 *
 * This function is called again via requestAnimFrame().
 *
 * @private
 */
StatsDisplay.prototype._update = function() {

  'use strict';

  var elementCount = exports.elementList.count();

  this._time = Date.now();
  this._frameCount++;

  // at least a second has passed
  if (this._time > this._timeLastSecond + 1000) {

    this._fps = this._frameCount;
    this._timeLastSecond = this._time;
    this._frameCount = 0;

    this._fpsValue.nodeValue = this._fps;
    this._totalElementsValue.nodeValue = elementCount;
  }
  window.requestAnimFrame(this._update.bind(this));
};

/**
 * Define a name property.
 */
StatsDisplay.prototype.name = 'statsdisplay';

exports.StatsDisplay = StatsDisplay;