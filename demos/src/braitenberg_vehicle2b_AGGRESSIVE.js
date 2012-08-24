/*global Flora */
var system = new Flora.FloraSystem();

var elements = function() {

  'use strict';

  Flora.world.update({
    c: 0.01,
    showStats: false,
    gravity: Flora.PVector.create(0, 0),
    width: 3000,
    height: 3000
  });

  var sensor1 = new Flora.Sensor({
    type: "cold",
    behavior: "AGGRESSIVE",
    sensitivity: 2,
    offsetDistance: 40,
    opacity: 0,
    offsetAngle: 0,
    border: "1px solid rgb(132, 192, 201)",
    afterStep: function () {
      if (this.activated) {
        if (!this.connector) {
          this.connector = new Flora.Connector({
            parentA: this,
            parentB: this.target,
            color: [132, 192, 201]
          });
        } else {
          this.connector.parentA = this;
          this.connector.parentB = this.target;
        }
        this.opacity = 1;
      } else {
        if (this.connector) {
          Flora.destroyElement(this.connector.id);
          this.connector = null;
        }
        this.opacity = 0;
      }
    }
  });

  var vehicle = new Flora.Mover({
    controlCamera: true,
    mass: 5,
    minSpeed: 0.5,
    defaultSpeed: 2,
    maxSpeed: 8,
    maxSteeringForce: 100,
    wrapEdges: true,
    sensors: [sensor1],
    velocity: Flora.PVector.create(1, 0),
    color: [255, 255, 255],
    borderRadius: "100%",
    boxShadow: "0 0 10px 10px rgba(255, 255, 255, 0.15)",
    eyeRotation: 0,
    view: function () {
      var obj = document.createElement("div"),
      eye = document.createElement("div");
      eye.id = "eye";
      eye.className = "eye";
      obj.appendChild(eye);
      return obj;
    },
    beforeStep: function () { // constant force, ie. motor

      var i, max, check, alpha;

      for (i = 0, max = this.sensors.length; i < max; i += 1) {
        if (this.sensors[i].activated) {
          check = true;
          alpha = 0.25;
          this.boxShadow = "0 0 10px 10px rgba(255, 255, 255, " + alpha + ")";
        }
      }

      // motor always maintains a minimum speed

      if (!check) { // if sensor is not activated, apply a constant force in the vehicle's current direction
        var dir = Flora.Utils.clone(this.velocity);
        dir.normalize(); // get direction
        if (this.velocity.mag() > this.defaultSpeed) { // decelerate to defaultSpeed
          dir.mult(-this.minSpeed);
          this.applyForce(dir);
        } else {
          dir.mult(this.defaultSpeed); // maintain default speed
          this.applyForce(dir);
        }

        this.boxShadow = "0 0 10px 10px rgba(255, 255, 255, 0.15)";
      }

      // need random force
      if (Flora.Utils.getRandomNumber(0, 500) === 1) {
        this.randomRadius = 100;
        this.target = { // find a random point and steer toward it
          location: Flora.PVector.PVectorAdd(this.location, Flora.PVector.create(Flora.Utils.getRandomNumber(-this.randomRadius, this.randomRadius), Flora.Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
        };
        var me = this;
        setTimeout(function () {
          me.target = null;
        }, 10);
      }

      // eye
      var eye = document.getElementById("eye"),
          a = this.eyeRotation;

      eye.style.webkitTransform = "rotate(" + a + "deg)";
      this.eyeRotation += Flora.Utils.map(this.velocity.mag(), this.minSpeed, this.maxSpeed, 3, 50);
    }
  });

  var point = new Flora.Point({
    className: 'neutralSensor',
    isStatic: false,
    parent: vehicle,
    offsetDistance: 40,
    color: null
  });

  var i, max, w, h, d;

  for (i = 0, max = (0.05 * Flora.world.width); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(15, 35);

    var cold = new Flora.Cold({
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h)
    });
  }
};

Flora.Utils.addEvent(document.getElementById("buttonStart"), "mouseup", function() {
  'use strict';
  document.getElementById("containerMenu").removeChild(document.getElementById("containerButton"));
  system.start(elements);
});