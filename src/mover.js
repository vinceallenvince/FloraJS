/*global exports*/
(function(exports) {  

  /**
   * Creates a new Mover and appends it to Flora.elements.
   *
   * @constructor
   * @extends Obj
   *
   * @param {Object} [opt_options] Mover options.
   * @param {string} [opt_options.id = "m-" + Mover._idCount] An id. If an id is not provided, one is created.
   * @param {Object|function} [opt_options.view] HTML representing the Mover instance.
   * @param {string} [opt_options.className = 'mover'] The corresponding DOM element's class name.
   * @param {number} [opt_options.mass = 10] Mass
   * @param {number} [opt_options.maxSpeed = 10] Maximum speed
   * @param {number} [opt_options.minSpeed = 0] Minimum speed
   * @param {number} [opt_options.scale = 1] Scale
   * @param {number} [opt_options.angle = 0] Angle
   * @param {number} [opt_options.opacity = 0.85] Opacity
   * @param {number} [opt_options.lifespan = -1] Life span. Set to -1 to live forever.
   * @param {number} [opt_options.width = 20] Width
   * @param {number} [opt_options.height = 20] Height
   * @param {string} [opt_options.colorMode = 'rgb'] Color mode
   * @param {Object} [opt_options.color = {r: 197, g: 177, b: 115}] The object's color.
   * @param {number} [opt_options.zIndex = 10] z-index
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

   
  function Mover(opt_options) {

    var options = opt_options || {}, i, max, evt;

    this.id = options.id || this.constructor.name.toLowerCase() + "-" + Mover._idCount; // if no id, create one

    if (options.view && Interface.getDataType(options.view) === "function") { // if view is supplied and is a function
      this.el = options.view.call();
    } else if (Interface.getDataType(options.view) === "object") { // if view is supplied and is an object
      this.el = options.view;
    } else {
      this.el = document.createElement("div");
    }
    
    /* TODO
       Provide default values here.
    */
    // optional
    this.className = options.className || this.constructor.name.toLowerCase();
    this.mass = options.mass || 10;  
    this.maxSpeed = options.maxSpeed || 10;
    this.minSpeed = options.minSpeed || 0;
    this.scale = options.scale || 1;   
    this.angle = options.angle || 0;   
    this.opacity = options.opacity || 0.85;   
    this.lifespan = options.lifespan || -1;    
    this.width = options.width || 20; 
    this.height = options.height || 20;    
    this.colorMode = options.colorMode || 'rgb';     
    this.color = options.color || {r: 197, g: 177, b: 115};
    this.zIndex = options.zIndex || 10;  
    this.pointToDirection = options.pointToDirection || true;      
    this.followMouse = options.followMouse || false;     
    this.isStatic = options.isStatic || false;    
    this.checkEdges = options.checkEdges || true;    
    this.wrapEdges = options.wrapEdges || false;   
    this.avoidEdges = options.avoidEdges || false;    
    this.avoidEdgesStrength = options.avoidEdgesStrength || 200;    
    this.bounciness = options.bounciness || 0.75;    
    this.maxSteeringForce = options.maxSteeringForce || 10;  
    this.flocking = options.flocking || false;  
    this.desiredSeparation = options.desiredSeparation || this.width * 2;
    this.separateStrength = options.separateStrength || 1;  
    this.alignStrength = options.alignStrength || 1;     
    this.cohesionStrength = options.cohesionStrength || 1;      
    this.sensors = options.sensors || [];
    this.flowField = options.flowField || null;
    this.beforeStep = options.beforeStep || '';    
    this.afterStep = options.afterStep || '';   
    this.acceleration = options.acceleration || exports.PVector.create(0, 0);
    this.velocity = options.velocity || exports.PVector.create(0, 0);
    this.location = options.location || exports.PVector.create(Flora.World.width/2, Flora.World.height/2);
    this.controlCamera = options.controlCamera || false;

    exports.elements.push(this); // push new instance of Mover

    exports.World.el.appendChild(this.el); // append the view to the World
    
    Mover._idCount += 1; // increment id

    if (this.className === "liquid") {
      Flora.liquids.push(this); // push new instance of liquids to liquid list
    } else if (this.className === "repeller") {
      Flora.repellers.push(this); // push new instance of repeller to repeller list
    } else if (this.className === "attractor") {
      Flora.attractors.push(this); // push new instance of attractor to attractor list
    } else if (this.className === "heat") {
      Flora.heats.push(this);
    } else if (this.className === "cold") {
      Flora.colds.push(this);
    } else if (this.className === "predator") {
      Flora.predators.push(this);
    } else if (this.className === "light") {
      Flora.lights.push(this);
    } else if (this.className === "oxygen") {
      Flora.oxygen.push(this);
    } else if (this.className === "food") {
      Flora.food.push(this);
    }
    
    if (this.controlCamera) { // if this object controls the camera

      Flora.Camera.controlObj = this;
      
      // need to position world so controlObj is centered on screen
      Flora.World.location.x = -Flora.World.width/2 + $(window).width()/2 + (Flora.World.width/2 - this.location.x);
      Flora.World.location.y = -Flora.World.height/2 + $(window).height()/2 + (Flora.World.height/2 - this.location.y);
    }

    /*inst.el.addEventListener("mouseenter", function (e) { Obj.mouseenter.call(inst, e); }, false);
    inst.el.addEventListener("mousedown", function (e) { Obj.mousedown.call(inst, e); }, false);
    inst.el.addEventListener("mousemove", function (e) { Obj.mousemove.call(inst, e); }, false);
    inst.el.addEventListener("mouseup", function (e) { Obj.mouseup.call(inst, e); }, false);
    inst.el.addEventListener("mouseleave", function (e) { Obj.mouseleave.call(inst, e); }, false);*/      
    
  };
  exports.Utils.inherit(Mover, exports.Obj);
  
  /**
   * Increments as each Mover is created.
   * @type number
   * @default 0
   */
  Mover._idCount = 0;
  

  /**
   * Called every frame, step() updates the instance's properties.
   */   
  Mover.prototype.step = function() {

    var i, max, dir, friction, force, nose,
      world = Flora.World;
    
    //
    
    if (this.beforeStep) {
      this.beforeStep.apply(this);
    }
    
    //
      
    if (!this.isStatic && !this.isPressed) {

      // APPLY FORCES -- start

      if (Flora.liquids.length > 0) { // liquid
        for (i = 0, max = Flora.liquids.length; i < max; i += 1) {
          if (this.id !== Flora.liquids[i].id && this.isInside(Flora.liquids[i])) {
            force = this.drag(Flora.liquids[i]);
            this.applyForce(force);
          }
        }
      }
      
      if (Flora.repellers.length > 0) { // repeller
        for (i = 0, max = Flora.repellers.length; i < max; i += 1) {
          if (this.id !== Flora.repellers[i].id) {
            force = this.attract(Flora.repellers[i]);
            this.applyForce(force);
          }
        }
      }
      
      if (Flora.attractors.length > 0) { // repeller
        for (i = 0, max = Flora.attractors.length; i < max; i += 1) {
          if (this.id !== Flora.attractors[i].id) {
            force = this.attract(Flora.attractors[i]);
            this.applyForce(force);
          }
        }
      }
      
      if (this.sensors.length > 0) { // Sensors
        for (i = 0, max = this.sensors.length; i < max; i += 1) {
          
          var sensor = this.sensors[i];
          
          var r = sensor.length; // use angle to calculate x, y
          var theta = Utils.degreesToRadians(this.angle + sensor.offsetAngle);
          var x = r * Math.cos(theta);
          var y = r * Math.sin(theta);
          
          sensor.location.x = this.location.x;
          sensor.location.y = this.location.y;
          sensor.location.add(exports.PVector.create(x, y)); // position the sensor
          
          if (sensor.activated) {
            this.applyForce(sensor.getActivationForce({
              mover: this
            }))
          }
          
        }
      }
      
      if (world.c) { // friction
        friction = Utils.clone(this.velocity);
        friction.mult(-1);
        friction.normalize();
        friction.mult(world.c);
        this.applyForce(friction);
      }
      
      this.applyForce(world.wind); // wind
            
      this.applyForce(world.gravity); // gravity
      
      if (this.followMouse) { // follow mouse
        var t = {
          location: exports.PVector.create(world.mouseX, world.mouseY)
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
              location: exports.PVector.create(loc.x, loc.y)
            };
          } else {
            target = {
              location: exports.PVector.create(this.location.x, this.location.y)
            };              
          }
          this.applyForce(this.follow(target));
        }
        
      }
      
      if (this.flocking) {
        this.flock(Flora.elements);
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
        if (this.velocity.mag() > .1) {
          this.angle = Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));
        }
      }
      
      if (this.controlCamera) { // check camera after velocity calculation
        this.checkCameraEdges();
      }

      if (this.checkEdges || this.wrapEdges) {
        this.checkWorldEdges(world);
      }


      if (this.parent) { // parenting
        this.location = this.parent.location;
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
  }
  
  /**
   * Applies a force to this object's acceleration.
   *
   * @param {Object} force The force to be applied (expressed as a vector).
   */   
  Mover.prototype.applyForce = function(force) {

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
  Mover.prototype.seek = function(target, arrive) {
    
    var world = Flora.World,
      desiredVelocity = exports.PVector.PVectorSub(target.location, this.location),
      distanceToTarget = desiredVelocity.mag();

    desiredVelocity.normalize();
    
    if (distanceToTarget < world.width/2) {
      var m = Utils.map(distanceToTarget, 0, world.width/2, 0, this.maxSpeed);
      desiredVelocity.mult(m);
    } else {
      desiredVelocity.mult(this.maxSpeed);
    }
    
    var steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  };
  
  /**
   * Calculates a steering force to apply to an object following another object.
   *
   * @param {Object} target The object to seek.
   * @returns {Object} The force to apply.
   */ 
  Mover.prototype.follow = function(target) {
    
    var desiredVelocity = target.location;

    desiredVelocity.mult(this.maxSpeed);

    var steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  };

  /**
   * Bundles flocking behaviors (separate, align, cohesion) into one call.
   */     
  Mover.prototype.flock = function(elements) {
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
  Mover.prototype.separate = function(elements) {
    
    var i, max, element, diff, d,
    sum = exports.PVector.create(0, 0),
    count = 0, steer;
    
    for (i = 0, max = elements.length; i < max; i += 1) {
      element = elements[i];
      if (this.className === element.className && this.id !== element.id) {
        
        d = this.location.distance(element.location);
        
        if ((d > 0) && (d < this.desiredSeparation)) {
          diff = exports.PVector.PVectorSub(this.location, element.location);
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
      steer = exports.PVector.PVectorSub(sum, this.velocity);
      steer.limit(this.maxSteeringForce);
      return steer;
    }
    return exports.PVector.create(0, 0);
  };    

  /**
   * Loops through a passed elements array and calculates a force to apply 
   * to align with all elements.
   *
   * @param {array} elements An array of Flora elements.
   * @returns {Object} A force to apply.
   */     
  Mover.prototype.align = function(elements) {
    
    var i, max, element, diff, d,
      sum = exports.PVector.create(0, 0),
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
      steer = exports.PVector.PVectorSub(sum, this.velocity);
      steer.limit(this.maxSteeringForce);
      return steer;
    }
    return exports.PVector.create(0, 0);
  };

  /**
   * Loops through a passed elements array and calculates a force to apply 
   * to stay close to all elements.
   *
   * @param {array} elements An array of Flora elements.
   * @returns {Object} A force to apply.
   */     
  Mover.prototype.cohesion = function(elements) {
    
    var i, max, element, diff, d,
      sum = exports.PVector.create(0, 0),
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
      desiredVelocity = exports.PVector.PVectorSub(sum, this.location);
      desiredVelocity.normalize();
      desiredVelocity.mult(this.maxSpeed);
      steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
      steer.limit(this.maxSteeringForce);
      return steer;
    }
    return exports.PVector.create(0, 0);
  };

  /**
   * Calculates a force to apply to flee a target. The force is the inverse
   * of the object's maximum speed.
   *
   * @param {Object} target The object to flee from.
   * @returns {Object} A force to apply.
   */     
  Mover.prototype.flee = function(target) {
    
    var desiredVelocity = exports.PVector.PVectorSub(target.location, this.location); // find vector pointing at target

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
  Mover.prototype.drag = function(target) {
    var speed = this.velocity.mag(),
      dragMagnitude = -1 * target.c * speed * speed, // drag magnitude
      drag = Utils.clone(this.velocity);

    drag.normalize(); // drag direction
    drag.mult(dragMagnitude);

    return drag;
  }

  /**
   * Calculates a force to apply to simulate attraction on an object.
   *
   * @param {Object} attractor The attracting object.
   * @returns {Object} A force to apply.
   */     
  Mover.prototype.attract = function(attractor) {

    var force = exports.PVector.PVectorSub(attractor.location, this.location),
      distance, strength;

    distance = force.mag();
    distance = Utils.constrain(distance, attractor.mass/4, attractor.mass/2); // min = scale/16 (totally arbitrary); max = 1/2 the size of the attractor
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
  Mover.prototype.isInside = function(container) {
    if (container) {
      if (this.location.x + this.width/2 > container.location.x - container.width/2 
        && this.location.x - this.width/2 < container.location.x + container.width/2 
        && this.location.y + this.height/2 > container.location.y - container.height/2 
        && this.location.y - this.height/2 < container.location.y + container.height/2) {
        return true;
      }
    }
    return false;
  }

  /**
   * Determines if this object is outside the world bounds.
   *
   * @param {Object} world The world object.
   * @returns {boolean} Returns true if the object is outside the world.
   */     
  Mover.prototype.checkWorldEdges = function(world) {

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
        this.location = exports.PVector.create(0, this.location.y);
        diff = exports.PVector.create(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
        check = true;
      } else if (this.location.x < 0) {
        this.location = exports.PVector.create(world.width, this.location.y);
        diff = exports.PVector.create(x - this.location.x, 0);
        check = true;
      }
    } else {
      if (this.avoidEdges) {
        if (this.location.x < this.avoidEdgesStrength) { 
          maxSpeed = this.maxSpeed;
        } else if (this.location.x > Flora.World.width - this.avoidEdgesStrength) {
          maxSpeed = -this.maxSpeed;
        }
        if (maxSpeed) {
          desiredVelocity = exports.PVector.create(maxSpeed, this.velocity.y),
          steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
          steer.limit(this.maxSteeringForce);
          this.applyForce(steer);
        }
      }
      if (this.location.x + this.width/2 > world.width) {         
        this.location = exports.PVector.create(world.width - this.width/2, this.location.y);
        diff = exports.PVector.create(x - this.location.x, 0); // get the difference bw the initial location and the adjusted location
        this.velocity.x *= -1 * this.bounciness;    
        check = true;
       } else if (this.location.x < this.width/2) {       
        this.location = exports.PVector.create(this.width/2, this.location.y);
        diff = exports.PVector.create(x - this.location.x, 0);
        this.velocity.x *= -1 * this.bounciness;      
        check = true; 
      }
    }
     
    ////

    maxSpeed = null;
    if (this.wrapEdges) {
      if (this.location.y > world.height) {
        this.location = exports.PVector.create(this.location.x, 0);
        diff = exports.PVector.create(0, y - this.location.y);
        check = true;
      } else if (this.location.y < 0) {
        this.location = exports.PVector.create(this.location.x, world.height);
        diff = exports.PVector.create(0, y - this.location.y);
        check = true;
      }
    } else {
      if (this.avoidEdges) {
        if (this.location.y < this.avoidEdgesStrength) { 
          maxSpeed = this.maxSpeed;
        } else if (this.location.y > Flora.World.height - this.avoidEdgesStrength) {
          maxSpeed = -this.maxSpeed;
        }
        if (maxSpeed) {
          desiredVelocity = exports.PVector.create(this.velocity.x, maxSpeed),
          steer = exports.PVector.PVectorSub(desiredVelocity, this.velocity);
          steer.limit(this.maxSteeringForce);
          this.applyForce(steer);
        }
      } 
      if (this.location.y + this.height/2 > world.height) {
        this.location = exports.PVector.create(this.location.x, world.height - this.height/2);
        diff = exports.PVector.create(0, y - this.location.y);
        this.velocity.y *= -1 * this.bounciness;
        check = true;
        } else if (this.location.y < this.height/2) {       
        this.location = exports.PVector.create(this.location.x, this.height/2);
        diff = exports.PVector.create(0, y - this.location.y);
        this.velocity.y *= -1 * this.bounciness;
        check = true;
      }
    }

    if (check && this.controlCamera) {
      Flora.World.location.add(diff); // !! do we need this? // add the distance difference to World.location
    }

    return check;
  }

  /**
   * Moves the world in the opposite direction of the Camera's controlObj.
   *
   * @param {Object} world The world object.
   * @returns {boolean} Returns true if the object is outside the world.
   */     
  Mover.prototype.checkCameraEdges = function() {

    var vel = this.velocity.clone();

    Flora.World.location.add(vel.mult(-1));
  }

  /**
   * Returns this object's location.
   *
   * @param {string} [type] If no type is supplied, returns a clone of this object's location.
                            Accepts 'x', 'y' to return their respective values.
   * @returns {boolean} Returns true if the object is outside the world.
   */ 
  Mover.prototype.getLocation = function (type) {
    if (!type) {
      return exports.PVector.create(this.location.x, this.location.y);
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
  Mover.prototype.getVelocity = function (type) {
    if (!type) {
      return exports.PVector.create(this.velocity.x, this.velocity.y);
    } else if (type === "x") {
      return this.velocity.x;
    } else if (type === "y") {
      return this.velocity.y;
    }
  };

  exports.Mover = Mover;
}(exports));