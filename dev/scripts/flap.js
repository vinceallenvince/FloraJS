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

  var pl = new Flora.ColorPalette();
  if (getRandomNumber(1, 2) === 1) {
    pl.addColor({
      min: 1,
      max: 24,
      startColor: [200, 125, 0],
      endColor: [255, 150, 255]
    });
  } else {
    pl.addColor({
      min: 1,
      max: 24,
      startColor: [0, 175, 255],
      endColor: [0, 70, 150]
    });
  }

  var wings = [];

  var beforeStep = function() {
    return function() {
      var parent = this.parent;

      this.flapAngle += Flora.Utils.map(this.velocity.mag(),
          this.minSpeed, this.maxSpeed, 1, 50);

      this.angle = Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x)) +
           (this.index ? this.flapAngle : -this.flapAngle);

      if (this.opacity < 1) {
        this.opacity += 0.01;
      }
    };
  };

  for (var i = 0; i < 40; i++) {

    var wingSize = getRandomNumber(4, 32),
        color = pl.getColor(),
        mass = getRandomNumber(100, 300),
        location = new Flora.Vector(world.bounds[1] / 2 + getRandomNumber(-50, 50),
          world.bounds[2] / 2 + getRandomNumber(-50, 50));

    for (var j = 0; j < 2; j++) {
      wings.push(this.add('Agent', {
        parent: j ? wings[wings.length - 1] : null,
        location: location,
        seekTarget: target,
        offsetDistance: 0,
        className: 'wing',
        pointToDirection: false,
        wrapEdges: true,
        flocking: j ? true : false,
        separateStrength: 0.4,
        alignStrength: 0.1,
        cohesionStrength: 0.3,
        width: wingSize,
        height: wingSize < 12 ? 1 : 2,
        border: 'none',
        color: color,
        opacity: 0,
        flapAngle: 0,
        mass: mass,
        index: j,
        beforeStep: beforeStep
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
