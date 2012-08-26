/*global exports */
/**
    A module representing a Particle.
    @module Particle
 */

/**
 * Creates a new Particle.
 *
 * @constructor
 * @extends Mover
 *
 * @param {Object} [opt_options] Particle options.
 * @param {number} [opt_options.lifespan = 40] The number of frames before particle dies. Set to -1 for infinite life.
 * @param {number} [opt_options.width = 10] Width
 * @param {number} [opt_options.height = 10] Height
 * @param {string} [opt_options.borderRadius = '100%'] The particle's border radius.
 */
function Particle(opt_options) {

'use strict';

var options = opt_options || {};

exports.Mover.call(this, options);

this.lifespan = options.lifespan || 40;
this.borderRadius = options.borderRadius || '100%';
}
exports.Utils.inherit(Particle, exports.Mover);

/**
 * Define a name property. Used to assign a class name and prefix an id.
 */
Particle.name = 'particle';

Particle.prototype.step = function () {

  'use strict';

	var world = exports.world,
			friction;

	//

	if (this.beforeStep) {
		this.beforeStep.apply(this);
	}

	//

	if (!this.isStatic && !this.isPressed) {

		// start -- APPLY FORCES

		if (world.c) { // friction
			friction = exports.Utils.clone(this.velocity);
			friction.mult(-1);
			friction.normalize();
			friction.mult(world.c);
			this.applyForce(friction);
		}

		this.applyForce(world.wind); // wind
		this.applyForce(world.gravity); // gravity


		if (this.checkEdges || this.wrapEdges) {
			this.checkWorldEdges(world);
		}

		// end -- APPLY FORCES

		this.velocity.add(this.acceleration); // add acceleration

		if (this.maxSpeed) {
			this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
		}

		this.location.add(this.velocity); // add velocity

		// opacity
		this.opacity = exports.Utils.map(this.lifespan, 0, 40, 0, 1);


		if (this.lifespan > 0) {
			this.lifespan -= 1;
		} else if (this.lifespan === 0) {
			exports.destroyElement(this.id);
		}
		this.acceleration.mult(0); // reset acceleration
	}
};
exports.Particle = Particle;