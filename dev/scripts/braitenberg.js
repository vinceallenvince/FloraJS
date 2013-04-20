/*global Flora, document, setTimeout */
/** @namespace */
var Brait = {}, exports = Brait;

(function(exports) {

  'use strict';

  var getRandomNumber = Flora.Utils.getRandomNumber;

  /**
   * Creates a Braitenberg vehicle.
   *
   * @constructor
   */
  function Vehicle(options) {

    var sensors = options.sensors,
        controlCamera = options.controlCamera,
        color = options.color,
        borderColor = options.borderColor,
        viewArgs = options.viewArgs,
        collisions = options.collisions || {},
        beforeStep = options.beforeStep || Vehicle.beforeStep;

    return new Flora.Agent({
      sensors: sensors,
      velocity: new Flora.Vector(getRandomNumber(-1, 1, true),
          getRandomNumber(-1, 1, true)),
      motorSpeed: 4,
      minSpeed: 1,
      controlCamera: controlCamera,
      wrapEdges: true,
      color: color,
      width: 22,
      height: 22,
      borderWidth: 3,
      borderColor: borderColor,
      eyeRotation: 0,
      view: Vehicle.view,
      viewArgs: viewArgs,
      collisions: collisions,
      beforeStep: beforeStep
    });
  }

  Vehicle.view = function(i) {

    var obj = document.createElement('div'),
    eye = document.createElement('div');
    eye.id = 'eye' + this.id;
    eye.className = 'eye';
    eye.style.background = !i ? 'rgb(100, 100, 100)' : 'rgb(255, 255, 255)',
    eye.style.opacity = 1;
    obj.appendChild(eye);
    return obj;
  };

  Vehicle.beforeStep = function() {

    var i, max;

    if (getRandomNumber(0, 300) === 1) {
      this.randomRadius = 100;
      this.seekTarget = { // find a random point and steer toward it
        location: Flora.Vector.VectorAdd(this.location,
            new Flora.Vector(getRandomNumber(-this.randomRadius, this.randomRadius),
            getRandomNumber(-this.randomRadius, this.randomRadius)))
      };
      var me = this;
      setTimeout(function () {
        me.seekTarget = null;
      }, 100);
    }

    // check if agent intersects w stimulators
    for (i = 0, max = Flora.lights.length; i < max; i += 1) {
      if (this.isInside(Flora.lights[i])) {
        this.collisions.light.call(this, i);
      }
    }

    for (i = 0, max = Flora.oxygen.length; i < max; i += 1) {
      if (this.isInside(Flora.oxygen[i])) {
        this.collisions.oxygen.call(this, i);
      }
    }

    for (i = 0, max = Flora.food.length; i < max; i += 1) {
      if (this.isInside(Flora.food[i])) {
        this.collisions.food.call(this, i);
      }
    }

    var eye = document.getElementById('eye' + this.id),
        a = this.eyeRotation;

    if (eye) {
      eye.style.webkitTransform = 'rotate(' + a + 'deg)';
      this.eyeRotation += Flora.Utils.map(this.velocity.mag(), this.minSpeed, this.maxSpeed, 3, 50);
    }
  };


  /**
   * Creates a Sensor.
   *
   * @constructor
   */
  function Sensor(options) {

    var type = options.type,
        behavior = options.behavior,
        afterStep = options.afterStep || Sensor.afterStep;

    return new Flora.Sensor({
      type: type,
      behavior: behavior,
      afterStep: afterStep
    });
  }

  Sensor.afterStep = function() {

    if (this.activated) {

      if (!this.connector) {
        this.connector = new Flora.Connector(this, this.target);
      } else {
        this.connector.parentA = this;
        this.connector.parentB = this.target;
      }
      this.opacity = 1;
    } else {
      if (this.connector) {
        Flora.elementList.destroyElement(this.connector.id);
        this.connector = null;
      }
      this.opacity = 0.75;
    }
  };

  /**
   * Creates a stimulant from a random selection of Stimuli.
   *
   * @constructor
   */
  function Stimulus(options) {

    var location = options.location,
        size = options.size,
        type = options.type;

    var stimuli = [Brait.Heat, Brait.Cold, Brait.Light, Brait.Oxygen, Brait.Food];

    if (type) {
      return new type[getRandomNumber(0, type.length - 1)]({
        location: location,
        size: size
      });
    } else {
      return new stimuli[getRandomNumber(0, stimuli.length - 1)]({
        location: location,
        size: size
      });
    }
  }

  Stimulus.create = function(e, loc, type) {

    var location = e ? new Flora.Vector(e.offsetX, e.offsetY) : loc;
    var stimulus = new Brait.Stimulus({
      location: location,
      size: getRandomNumber(15, 75),
      type: type
    });
  };

  Stimulus.createHeat = function(e, loc) {

    var location = new Flora.Vector(e.offsetX, e.offsetY);
    var stimulus = new Brait.Stimulus({
      location: location,
      size: getRandomNumber(15, 75),
      type: [Brait.Heat]
    });
  };

  Stimulus.createCold = function(e, loc) {

    var location = new Flora.Vector(e.offsetX, e.offsetY);
    var stimulus = new Brait.Stimulus({
      location: location,
      size: getRandomNumber(15, 75),
      type: [Brait.Cold]
    });
  };

  Stimulus.createLight = function(e, loc) {

    var location = new Flora.Vector(e.offsetX, e.offsetY);
    var stimulus = new Brait.Stimulus({
      location: location,
      size: getRandomNumber(15, 75),
      type: [Brait.Light]
    });
  };

  Stimulus.borderStyles = [
    'none',
    'solid',
    'dotted',
    'dashed',
    'double'
  ];

  /**
   * Creates a Heat stimulant.
   *
   * @constructor
   */
  function Heat(options) {

    var location = options.location,
        size = options.size;

    if (!Heat.color) {
      Heat.color = Flora.defaultColors.getColor('heat');
    }

    if (!Heat.palette) {
      Heat.palette = new Flora.ColorPalette();
      Heat.palette.addColor({
        min: 6,
        max: 24,
        startColor: Heat.color.startColor,
        endColor: Heat.color.endColor
      });
    }

    return new Flora.Heat({
      color: Heat.palette.getColor(),
      width: size,
      height: size,
      scale: 0.01,
      scaleTarget: 1,
      isStatic: true,
      location: location,
      borderRadius: '100%',
      borderWidth: getRandomNumber(2, 6),
      borderStyle: Stimulus.borderStyles[getRandomNumber(0, Stimulus.borderStyles.length - 1)],
      borderColor: Heat.palette.getColor(),
      boxShadow: '0 0 0 ' + getRandomNumber(2, 6) + 'px rgb(' + Heat.palette.getColor().toString() + ')',
      beforeStep: function() {
        if (this.scaleTarget && this.scale < this.scaleTarget) {
          this.scale *= 1.1;
        } else {
          this.scaleTarget = null;
        }
      }
    });
  }

  Heat.color = null;

  Heat.palette = null;

  /**
   * Creates a Cold stimulant.
   *
   * @constructor
   */
  function Cold(options) {

    var location = options.location,
        size = options.size;

    if (!Cold.color) {
      Cold.color = Flora.defaultColors.getColor('cold');
    }

    if (!Cold.palette) {
      Cold.palette = new Flora.ColorPalette();
      Cold.palette.addColor({
        min: 6,
        max: 24,
        startColor: Cold.color.startColor,
        endColor: Cold.color.endColor
      });
    }

    return new Flora.Cold({
      color: Cold.palette.getColor(),
      width: size,
      height: size,
      scale: 0.01,
      scaleTarget: 1,
      isStatic: true,
      location: location,
      borderRadius: '100%',
      borderWidth: getRandomNumber(2, 6),
      borderStyle: Stimulus.borderStyles[getRandomNumber(0, Stimulus.borderStyles.length - 1)],
      borderColor: Cold.palette.getColor(),
      boxShadow: '0 0 0 ' + getRandomNumber(2, 6) + 'px rgb(' + Cold.palette.getColor().toString() + ')',
      beforeStep: function() {
        if (this.scaleTarget && this.scale < this.scaleTarget) {
          this.scale *= 1.1;
        } else {
          this.scaleTarget = null;
        }
      }
    });
  }

  Cold.color = null;

  Cold.palette = null;

  /**
   * Creates a Light stimulant.
   *
   * @constructor
   */
  function Light(options) {

    var location = options.location,
        size = options.size,
        onCollision = options.onCollision || function() {};

    if (!Light.color) {
      Light.color = Flora.defaultColors.getColor('light');
    }

    if (!Light.palette) {
      Light.palette = new Flora.ColorPalette();
      Light.palette.addColor({
        min: 6,
        max: 24,
        startColor: Light.color.startColor,
        endColor: Light.color.endColor
      });
    }

    return new Flora.Light({
      color: Light.palette.getColor(),
      width: size,
      height: size,
      scale: 0.01,
      scaleTarget: 1,
      isStatic: true,
      location: location,
      borderRadius: '100%',
      borderWidth: getRandomNumber(2, 6),
      borderStyle: Stimulus.borderStyles[getRandomNumber(0,
          Stimulus.borderStyles.length - 1)],
      borderColor: Light.palette.getColor(),
      boxShadow: '0 0 0 ' + getRandomNumber(2, 6) + 'px rgb(' + Light.palette.getColor().toString() + ')',
      collide: onCollision,
      beforeStep: function() {
        if (this.scaleTarget && this.scale < this.scaleTarget) {
          this.scale *= 1.1;
        } else {
          this.scaleTarget = null;
        }
      }
    });
  }

  Light.color = null;

  Light.palette = null;

  Light.collide = function(i) {

    var x = Flora.lights[i].location.x,
        y = Flora.lights[i].location.y,
        d = Flora.Utils.getRandomNumber(1, 5);

    var particle = function () {
      var d = Flora.Utils.getRandomNumber(10, 20);
      return {
        location: new Flora.Vector(x, y),
        acceleration: new Flora.Vector(Flora.Utils.getRandomNumber(-3, 3),
            Flora.Utils.getRandomNumber(-3, 3)),
        lifespan: 20,
        checkEdges: false,
        width: d,
        height: d,
        color: Light.palette.getColor(),
        borderWidth: getRandomNumber(2, 6),
        borderStyle: Stimulus.borderStyles[getRandomNumber(0,
            Stimulus.borderStyles.length - 1)],
        borderColor: Light.palette.getColor()
      };
    };

    var ps = new Flora.ParticleSystem({
      location: new Flora.Vector(x, y),
      burst: 2,
      lifespan: 10,
      particle: particle
    });
    Flora.elementList.destroyElement(Flora.lights[i].id);
    Flora.lights.splice(i, 1);

    var world = Flora.universe.first();
    Stimulus.create(null, new Flora.Vector(getRandomNumber(0, world.width),
    getRandomNumber(0, world.height)), [Brait.Light]);
  };

  /**
   * Creates an Oxygen stimulant.
   *
   * @constructor
   */
  function Oxygen(options) {

    var location = options.location,
        size = options.size,
        onCollision = options.onCollision || function() {};

    if (!Oxygen.color) {
      Oxygen.color = Flora.defaultColors.getColor('oxygen');
    }

    if (!Oxygen.palette) {
      Oxygen.palette = new Flora.ColorPalette();
      Oxygen.palette.addColor({
        min: 6,
        max: 24,
        startColor: Oxygen.color.startColor,
        endColor: Oxygen.color.endColor
      });
    }

    return new Flora.Oxygen({
      color: Oxygen.palette.getColor(),
      width: size,
      height: size,
      scale: 0.01,
      scaleTarget: 1,
      isStatic: true,
      location: location,
      borderRadius: '100%',
      borderWidth: getRandomNumber(2, 6),
      borderStyle: Stimulus.borderStyles[getRandomNumber(0,
          Stimulus.borderStyles.length - 1)],
      borderColor: Oxygen.palette.getColor(),
      boxShadow: '0 0 0 ' + getRandomNumber(2, 6) + 'px rgb(' + Oxygen.palette.getColor().toString() + ')',
      collide: onCollision,
      beforeStep: function() {
        if (this.scaleTarget && this.scale < this.scaleTarget) {
          this.scale *= 1.1;
        } else {
          this.scaleTarget = null;
        }
      }
    });
  }

  Oxygen.color = null;

  Oxygen.palette = null;

  Oxygen.collide = function(i) {

    var world = Flora.universe.first();

    Flora.oxygen[i].scale -= 0.015;
    if (Flora.oxygen[i].scale < 0.1) {
      Flora.elementList.destroyElement(Flora.oxygen[i].id);
      Flora.oxygen.splice(i, 1);
      Stimulus.create(null, new Flora.Vector(getRandomNumber(0, world.width),
          getRandomNumber(0, world.height)), [Brait.Oxygen]);
    }
  };


  /**
   * Creates an Food stimulant.
   *
   * @constructor
   */
  function Food(options) {

    var location = options.location,
        size = options.size,
        onCollision = options.onCollision || function() {};

    if (!Food.color) {
      Food.color = Flora.defaultColors.getColor('food');
    }

    if (!Food.palette) {
      Food.palette = new Flora.ColorPalette();
      Food.palette.addColor({
        min: 6,
        max: 24,
        startColor: Food.color.startColor,
        endColor: Food.color.endColor
      });
    }

    return new Flora.Food({
      color: Food.palette.getColor(),
      width: size,
      height: size,
      scale: 0.01,
      scaleTarget: 1,
      isStatic: true,
      location: location,
      borderRadius: '100%',
      borderWidth: getRandomNumber(2, 6),
      borderStyle: Stimulus.borderStyles[getRandomNumber(0,
          Stimulus.borderStyles.length - 1)],
      borderColor: Food.palette.getColor(),
      boxShadow: '0 0 0 ' + getRandomNumber(2, 6) + 'px rgb(' + Food.palette.getColor().toString() + ')',
      collide: onCollision,
      beforeStep: function() {
        if (this.scaleTarget && this.scale < this.scaleTarget) {
          this.scale *= 1.1;
        } else {
          this.scaleTarget = null;
        }
      }
    });
  }

  Food.color = null;

  Food.palette = null;

  Food.collide = function(i) {

    var world = Flora.universe.first();

    Flora.food[i].scale -= 0.015;
    if (Flora.food[i].scale < 0.1) {
      Flora.elementList.destroyElement(Flora.food[i].id);
      Flora.food.splice(i, 1);
      Stimulus.create(null, new Flora.Vector(getRandomNumber(0, world.width),
          getRandomNumber(0, world.height)), [Brait.Food]);
    }
  };

  //

  exports.Vehicle = Vehicle;
  exports.Sensor = Sensor;
  exports.Stimulus = Stimulus;
  exports.Heat = Heat;
  exports.Cold = Cold;
  exports.Light = Light;
  exports.Oxygen = Oxygen;
  exports.Food = Food;

}(exports));