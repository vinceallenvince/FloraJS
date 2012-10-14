/*global exports */
/**
 * Creates a new Agent and appends it to Flora.elements.
 *
 * @constructor
 * @extends Element
 *
 * @param {Object} [opt_options] Agent options.
 * @param {string} [opt_options.id = "m-" + Agent._idCount] An id. If an id is not provided, one is created.
 * @param {Object|function} [opt_options.view] HTML representing the Agent instance.
 * @param {string} [opt_options.className = 'agent'] The corresponding DOM element's class name.
 * @param {number} [opt_options.mass = 10] Mass
 * @param {number} [opt_options.maxSpeed = 10] Maximum speed
 * @param {number} [opt_options.minSpeed = 0] Minimum speed
 * @param {number} [opt_options.motorSpeed = 2] Motor speed
 * @param {number} [opt_options.scale = 1] Scale
 * @param {number} [opt_options.angle = 0] Angle
 * @param {number} [opt_options.opacity = 0.85] Opacity
 * @param {number} [opt_options.lifespan = -1] Life span. Set to -1 to live forever.
 * @param {number} [opt_options.width = 20] Width
 * @param {number} [opt_options.height = 20] Height
 * @param {number} [opt_options.offsetDistance = 30] The distance from the center of the agent's parent.
 * @param {number} [opt_options.offsetAngle = 30] The angle of rotation around the parent carrying the agent.
 * @param {string} [opt_options.colorMode = 'rgb'] Color mode. Valid options are 'rgb'. 'hex' and 'hsl' coming soon.
 * @param {Array} [opt_options.color = null] The object's color expressed as an rbg or hsl value. ex: [255, 100, 0]
 * @param {number} [opt_options.zIndex = 1] z-index
 * @param {boolean} [opt_options.pointToDirection = true] If true, object will point in the direction it's moving.
 * @param {boolean} [opt_options.followMouse = false] If true, object will follow mouse.
 * @param {boolean} [opt_options.isStatic = false] If true, object will not move.
 * @param {boolean} [opt_options.checkEdges = true] Set to true to check the object's location against the world's bounds.
 * @param {boolean} [opt_options.wrapEdges = false] Set to true to set the object's location to the opposite
 * side of the world if the object moves outside the world's bounds.
 * @param {boolean} [opt_options.avoidEdges = false] Set to true to calculate a steering force away from the
 * world's bounds.
 * @param {number} [opt_options.avoidEdgesStrength = 200] Sets the strength of the steering force when avoidEdges = true.
 * @param {number} [opt_options.bounciness = 0.75] Set the strength of the rebound when an object is outside the
 * world's bounds and wrapEdges = false.
 * @param {number} [opt_options.maxSteeringForce = 10] Set the maximum strength of any steering force.
 * @param {number} [opt_options.turningRadius = 60] Used to calculate steering force with key control.
 * @param {number} [opt_options.thrust = 5] Used to apply forward motion with key control.
 * @param {boolean} [opt_options.flocking = false] Set to true to apply flocking forces to this object.
 * @param {number} [opt_options.desiredSeparation = Twice the object's default width] Sets the desired separation from other objects when flocking = true.
 * @param {number} [opt_options.separateStrength = 1] The strength of the force to apply to separating when flocking = true.
 * @param {number} [opt_options.alignStrength = 1] The strength of the force to apply to aligning when flocking = true.
 * @param {number} [opt_options.cohesionStrength = 1] The strength of the force to apply to cohesion when flocking = true.
 * @param {array} [opt_options.sensors = []] A list of sensors attached to this object.
 * @param {Object} [opt_options.flowField = null] If a flow field is set, object will use it to apply a force.
 * @param {function} [opt_options.beforeStep = ''] A function to run before the step() function.
 * @param {function} [opt_options.afterStep = ''] A function to run after the step() function.
 * @param {Object} [opt_options.acceleration = {x: 0, y: 0}] The object's initial acceleration.
 * @param {Object} [opt_options.velocity = {x: 0, y: 0}] The object's initial velocity.
 * @param {Object} [opt_options.location = The center of the world] The object's initial location.
 */


function Agent(opt_options) {

  'use strict';

  var options = opt_options || {},
      elements = exports.elementList.all() || [],
      liquids = exports.liquids || [],
      repellers = exports.repellers || [],
      attractors = exports.attractors || [],
      heats = exports.heats || [],
      colds = exports.colds || [],
      predators = exports.predators || [],
      lights = exports.lights || [],
      oxygen = exports.oxygen || [],
      food = exports.food || [],
      i, max, evt, world,
      constructorName = this.name || 'anon'; // this a problem when code is minified

  exports.Element.call(this, options);

  this.id = options.id || constructorName.toLowerCase() + "-" + Agent._idCount; // if no id, create one

  if (options.view && exports.Interface.getDataType(options.view) === "function") { // if view is supplied and is a function
    this.el = options.view.call(this);
  } else if (exports.Interface.getDataType(options.view) === "object") { // if view is supplied and is an object
    this.el = options.view;
  } else {
    this.el = document.createElement("div");
  }

  // if a world is not passed, use the first world in the universe
  this.world = options.world || exports.universe.first();
  world = this.world;

  this.className = options.className || constructorName.toLowerCase(); // constructorName.toLowerCase()
  this.className += ' floraElement';
  this.mass = options.mass || 10;
  this.maxSpeed = options.maxSpeed === 0 ? 0 : options.maxSpeed || 10;
  this.minSpeed = options.minSpeed || 0;
  this.motorSpeed = options.motorSpeed || 0;
  this.scale = options.scale === 0 ? 0 : options.scale || 1;
  this.angle = options.angle === 0 ? 0 : options.angle || 0;
  this.opacity = options.opacity === 0 ? 0 : options.opacity || 0.85;
  this.lifespan = options.lifespan === 0 ? 0 : options.lifespan || -1;
  this.width = options.width === 0 ? 0 : options.width || 20;
  this.height = options.height === 0 ? 0 : options.height || 20;
  this.offsetDistance = options.offsetDistance === 0 ? 0 : options.offsetDistance|| 30;
  this.offsetAngle = options.offsetAngle || 0;
  this.colorMode = options.colorMode || 'rgb';
  this.color = options.color || null;
  this.zIndex = options.zIndex === 0 ? 0 : options.zIndex || 1;
  this.pointToDirection = options.pointToDirection === false ? false : options.pointToDirection || true;
  this.followMouse = !!options.followMouse;
  this.isStatic = !!options.isStatic;
  this.draggable = !!options.draggable;
  this.checkEdges = options.checkEdges === false ? false : options.checkEdges || true;
  this.wrapEdges = !!options.wrapEdges;
  this.avoidEdges = !!options.avoidEdges;
  this.avoidEdgesStrength = options.avoidEdgesStrength === 0 ? 0 : options.avoidEdgesStrength || 200;
  this.bounciness = options.bounciness === 0 ? 0 : options.bounciness || 0.75;
  this.maxSteeringForce = options.maxSteeringForce === 0 ? 0 : options.maxSteeringForce || 100;
  this.turningRadius = options.turningRadius === 0 ? 0 : options.turningRadius || 90;
  this.thrust = options.thrust === 0 ? 0 : options.thrust || 5;
  this.flocking = !!options.flocking;
  this.desiredSeparation = options.desiredSeparation === 0 ? 0 : options.desiredSeparation || this.width * 2;
  this.separateStrength = options.separateStrength === 0 ? 0 : options.separateStrength || 0.3;
  this.alignStrength = options.alignStrength === 0 ? 0 : options.alignStrength || 0.2;
  this.cohesionStrength = options.cohesionStrength === 0 ? 0 : options.cohesionStrength || 0.1;
  this.sensors = options.sensors || [];
  this.flowField = options.flowField || null;
  this.acceleration = options.acceleration || new exports.Vector();
  this.velocity = options.velocity || new exports.Vector();
  this.location = options.location || new exports.Vector(world.width/2, world.height/2);
  this.controlCamera = !!options.controlCamera;
  this.beforeStep = options.beforeStep || undefined;
  this.afterStep = options.afterStep || undefined;

  elements.push(this); // push new instance of Agent

  this.el.id = this.id;
  this.el.className = this.sensors.length > 0 ? (this.className + ' hasSensor') : this.className;

  if (world.el) {
    world.el.appendChild(this.el); // append the view to the World
  }

  Agent._idCount += 1; // increment id

  if (this.className.search('liquid') !== -1) {
    liquids.push(this); // push new instance of liquids to liquid list
  } else if (this.className.search('repeller') !== -1) {
    repellers.push(this); // push new instance of repeller to repeller list
  } else if (this.className.search('attractor') !== -1) {
    attractors.push(this); // push new instance of attractor to attractor list
  } else if (this.className.search('heat') !== -1) {
    heats.push(this);
  } else if (this.className.search('cold') !== -1) {
    colds.push(this);
  } else if (this.className.search('predator') !== -1) {
    predators.push(this);
  } else if (this.className.search('light') !== -1) {
    lights.push(this);
  } else if (this.className.search('oxygen') !== -1) {
    oxygen.push(this);
  } else if (this.className.search('food') !== -1) {
    food.push(this);
  }

  if (this.controlCamera) { // if this object controls the camera

    exports.camera.controlObj = this;

    // need to position world so controlObj is centered on screen
    world.location.x = -world.width/2 + (exports.Utils.getWindowSize().width)/2 + (world.width/2 - this.location.x);
    world.location.y = -world.height/2 + (exports.Utils.getWindowSize().height)/2 + (world.height/2 - this.location.y);
  }

  if (this.draggable) {
    exports.Utils.addEvent(this.el, 'mouseover', exports.Element.mouseover.bind(this));
    exports.Utils.addEvent(this.el, 'mousedown', exports.Element.mousedown.bind(this));
    exports.Utils.addEvent(this.el, 'mousemove', exports.Element.mousemove.bind(this));
    exports.Utils.addEvent(this.el, 'mouseup', exports.Element.mouseup.bind(this));
    exports.Utils.addEvent(this.el, 'mouseout', exports.Element.mouseout.bind(this));
  }
}
exports.Utils.extend(Agent, exports.Element);

/**
 * Define a name property.
 */
Agent.prototype.name = 'agent';

/**
 * Increments as each Agent is created.
 * @type number
 * @default 0
 */
Agent._idCount = 0;


/**
 * Called every frame, step() updates the instance's properties.
 */
Agent.prototype.step = function() {

  'use strict';

  var i, max, dir, friction, force, nose, r, theta, x, y, sensor, className, sensorActivated,
    world = this.world, elements = exports.elementList.all();

  //

  if (this.beforeStep) {
    this.beforeStep.apply(this);
  }

  //

  if (!this.isStatic && !this.isPressed) {

    // APPLY FORCES -- start

    if (exports.liquids.length > 0) { // liquid
      for (i = 0, max = exports.liquids.length; i < max; i += 1) {
        if (this.id !== exports.liquids[i].id && this.isInside(exports.liquids[i])) {
          force = this.drag(exports.liquids[i]);
          this.applyForce(force);
          className = exports.liquids[i].className + ' activated';
          exports.liquids[i].el.className = className;
        }
      }
    }

    if (exports.repellers.length > 0) { // repeller
      for (i = 0, max = exports.repellers.length; i < max; i += 1) {
        if (this.id !== exports.repellers[i].id) {
          force = this.attract(exports.repellers[i]);
          this.applyForce(force);
        }
      }
    }

    if (exports.attractors.length > 0) { // attractor
      for (i = 0, max = exports.attractors.length; i < max; i += 1) {
        if (this.id !== exports.attractors[i].id) {
          force = this.attract(exports.attractors[i]);
          this.applyForce(force);
        }
      }
    }

    if (this.sensors.length > 0) { // Sensors
      for (i = 0, max = this.sensors.length; i < max; i += 1) {

        sensor = this.sensors[i];

        r = sensor.offsetDistance; // use angle to calculate x, y
        theta = exports.Utils.degreesToRadians(this.angle + sensor.offsetAngle);
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);

        sensor.location.x = this.location.x;
        sensor.location.y = this.location.y;
        sensor.location.add(new exports.Vector(x, y)); // position the sensor

        if (sensor.activated) {
          this.applyForce(sensor.getActivationForce({
            agent: this
          }));
          sensorActivated = true;
        }

      }
    }

    /**
     * If no sensor were activated and this.motorSpeed != 0,
     * apply a force in the direction of the current velocity.
     */
    if (!sensorActivated && this.motorSpeed) {
      dir = exports.Utils.clone(this.velocity);
      dir.normalize();
      if (this.velocity.mag() > this.motorSpeed) { // decelerate to defaultSpeed
        dir.mult(-this.motorSpeed);
      } else {
        dir.mult(this.motorSpeed);
      }
      this.applyForce(dir); // constantly applies a force
    }

    if (world.c) { // friction
      friction = exports.Utils.clone(this.velocity);
      friction.mult(-1);
      friction.normalize();
      friction.mult(world.c);
      this.applyForce(friction);
    }

    this.applyForce(world.wind); // wind

    this.applyForce(world.gravity); // gravity

    if (this.followMouse) { // follow mouse
      var t = {
        location: new exports.Vector(exports.mouse.loc.x, exports.mouse.loc.y)
      };
      this.applyForce(this.seek(t));
    }

    if (this.target) { // follow target
      this.applyForce(this.seek(this.target));
    }

    if (this.flowField) { // follow flow field
      var res = this.flowField.resolution,
        col = Math.floor(this.location.x/res),
        row = Math.floor(this.location.y/res),
        loc, target;

      if (this.flowField.field[col]) {
        loc = this.flowField.field[col][row];
        if (loc) { // !! sometimes loc is not available for edge cases; need to fix
          target = {
            location: new exports.Vector(loc.x, loc.y)
          };
        } else {
          target = {
            location: new exports.Vector(this.location.x, this.location.y)
          };
        }
        this.applyForce(this.follow(target));
      }

    }

    if (this.flocking) {
      this.flock(elements);
    }

    // end -- APPLY FORCES

    this.velocity.add(this.acceleration); // add acceleration

    if (this.maxSpeed) {
      this.velocity.limit(this.maxSpeed); // check if velocity > maxSpeed
    }

    if (this.minSpeed) {
      this.velocity.limitLow(this.minSpeed); // check if velocity < minSpeed
    }

    this.location.add(this.velocity); // add velocity

    if (this.pointToDirection) { // object rotates toward direction
      if (this.velocity.mag() > 0.1) {
        this.angle = exports.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
      }
    }

    if (this.controlCamera) { // check camera after velocity calculation
      this.checkCameraEdges();
    }

    if (this.checkEdges || this.wrapEdges) {
      this.checkWorldEdges(world);
    }


    if (this.parent) { // parenting

        if (this.offsetDistance) {

          r = this.offsetDistance; // use angle to calculate x, y
          theta = exports.Utils.degreesToRadians(this.parent.angle + this.offsetAngle);
          x = r * Math.cos(theta);
          y = r * Math.sin(theta);

          this.location.x = this.parent.location.x;
          this.location.y = this.parent.location.y;
          this.location.add(new exports.Vector(x, y)); // position the sensor

        } else {
          this.location = this.parent.location;
        }

    }

    //

    if (this.afterStep) {
      this.afterStep.apply(this);
    }

    this.acceleration.mult(0); // reset acceleration

    if (this.lifespan > 0) {
      this.lifespan -= 1;
    }
  }
};

/**
 * Applies a force to this object's acceleration.
 *
 * @param {Object} force The force to be applied (expressed as a vector).
 */
Agent.prototype.applyForce = function(force) {

  'use strict';

  // F = M * A
  var f = force.clone(); // make a copy of the force so the original force vector is not altered by dividing by mass; could also use static method

  f.div(this.mass);
  this.acceleration.add(f);
};

/**
 * Calculates a steering force to apply to an object seeking another object.
 *
 * @param {Object} target The object to seek.
 * @param {boolean} arrive Set to true to for this object to arrive and stop at the target.
 * @returns {Object} The force to apply.
 */
Agent.prototype.seek = function(target, arrive) {

  'use strict';

  var world = this.world,
    desiredVelocity = exports.Vector.VectorSub(target.location, this.location),
    distanceToTarget = desiredVelocity.mag();

  desiredVelocity.normalize();

  if (distanceToTarget < world.width/2) {
    var m = exports.Utils.map(distanceToTarget, 0, world.width/2, 0, this.maxSpeed);
    desiredVelocity.mult(m);
  } else {
    desiredVelocity.mult(this.maxSpeed);
  }

  var steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
  steer.limit(this.maxSteeringForce);
  return steer;
};

/**
 * Calculates a steering force to apply to an object following another object.
 *
 * @param {Object} target The object to seek.
 * @returns {Object} The force to apply.
 */
Agent.prototype.follow = function(target) {

  'use strict';

  var desiredVelocity = target.location;

  desiredVelocity.mult(this.maxSpeed);

  var steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
  steer.limit(this.maxSteeringForce);
  return steer;
};

/**
 * Bundles flocking behaviors (separate, align, cohesion) into one call.
 */
Agent.prototype.flock = function(elements) {

  'use strict';

  this.applyForce(this.separate(elements).mult(this.separateStrength));
  this.applyForce(this.align(elements).mult(this.alignStrength));
  this.applyForce(this.cohesion(elements).mult(this.cohesionStrength));
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to avoid all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.separate = function(elements) {

  'use strict';

  var i, max, element, diff, d,
  sum = new exports.Vector(),
  count = 0, steer;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    if (this.className === element.className && this.id !== element.id) {

      d = this.location.distance(element.location);

      if ((d > 0) && (d < this.desiredSeparation)) {
        diff = exports.Vector.VectorSub(this.location, element.location);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count += 1;
      }
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    steer = exports.Vector.VectorSub(sum, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }
  return new exports.Vector();
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to align with all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.align = function(elements) {

  'use strict';

  var i, max, element, diff, d,
    sum = new exports.Vector(),
    neighbordist = this.width * 2,
    count = 0, steer;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    d = this.location.distance(element.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.className === element.className && this.id !== element.id) {
        sum.add(element.velocity);
        count += 1;
      }
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxSpeed);
    steer = exports.Vector.VectorSub(sum, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }
  return new exports.Vector();
};

/**
 * Loops through a passed elements array and calculates a force to apply
 * to stay close to all elements.
 *
 * @param {array} elements An array of Flora elements.
 * @returns {Object} A force to apply.
 */
Agent.prototype.cohesion = function(elements) {

  'use strict';

  var i, max, element, diff, d,
    sum = new exports.Vector(),
    neighbordist = 10,
    count = 0, desiredVelocity, steer;

  for (i = 0, max = elements.length; i < max; i += 1) {
    element = elements[i];
    d = this.location.distance(element.location);

    if ((d > 0) && (d < neighbordist)) {
      if (this.className === element.className && this.id !== element.id) {
        sum.add(element.location);
        count += 1;
      }
    }
  }

  if (count > 0) {
    sum.div(count);
    desiredVelocity = exports.Vector.VectorSub(sum, this.location);
    desiredVelocity.normalize();
    desiredVelocity.mult(this.maxSpeed);
    steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }
  return new exports.Vector();
};

/**
 * Calculates a force to apply to flee a target. The force is the inverse
 * of the object's maximum speed.
 *
 * @param {Object} target The object to flee from.
 * @returns {Object} A force to apply.
 */
Agent.prototype.flee = function(target) {

  'use strict';

  var desiredVelocity = exports.Vector.VectorSub(target.location, this.location); // find vector pointing at target

  desiredVelocity.normalize(); // reduce to 1
  desiredVelocity.mult(-this.maxSpeed); // multiply by maxSpeed in opposite direction

  return desiredVelocity;
};

/**
 * Calculates a force to apply to simulate drag on an object.
 *
 * @param {Object} target The object that is applying the drag force.
 * @returns {Object} A force to apply.
 */
Agent.prototype.drag = function(target) {

  'use strict';

  var speed = this.velocity.mag(),
    dragMagnitude = -1 * target.c * speed * speed, // drag magnitude
    drag = exports.Utils.clone(this.velocity);

  drag.normalize(); // drag direction
  drag.mult(dragMagnitude);

  return drag;
};

/**
 * Calculates a force to apply to simulate attraction on an object.
 *
 * @param {Object} attractor The attracting object.
 * @returns {Object} A force to apply.
 */
Agent.prototype.attract = function(attractor) {

  'use strict';

  var force = exports.Vector.VectorSub(attractor.location, this.location),
    distance, strength;

  distance = force.mag();
  distance = exports.Utils.constrain(distance, this.width * this.height/8, attractor.width * attractor.height); // min = scale/8 (totally arbitrary); max = scale; the size of the attractor
  force.normalize();
  strength = (attractor.G * attractor.mass * this.mass) / (distance * distance);
  force.mult(strength);

  return force;
};

/**
 * Determines if this object is inside another.
 *
 * @param {Object} container The containing object.
 * @returns {boolean} Returns true if the object is inside the container.
 */
Agent.prototype.isInside = function(container) {

  'use strict';

  if (container) {
    if (this.location.x + this.width/2 > container.location.x - container.width/2 &&
      this.location.x - this.width/2 < container.location.x + container.width/2 &&
      this.location.y + this.height/2 > container.location.y - container.height/2 &&
      this.location.y - this.height/2 < container.location.y + container.height/2) {
      return true;
    }
  }
  return false;
};

/**
 * Determines if this object is outside the world bounds.
 *
 * @param {Object} world The world object.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.checkWorldEdges = function(world) {

  'use strict';

  var x = this.location.x,
    y = this.location.y,
    velocity = this.velocity,
    desiredVelocity,
    steer,
    maxSpeed,
    check = false,
    adjusted_loc,
    diff;

  // transform origin is at the center of the object

  if (this.wrapEdges) {
    if (this.location.x > world.width) {
      this.location = new exports.Vector(0, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
      check = true;
    } else if (this.location.x < 0) {
      this.location = new exports.Vector(world.width, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0);
      check = true;
    }
  } else {
    if (this.avoidEdges) {
      if (this.location.x < this.avoidEdgesStrength) {
        maxSpeed = this.maxSpeed;
      } else if (this.location.x > exports.world.width - this.avoidEdgesStrength) {
        maxSpeed = -this.maxSpeed;
      }
      if (maxSpeed) {
        desiredVelocity = new exports.Vector(maxSpeed, this.velocity.y),
        steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
        steer.limit(this.maxSteeringForce);
        this.applyForce(steer);
      }
    }
    if (this.location.x + this.width/2 > world.width) {
      this.location = new exports.Vector(world.width - this.width/2, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
      this.velocity.x *= -1 * this.bounciness;
      check = true;
     } else if (this.location.x < this.width/2) {
      this.location = new exports.Vector(this.width/2, this.location.y);
      diff = new exports.Vector(x - this.location.x, 0);
      this.velocity.x *= -1 * this.bounciness;
      check = true;
    }
  }

  ////

  maxSpeed = null;
  if (this.wrapEdges) {
    if (this.location.y > world.height) {
      this.location = new exports.Vector(this.location.x, 0);
      diff = new exports.Vector(0, y - this.location.y);
      check = true;
    } else if (this.location.y < 0) {
      this.location = new exports.Vector(this.location.x, world.height);
      diff = new exports.Vector(0, y - this.location.y);
      check = true;
    }
  } else {
    if (this.avoidEdges) {
      if (this.location.y < this.avoidEdgesStrength) {
        maxSpeed = this.maxSpeed;
      } else if (this.location.y > exports.world.height - this.avoidEdgesStrength) {
        maxSpeed = -this.maxSpeed;
      }
      if (maxSpeed) {
        desiredVelocity = new exports.Vector(this.velocity.x, maxSpeed),
        steer = exports.Vector.VectorSub(desiredVelocity, this.velocity);
        steer.limit(this.maxSteeringForce);
        this.applyForce(steer);
      }
    }
    if (this.location.y + this.height/2 > world.height) {
      this.location = new exports.Vector(this.location.x, world.height - this.height/2);
      diff = new exports.Vector(0, y - this.location.y);
      this.velocity.y *= -1 * this.bounciness;
      check = true;
      } else if (this.location.y < this.height/2) {
      this.location = new exports.Vector(this.location.x, this.height/2);
      diff = new exports.Vector(0, y - this.location.y);
      this.velocity.y *= -1 * this.bounciness;
      check = true;
    }
  }

  if (check && this.controlCamera) {
    world.location.add(diff); // !! do we need this? // add the distance difference to World.location
  }
  return check;
};

/**
 * Moves the world in the opposite direction of the Camera's controlObj.
 *
 * @param {Object} world The world object.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.checkCameraEdges = function() {

  'use strict';

  var vel = this.velocity.clone();

  this.world.location.add(vel.mult(-1));
};

/**
 * Returns this object's location.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's location.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.getLocation = function (type) {

  'use strict';

  if (!type) {
    return new exports.Vector(this.location.x, this.location.y);
  } else if (type === 'x') {
    return this.location.x;
  } else if (type === 'y') {
    return this.location.y;
  }
};

/**
 * Returns this object's velocity.
 *
 * @param {string} [type] If no type is supplied, returns a clone of this object's velocity.
                          Accepts 'x', 'y' to return their respective values.
 * @returns {boolean} Returns true if the object is outside the world.
 */
Agent.prototype.getVelocity = function (type) {

  'use strict';

  if (!type) {
    return new exports.Vector(this.velocity.x, this.velocity.y);
  } else if (type === "x") {
    return this.velocity.x;
  } else if (type === "y") {
    return this.velocity.y;
  }
};

exports.Agent = Agent;