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

  var beforeStick = function() {

    this.angle = 90 + Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x));

    if (this.opacity < 1) {
      this.opacity += 0.01;
    }
  };

  var beforeStepPropeller = function() {

    this.flapAngle += Flora.Utils.map(this.velocity.mag(),
        this.minSpeed, this.maxSpeed, 1, 50);

    this.angle = Flora.Utils.radiansToDegrees(Math.atan2(this.velocity.y, this.velocity.x)) +
         (this.index ? this.flapAngle : -this.flapAngle);

    if (this.opacity < 1) {
      this.opacity += 0.01;
    }
  };

  for (var i = 0; i < 15; i++) {

    var wingSize = getRandomNumber(8, 64),
        mass = getRandomNumber(100, 300),
        location = new Flora.Vector(universe.width/2 + getRandomNumber(-50, 50),
          universe.height/2 + getRandomNumber(-50, 50));

    for (var j = 0; j < 3; j++) {
      wings.push(new Flora.Agent({
        parent: j ? wings[wings.length - j] : null,
        location: j ? new Flora.Vector() : new Flora.Vector(universe.width/2 + getRandomNumber(-50, 50),
          universe.height/2 + getRandomNumber(-50, 50)),
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
        beforeStep: j ? beforeStick : beforeStepPropeller
      }));
    }
  }

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

    var i, max, list = Flora.elementList.getAllByAttribute('index', 0);

    // return a new palette that is not the same as the old
    var new_pl = {
      id: pl.id
    };

    while (new_pl.id === pl.id) {
      new_pl = getColorPalette();
    }

    // change all items' color
    Flora.elementList.updatePropsByName('Agent', {
      seekTarget: target,
      color: new_pl.getColor()
    });

    pl = new_pl;

    // reset main elements to white
    for (i = 0, max = list.length; i < max; i++) {
      list[i].color = [255, 255, 255];
    }

    Flora.elementList.updatePropsByName('Agent', {
      seekTarget: target
    });
    mousedown = false;
  });
});
