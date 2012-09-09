/*global Flora */
var system = new Flora.FloraSystem();

var elements = function() {

  'use strict';

  Flora.world.update({
    c: 0.01,
    showStats: false,
    gravity: Flora.PVector.create(0, 0),
    width: 3000,
    height: 1500,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: [100, 100, 100]
  });

  function BVehicleVALUES(exports, opt_options) {

    var PVector = exports.PVector,
        getRandomNumber = exports.Utils.getRandomNumber,
        defaultColors = exports.defaultColors,
        options = opt_options || {},
        controlCamera = !!options.controlCamera,
        location = options.location || null,
        angle = options.angle || 0,
        color = options.color || [255, 100, 0],
        eyeColor = options.eyeColor || [255, 255, 255];

    var clrCold = defaultColors.getColor('cold').startColor,
        clrLight = defaultColors.getColor('light').startColor,
        clrOxygen = defaultColors.getColor('oxygen').startColor,
        clrFood = defaultColors.getColor('food').startColor;

    var afterStep = function() {

      if (this.activated) {
          if (!this.connector) {
            this.connector = new exports.Connector({
              parentA: this,
              parentB: this.target,
              color: this.borderColor
            });
          } else {
            this.connector.parentA = this;
            this.connector.parentB = this.target;
          }
          this.opacity = 1;
        } else {
          if (this.connector) {
            exports.destroyElement(this.connector.id);
            this.connector = null;
          }
          this.opacity = 0;
        }
    };

    this.sensorHeat = new exports.Sensor({
      type: 'heat',
      behavior: 'EXPLORER',
      sensitivity: 2,
      offsetDistance: 40,
      opacity: 0,
      offsetAngle: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: clrCold,
      afterStep: afterStep
    });
    this.sensorCold = new exports.Sensor({
      type: 'light',
      behavior: 'AGGRESSIVE',
      sensitivity: 2,
      offsetDistance: 40,
      opacity: 0,
      offsetAngle: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: clrLight,
      afterStep: afterStep
    });
    this.sensorOxygen = new exports.Sensor({
      type: 'oxygen',
      behavior: 'LIKES',
      sensitivity: 2,
      offsetDistance: 40,
      opacity: 0,
      offsetAngle: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: clrOxygen,
      afterStep: afterStep
    });
    this.sensorFood = new exports.Sensor({
      type: 'food',
      behavior: 'LIKES',
      sensitivity: 2,
      offsetDistance: 40,
      opacity: 0,
      offsetAngle: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: clrFood,
      afterStep: afterStep
    });

    this.vehicle = new exports.Mover({
      controlCamera: controlCamera,
      location: location,
      angle: angle,
      color: color,
      mass: 5,
      minSpeed: 0.5,
      defaultSpeed: 2,
      maxSpeed: 8,
      maxSteeringForce: 1,
      wrapEdges: true,
      sensors: [this.sensorHeat, this.sensorCold, this.sensorOxygen, this.sensorFood],
      velocity: PVector.create(1, 0),
      borderRadius: '100%',
      boxShadow: '0 0 10px 10px rgba(' + color.toString() + ', 0.15)',
      eyeRotation: 0,
      view: function() {
        var obj = document.createElement('div'),
        eye = document.createElement('div');
        eye.id = 'eye' + this.id;
        eye.className = 'eye';
        eye.style.background = 'rgba(' + eyeColor.toString() + ', 1)';
        obj.appendChild(eye);
        return obj;
      },
      beforeStep: function () { // constant force, ie. motor

        var i, max, check, alpha;

        for (i = 0, max = this.sensors.length; i < max; i += 1) {
          if (this.sensors[i].activated) {
            check = true;
            alpha = 0.25;
            this.boxShadow = '0 0 10px 10px rgba(' + color.toString() + ', ' + alpha + ')';
          }
        }

        // motor always maintains a minimum speed

        if (!check) { // if sensor is not activated, apply a constant force in the vehicle's current direction
          var dir = exports.Utils.clone(this.velocity);
          dir.normalize(); // get direction
          if (this.velocity.mag() > this.defaultSpeed) { // decelerate to defaultSpeed
            dir.mult(-this.minSpeed);
            this.applyForce(dir);
          } else {
            dir.mult(this.defaultSpeed); // maintain default speed
            this.applyForce(dir);
          }

          this.boxShadow = '0 0 10px 10px rgba(' + color.toString() + ', 0.15)';
        }

        // need random force
        if (getRandomNumber(0, 500) === 1) {
          this.randomRadius = 100;
          this.target = { // find a random point and steer toward it
            location: PVector.PVectorAdd(this.location, PVector.create(getRandomNumber(-this.randomRadius, this.randomRadius), getRandomNumber(-this.randomRadius, this.randomRadius)))
          };
          var me = this;
          setTimeout(function () {
            me.target = null;
          }, 10);
        }

        var particle = function () {
          var d = getRandomNumber(1, 5);
          return {
            location: exports.PVector.create(x, y),
            acceleration: exports.PVector.create(getRandomNumber(-2, 2), getRandomNumber(-2, 2)),
            lifespan: 20,
            checkEdges: false,
            width: d,
            height: d,
            color: [255, 255, 150]
          };
        };

        // check if mover intersects w stimulators
        for (i = 0, max = exports.lights.length; i < max; i += 1) {
          if (this.isInside(exports.lights[i])) {

            var x = exports.lights[i].location.x,
            y = exports.lights[i].location.y;

            exports.destroyElement(exports.lights[i].id);
            exports.lights.splice(i, 1);

            var ps = new exports.ParticleSystem({
              burst: 1,
              lifespan: 10,
              particle: particle
            });

            var w = getRandomNumber(0, exports.world.width);
            var h = getRandomNumber(0, exports.world.height);
            var d = getRandomNumber(15, 25);

          }
        }

        for (i = 0, max = exports.oxygen.length; i < max; i += 1) {
          if (this.isInside(exports.oxygen[i])) {
            exports.oxygen[i].scale -= 0.025;
            if (exports.oxygen[i].scale < 0.25) {
              exports.destroyElement(exports.oxygen[i].id);
              exports.oxygen.splice(i, 1);
            }
          }
        }

        for (i = 0, max = exports.food.length; i < max; i += 1) {
          if (this.isInside(exports.food[i])) {
            exports.food[i].scale -= 0.025;
            if (exports.food[i].scale < 0.25) {
              exports.destroyElement(exports.food[i].id);
              exports.food.splice(i, 1);
            }
          }
        }

        // eye
        var eye = document.getElementById('eye' + this.id),
            a = this.eyeRotation;

        eye.style.webkitTransform = 'rotate(' + a + 'deg)';
        this.eyeRotation += exports.Utils.map(this.velocity.mag(), this.minSpeed, this.maxSpeed, 3, 50);
      }
    });
    this.point = new exports.Point({
      className: 'neutralSensor',
      isStatic: false,
      parent: this.vehicle,
      offsetDistance: 40,
      color: null
    });
  }

  var i, max, w, h, d;

  var bv1 = new BVehicleVALUES(Flora, {
    controlCamera: true,
    color: [255, 255, 255],
    eyeColor: [90, 90, 90]
  });

  for (i = 0; i < 10; i++) {
    var x = Flora.Utils.getRandomNumber(0, Flora.world.width),
        y = Flora.Utils.getRandomNumber(0, Flora.world.height),
        a = Flora.Utils.getRandomNumber(0, 360),
        bv2 = new BVehicleVALUES(Flora, {
          controlCamera: false,
          location: Flora.PVector.create(x, y),
          angle: a
        });
  }

  //

  var borderStylesStimulators = [
    'none',
    'solid',
    'dotted',
    'dashed',
    'double'
  ], borderStr;

  var clr = Flora.defaultColors.getColor('heat');
  var pl = new Flora.ColorPalette();
  pl.addColor({
    min: 6,
    max: 24,
    startColor: clr.startColor,
    endColor: clr.endColor
  });

  for (i = 0, max = (0.000006 * (Flora.world.width * Flora.world.height)); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(15, 45);

    borderStr = borderStylesStimulators[Flora.Utils.getRandomNumber(0, borderStylesStimulators.length - 1)];

    var heat = new Flora.Heat({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h),
      borderRadius: '100%',
      borderWidth: Flora.Utils.getRandomNumber(2, 6),
      borderStyle: borderStr,
      borderColor: pl.getColor(),
      boxShadow: '0 0 0 ' + Flora.Utils.getRandomNumber(2, 6) + 'px rgb(' + pl.getColor().toString() + ')'
    });
  }

  clr = Flora.defaultColors.getColor('light');
  pl = new Flora.ColorPalette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: clr.startColor,
    endColor: clr.endColor
  });

  for (i = 0, max = (0.000006 * (Flora.world.width * Flora.world.height)); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(15, 45);

    borderStr = borderStylesStimulators[Flora.Utils.getRandomNumber(0, borderStylesStimulators.length - 1)];

    var light = new Flora.Light({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h),
      borderRadius: '100%',
      borderWidth: Flora.Utils.getRandomNumber(2, 6),
      borderStyle: borderStr,
      borderColor: pl.getColor(),
      boxShadow: '0 0 0 ' + Flora.Utils.getRandomNumber(2, 6) + 'px rgb(' + pl.getColor().toString() + ')'
    });
  }

  clr = Flora.defaultColors.getColor('oxygen');
  pl = new Flora.ColorPalette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: clr.startColor,
    endColor: clr.endColor
  });

  for (i = 0, max = (0.000006 * (Flora.world.width * Flora.world.height)); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(20, 80);

    borderStr = borderStylesStimulators[Flora.Utils.getRandomNumber(0, borderStylesStimulators.length - 1)];

    var air = new Flora.Oxygen({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h),
      borderRadius: '100%',
      borderWidth: Flora.Utils.getRandomNumber(2, 6),
      borderStyle: borderStr,
      borderColor: pl.getColor(),
      boxShadow: '0 0 0 ' + Flora.Utils.getRandomNumber(2, 6) + 'px rgb(' + pl.getColor().toString() + ')'
    });
  }

  clr = Flora.defaultColors.getColor('food');
  pl = new Flora.ColorPalette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: clr.startColor,
    endColor: clr.endColor
  });

  for (i = 0, max = (0.000006 * (Flora.world.width * Flora.world.height)); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(20, 80);

    borderStr = borderStylesStimulators[Flora.Utils.getRandomNumber(0, borderStylesStimulators.length - 1)];

    var food = new Flora.Food({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h),
      borderRadius: '100%',
      borderWidth: Flora.Utils.getRandomNumber(2, 6),
      borderStyle: borderStr,
      borderColor: pl.getColor(),
      boxShadow: '0 0 0 ' + Flora.Utils.getRandomNumber(2, 6) + 'px rgb(' + pl.getColor().toString() + ')'
    });
  }
};

Flora.Utils.addEvent(document.getElementById('buttonStart'), "mouseup", function() {
  'use strict';
  document.getElementById('containerMenu').removeChild(document.getElementById('containerButton'));
  system.start(elements);
});