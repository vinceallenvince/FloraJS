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
    type: "heat",
    behavior: "COWARD",
    sensitivity: 3,
    offsetDistance: 40,
    opacity: 0,
    offsetAngle: 0,
    border: "1px solid rgb(255, 69, 0)",
    afterStep: function () {
      if (this.activated) {
        if (!this.connector) {
          this.connector = new Flora.Connector({
            parentA: this,
            parentB: this.target,
            color: [255, 69, 0]
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

  var sensor2 = new Flora.Sensor({
    type: "light",
    behavior: "AGGRESSIVE",
    sensitivity: 3,
    offsetDistance: 40,
    opacity: 0,
    offsetAngle: 0,
    border: "1px solid rgb(255, 200, 0)",
    afterStep: function () {
      if (this.activated) {
        if (!this.connector) {
          this.connector = new Flora.Connector({
            parentA: this,
            parentB: this.target,
            color: [255, 200, 0]
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

  var sensor3 = new Flora.Sensor({
    type: "oxygen",
    behavior: "LIKES",
    sensitivity: 3,
    offsetDistance: 40,
    opacity: 0,
    offsetAngle: 0,
    border: "1px solid rgb(0, 174, 239)",
    afterStep: function () {
      if (this.activated) {
        if (!this.connector) {
          this.connector = new Flora.Connector({
            parentA: this,
            parentB: this.target,
            color: [0, 174, 239]
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

  var sensor4 = new Flora.Sensor({
    type: "food",
    behavior: "LIKES",
    sensitivity: 3,
    offsetDistance: 40,
    opacity: 0,
    offsetAngle: 0,
    border: "1px solid rgb(155, 231, 93)",
    afterStep: function () {
      if (this.activated) {
        if (!this.connector) {
          this.connector = new Flora.Connector({
            parentA: this,
            parentB: this.target,
            color: [155, 231, 93]
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
    maxSteeringForce: 1,
    wrapEdges: true,
    sensors: [sensor1, sensor2, sensor3, sensor4],
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
          location: Flora.PVector.PVectorAdd(this.location, Flora.PVector.create(Flora.Utils.getRandomNumber(-this.randomRadius, this.randomRadius),
            Flora.Utils.getRandomNumber(-this.randomRadius, this.randomRadius)))
        };
        var me = this;
        setTimeout(function () {
          me.target = null;
        }, 10);
      }

      var particle = function () {
        var d = Flora.Utils.getRandomNumber(1, 5);
        return {
          location: Flora.PVector.create(x, y),
          acceleration: Flora.PVector.create(Flora.Utils.getRandomNumber(-2, 2), Flora.Utils.getRandomNumber(-2, 2)),
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

          Flora.destroyElement(Flora.lights[i].id);
          Flora.lights.splice(i, 1);

          var ps = new Flora.ParticleSystem({
            burst: 1,
            lifespan: 10,
            particle: particle
          });

          var w = Flora.Utils.getRandomNumber(0, Flora.World.width);
          var h = Flora.Utils.getRandomNumber(0, Flora.World.height);
          var d = Flora.Utils.getRandomNumber(15, 25);

        }
      }

      for (i = 0, max = Flora.oxygen.length; i < max; i += 1) {
        if (this.isInside(Flora.oxygen[i])) {
          Flora.oxygen[i].scale -= 0.025;
          if (Flora.oxygen[i].scale < 0.25) {
            Flora.destroyElement(Flora.oxygen[i].id);
            Flora.oxygen.splice(i, 1);
          }
        }
      }

      for (i = 0, max = Flora.food.length; i < max; i += 1) {
        if (this.isInside(Flora.food[i])) {
          Flora.food[i].scale -= 0.025;
          if (Flora.food[i].scale < 0.25) {
            Flora.destroyElement(Flora.food[i].id);
            Flora.food.splice(i, 1);
          }
        }
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

  var pl = new Flora.Palette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: [255, 132, 86],
    endColor: [175, 47, 0]
  });

  for (i = 0, max = (0.015 * Flora.world.width); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(15, 25);

    var heat = new Flora.Heat({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h)
    });
  }

  pl = new Flora.Palette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: [255, 227, 127],
    endColor: [189, 148, 0]
  });

  for (i = 0, max = (0.015 * Flora.world.width); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(15, 25);

    var light = new Flora.Light({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h)
    });
  }

  pl = new Flora.Palette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: [109, 215, 255],
    endColor: [0, 140, 192]
  });

  for (i = 0, max = (0.005 * Flora.world.width); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(20, 40);

    var air = new Flora.Oxygen({
      color: pl.getColor(),
      width: d,
      height: d,
      scale: 1,
      isStatic: true,
      location: Flora.PVector.create(w, h)
    });
  }

  pl = new Flora.Palette();
  pl.addColor({
    min: 5,
    max: 12,
    startColor: [186, 255, 130],
    endColor: [84, 187, 0]
  });

  for (i = 0, max = (0.005 * Flora.world.width); i < max; i += 1) {
    w = Flora.Utils.getRandomNumber(0, Flora.world.width);
    h = Flora.Utils.getRandomNumber(0, Flora.world.height);
    d = Flora.Utils.getRandomNumber(20, 40);

    var food = new Flora.Food({
      color: pl.getColor(),
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