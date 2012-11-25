/*global Flora, document */
Flora.System.start(function () {

  var getRandomNumber = Flora.Utils.getRandomNumber,
      universe = Flora.universe.first();

  Flora.universe.update({
    c: 0,
    gravity: new Flora.Vector()
  });

  var pl = new Flora.ColorPalette();
  pl.addColor({
    min: 1,
    max: 24,
    startColor: [135, 227, 26],
    endColor: [89, 165, 0]
  });

  var wings = [];

  var beforeStepStem = function() {

    this.angle = 90 + Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y,
        this.velocity.x));

    if (this.opacity < 1) {
      this.opacity += 0.01;
    }
  };

  var beforeStepPropeller = function() {

    /*this.flapAngle += Flora.Utils.map(this.velocity.mag(),
        this.minSpeed, this.maxSpeed, 1, 50);*/

   // this.flapAngle += exports.Utils.map(Flora.SimplexNoise.noise(this.perlinTime, 0, 0.1), -1, 1 ,1, 50);

    this.flapAngle += Flora.Utils.map(Flora.SimplexNoise.noise(this.perlinTime, 0, 0.1), -1, 1 ,1, 10);

   this.perlinTime += 0.01;

    this.angle = Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x)) +
         (this.index ? this.flapAngle : -this.flapAngle);

    if (this.opacity < 1) {
      this.opacity += 0.01;
    }
  };

  var beforeStepBody = function() {};

  for (var i = 0; i < 1; i++) {

    var wingSize = getRandomNumber(64, 64),
        mass = getRandomNumber(100, 300);

    for (var j = 0; j < 3; j++) {
      wings.push(new Flora.Agent({
        parent: j ? wings[wings.length - j] : null,
        location: j ? new Flora.Vector() : new Flora.Vector(universe.width/2, universe.height - wingSize),
        angle: 0,
        perlinTime: 1000,
        seekTarget: null,
        offsetAngle: j ? 90 : 0,
        offsetDistance: j === 1 ? wingSize / 2: 0,
        className: j ? 'wing': 'body',
        pointToDirection: false,
        maxSteeringForce: 1000,
        wrapEdges: true,
        flocking: j ? false : false,
        separateStrength: 0.4,
        alignStrength: 0.1,
        cohesionStrength: 0.3,
        width: j ? wingSize : wingSize / 4,
        height: j ? 2 : wingSize / 4,
        color: j ? pl.getColor() : [255, 255, 255],
        opacity: 1,
        flapAngle: 0,
        mass: mass,
        index: j,
        beforeStep: j ? (j === 1 ? beforeStepStem : beforeStepPropeller) : beforeStepBody
      }));
    }
  }
});
