/**
 * Creates a Convolver.
 * @param {Object} context A Web Audio context.
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function Convolver(context, opt_options) {
  var options = opt_options || {};
  this.context = context;
  this.node = context.createConvolver();
  this.node.normalize = true;
}

/**
 * Sets the type of Convolver effect.
 * @param {number} type Sets the reverb level.
 * @example
 * 0 - none
 * 1 - inverse
 * 2 - small
 * 3 - medium
 * 4 - large
 * 5 - huge
 */
Convolver.prototype.setEffect = function(type) {

  var noiseBuffer;

  switch (type) {
    case 1:
      noiseBuffer = this.context.createBuffer(2, 0.01 * this.context.sampleRate,
          this.context.sampleRate);
      break;

    case 2:
      noiseBuffer = this.context.createBuffer(2, 1 * this.context.sampleRate,
          this.context.sampleRate);
      break;

    case 3:
      noiseBuffer = this.context.createBuffer(2, 3 * this.context.sampleRate,
          this.context.sampleRate);
      break;

    case 4:
      noiseBuffer = this.context.createBuffer(2, 6 * this.context.sampleRate,
          this.context.sampleRate);
      break;

    case 5:
      noiseBuffer = this.context.createBuffer(2, 12 * this.context.sampleRate,
          this.context.sampleRate);
      break;
    default:
      this.node.buffer = null;
      return;
  }

  var left = noiseBuffer.getChannelData(0),
      right = noiseBuffer.getChannelData(1);

  for (var i = 0, max = noiseBuffer.length; i < max; i++) {
    left[i] = Math.random() * 2 - 1;
    right[i] = Math.random() * 2 - 1;
  }

  this.node.buffer = noiseBuffer;
};

module.exports = Convolver;
