/*global Flora, document */
Flora.System.start(function () {

  var getRandomNumber = Flora.Utils.getRandomNumber,
      universe = Flora.universe.first();

  Flora.universe.update({
    c: 0,
    gravity: new Flora.Vector()
  });

  var flowField = new Flora.FlowField({
    createMarkers: false,
    resolution: 20,
    perlinSpeed: 0.015,
    perlinTime: 520
  });
  flowField.build();

  var pl;
  if (getRandomNumber(1, 2) === 1) {
    pl = new Flora.ColorPalette();
    pl.addColor({
      min: 1,
      max: 24,
      startColor: [200, 125, 0],
      endColor: [255, 150, 255]
    });
  } else {
    pl = new Flora.ColorPalette();
    pl.addColor({
      min: 1,
      max: 24,
      startColor: [0, 175, 255],
      endColor: [0, 70, 150]
    });
  }

  var target = new Flora.Agent({
    flowField: flowField,
    wrapEdges: true,
    mass: getRandomNumber(100, 300),
    opacity: 0,
    beforeStep: function() {
      if (getRandomNumber(0, 1000) === 1000) {
        var universe = Flora.universe.first();
        this.location = new Flora.Vector(getRandomNumber(0, universe.width),
            getRandomNumber(0, universe.height));
        }
    }
  });

  var wings = [];

  var beforeStep = function() {
    var parent = this.parent;

    this.flapAngle += Flora.Utils.map(this.velocity.mag(),
        this.minSpeed, this.maxSpeed, 1, 50);

    this.angle = Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x)) +
         (this.index ? this.flapAngle : -this.flapAngle);

    if (this.opacity < 1) {
      this.opacity += 0.01;
    }
  };

  for (var i = 0; i < 30; i++) {

    var wingSize = getRandomNumber(4, 32),
        color = pl.getColor(),
        mass = getRandomNumber(100, 300),
        location = new Flora.Vector(universe.width/2 + getRandomNumber(-50, 50),
          universe.height/2 + getRandomNumber(-50, 50));

    for (var j = 0; j < 2; j++) {
      wings.push(new Flora.Agent({
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
    Flora.elementList.updatePropsByName('Agent', {
      seekTarget: {
        location: new Flora.Vector(Flora.mouse.loc.x, Flora.mouse.loc.y)
      }
    });
  });

  Flora.Utils.addEvent(document, 'mousemove', function() {
    if (mousedown) {
      Flora.elementList.updatePropsByName('Agent', {
        seekTarget: {
          location: new Flora.Vector(Flora.mouse.loc.x, Flora.mouse.loc.y)
        }
      });
    }
  });

  Flora.Utils.addEvent(document, 'mouseup', function() {
    mousedown = false;
    Flora.elementList.updatePropsByName('Agent', {
      seekTarget: target
    });
  });
});
