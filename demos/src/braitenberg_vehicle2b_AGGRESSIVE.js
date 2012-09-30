/*global Flora */
var system = new Flora.FloraSystem();

var elements = function() {

  'use strict';

  Flora.universe.update({
    c: 0.01,
    showStats: false,
    gravity: new Flora.Vector(),
    width: 3000,
    height: 3000,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: [100, 100, 100]
  });

  var world = Flora.universe.first();

  function BVehicleAGGRESSIVE(exports, opt_options) {

    var Vector = exports.Vector,
        getRandomNumber = exports.Utils.getRandomNumber,
        defaultColors = exports.defaultColors,
        options = opt_options || {},
        controlCamera = !!options.controlCamera,
        location = options.location || null,
        angle = options.angle || 0,
        color = options.color || [255, 100, 0],
        eyeColor = options.eyeColor || [255, 255, 255];

    var clrLight = defaultColors.getColor('light').startColor;

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
            exports.elementList.destroyElement(this.connector.id);
            this.connector = null;
          }
          this.opacity = 0;
        }
    };

    this.sensorLight = new exports.Sensor({
      type: 'light',
      behavior:'AGGRESSIVE',
      sensitivity: 2,
      offsetDistance: 40,
      opacity: 0,
      offsetAngle: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: clrLight,
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
      maxSteeringForce: 100,
      wrapEdges: true,
      sensors: [this.sensorLight],
      velocity: new Vector(1, 0),
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
            location: Vector.VectorAdd(this.location, new Vector(getRandomNumber(-this.randomRadius, this.randomRadius), getRandomNumber(-this.randomRadius, this.randomRadius)))
          };
          var me = this;
          setTimeout(function () {
            me.target = null;
          }, 10);
        }

        var particle = function () {
          var d = Flora.Utils.getRandomNumber(1, 5);
          return {
            location: new Flora.Vector(x, y),
            acceleration: new Flora.Vector(Flora.Utils.getRandomNumber(-2, 2), Flora.Utils.getRandomNumber(-2, 2)),
            lifespan: 20,
            checkEdges: false,
            width: d,
            height: d,
            color: [255, 255, 150]
          };
        };

        // check if mover intersects w stimulators
        for (i = 0, max = Flora.lights.length; i < max; i += 1) {
          if (this.isInside(Flora.lights[i])) {

            var x = Flora.lights[i].location.x,
            y = Flora.lights[i].location.y;

            Flora.elementList.destroyElement(Flora.lights[i].id);
            Flora.lights.splice(i, 1);

            var ps = new Flora.ParticleSystem({
              burst: 1,
              lifespan: 10,
              particle: particle
            });

            var w = Flora.Utils.getRandomNumber(0, world.width);
            var h = Flora.Utils.getRandomNumber(0, world.height);
            var d = Flora.Utils.getRandomNumber(15, 25);

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

  var bv1 = new BVehicleAGGRESSIVE(Flora, {
    controlCamera: true,
    color: [255, 255, 255],
    eyeColor: [90, 90, 90]
  });

  for (i = 0; i < 10; i++) {
    var x = Flora.Utils.getRandomNumber(0, world.width),
        y = Flora.Utils.getRandomNumber(0, world.height),
        a = Flora.Utils.getRandomNumber(0, 360),
        bv2 = new BVehicleAGGRESSIVE(Flora, {
          controlCamera: false,
          location: new Flora.Vector(x, y),
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

  var clr = Flora.defaultColors.getColor('light');
  var pl = new Flora.ColorPalette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: clr.startColor,
    endColor: clr.endColor
  });

  for (i = 0, max = (0.000015 * (world.width * world.height)); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, world.width);
    h = Flora.Utils.getRandomNumber(0, world.height);
    d = Flora.Utils.getRandomNumber(15, 75);

    borderStr = borderStylesStimulators[Flora.Utils.getRandomNumber(0, borderStylesStimulators.length - 1)];

    var light = new Flora.Light({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: new Flora.Vector(w, h),
      borderRadius: '100%',
      borderWidth: Flora.Utils.getRandomNumber(2, 6),
      borderStyle: borderStr,
      borderColor: pl.getColor(),
      boxShadow: '0 0 0 ' + Flora.Utils.getRandomNumber(2, 6) + 'px rgb(' + pl.getColor().toString() + ')'
    });
  }
};

Flora.Utils.addEvent(document.getElementById("buttonStart"), "mouseup", function() {
  'use strict';
  document.getElementById("containerMenu").removeChild(document.getElementById("containerButton"));
  system.start(elements);
});