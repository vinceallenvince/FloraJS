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
  switch (getRandomNumber(1, 3)) {
    case 1:
      pl = new Flora.ColorPalette();
      pl.addColor({
        min: 1,
        max: 24,
        startColor: [135, 227, 26],
        endColor: [89, 165, 0]
      });
      break;

    case 2:
      pl = new Flora.ColorPalette();
      pl.addColor({
        min: 1,
        max: 24,
        startColor: [237, 20, 91],
        endColor: [255, 122, 165]
      });
      break;

    case 3:
      pl = new Flora.ColorPalette();
      pl.addColor({
        min: 1,
        max: 24,
        startColor: [109, 207, 246],
        endColor: [0, 118, 163]
      });
      break;
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

  var beforeStepA = function() {

    this.angle = 90 + Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));

    if (this.opacity < 1) {
      this.opacity += 0.01;
    }
  };

  var beforeStepB = function() {

    this.flapAngle += Flora.Utils.map(this.velocity.mag(),
        this.minSpeed, this.maxSpeed, 1, 50);

    this.angle = Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x)) +
         (this.index ? this.flapAngle : -this.flapAngle);

    if (this.opacity < 1) {
      this.opacity += 0.01;
    }
  };

  for (var i = 0; i < 30; i++) {

    var wingSize = getRandomNumber(8, 64),
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
        maxSteeringForce: 1000,
        wrapEdges: true,
        flocking: j ? true : false,
        separateStrength: 0.4,
        alignStrength: 0.1,
        cohesionStrength: 0.3,
        width: j ? wingSize : wingSize / 2,
        height: wingSize < 32 ? 1 : 2,
        color: j ? pl.getColor() : [255, 255, 255],
        opacity: 0,
        flapAngle: 0,
        mass: mass,
        index: j,
        beforeStep: j ? beforeStepA : beforeStepB
      }));
    }
  }
});
