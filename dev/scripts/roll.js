/*global Flora, document */
Flora.Mantle.System.create(function() {

  var getRandomNumber = Flora.Utils.getRandomNumber,
      world = Flora.Mantle.System.allWorlds()[0];

  Flora.Mantle.World.update({
    gravity: new Flora.Vector(),
    c: 0
  });

  var flowField = this.add('FlowField', {
    createMarkers: false,
    resolution: 20,
    perlinSpeed: 0.015,
    perlinTime: 520
  });
  flowField.build();

  var target = this.add('Agent', {
    flowField: flowField,
    wrapEdges: true,
    mass: getRandomNumber(100, 300),
    opacity: 0,
    beforeStep: function() {
      return function() {
        if (getRandomNumber(0, 1000) === 1000) {
          this.location = new Flora.Vector(getRandomNumber(0, world.bounds[1]),
              getRandomNumber(0, world.bounds[2]));
        }
      };
    }
  });

  function getColorPalette() {
    var temp_pl;
    switch (getRandomNumber(1, 5)) {
      case 1:
        temp_pl = new Flora.ColorPalette('darkPurple');
        temp_pl.addColor({
          min: 1,
          max: 24,
          startColor: [73, 10, 61],
          endColor: [111, 33, 96]
        });
        break;

      case 2:
        temp_pl = new Flora.ColorPalette('pink');
        temp_pl.addColor({
          min: 1,
          max: 24,
          startColor: [189, 21, 80],
          endColor: [236, 67, 126]
        });
        break;

      case 3:
        temp_pl = new Flora.ColorPalette('orange');
        temp_pl.addColor({
          min: 1,
          max: 24,
          startColor: [233, 127, 2],
          endColor: [255, 179, 89]
        });
        break;

      case 4:
        temp_pl = new Flora.ColorPalette('yellow');
        temp_pl.addColor({
          min: 1,
          max: 24,
          startColor: [248, 202, 0],
          endColor: [255, 226, 99]
        });
        break;

      case 5:
        temp_pl = new Flora.ColorPalette('green');
        temp_pl.addColor({
          min: 1,
          max: 24,
          startColor: [138, 155, 15],
          endColor: [188, 205, 63]
        });
        break;
    }
    return temp_pl;
  }
  var pl = getColorPalette();

  var wings = [];

  var beforeStepStick = function() {
    return function() {
      this.angle = 90 + Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));

      if (this.opacity < 1) {
        this.opacity += 0.01;
      }
    };
  };

  var beforeStepPropeller = function() {
    return function() {
      this.flapAngle += Flora.Utils.map(this.velocity.mag(),
          this.minSpeed, this.maxSpeed, 1, 50);

      this.angle = Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x)) +
          (this.index ? this.flapAngle : -this.flapAngle);

      if (this.opacity < 1) {
        this.opacity += 0.01;
      }
    };
  };

  for (var i = 0; i < 25; i++) {

    var wingSize = getRandomNumber(8, 64),
        mass = getRandomNumber(100, 300),
        location = new Flora.Vector(world.bounds[1] / 2 + getRandomNumber(-50, 50),
          world.bounds[2] / 2 + getRandomNumber(-50, 50));

    for (var j = 0; j < 3; j++) {
      wings.push(this.add('Agent', {
        parent: j ? wings[wings.length - j] : null,
        location: j ? new Flora.Vector() : new Flora.Vector(world.bounds[1] / 2 + getRandomNumber(-50, 50),
          world.bounds[2] / 2 + getRandomNumber(-50, 50)),
        seekTarget: target,
        offsetAngle: 0,
        offsetDistance: j ? (j === 1 ? wingSize / 20: -wingSize / 20) : null,
        className: 'roll',
        pointToDirection: false,
        maxSteeringForce: 1000,
        wrapEdges: true,
        flocking: j ? false : true,
        separateStrength: 0.4,
        alignStrength: 0.1,
        cohesionStrength: 0.3,
        width: j ? wingSize : wingSize,
        height: wingSize < 32 ? 1 : 2,
        color: j ? pl.getColor() : [255, 255, 255],
        opacity: 1,
        flapAngle: 0,
        mass: mass,
        index: j,
        beforeStep: j ? beforeStepStick : beforeStepPropeller
      }));
    }
  }

  // objects will flock toward mouse on click and hold
  var mousedown = false;

  Flora.Utils.addEvent(document, 'mousedown', function() {
    mousedown = true;
    Flora.Mantle.System.updateElementPropsByName('Agent', {
      seekTarget: {
        location: new Flora.Vector(Flora.Mantle.System.mouse.location.x, Flora.Mantle.System.mouse.location.y)
      }
    });
  });

  Flora.Utils.addEvent(document, 'mousemove', function() {
    if (mousedown) {
      Flora.Mantle.System.updateElementPropsByName('Agent', {
        seekTarget: {
          location: new Flora.Vector(Flora.Mantle.System.mouse.location.x, Flora.Mantle.System.mouse.location.y)
        }
      });
    }
  });

  Flora.Utils.addEvent(document, 'mouseup', function() {
    mousedown = false;
    Flora.Mantle.System.updateElementPropsByName('Agent', {
      seekTarget: target
    });
  });
});
