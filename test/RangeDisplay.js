var Burner = require('burner'),
    test = require('tape'),
    Agent = require('../src/Agent'),
    Sensor = require('../src/Sensor'),
    Stimulus = require('../src/Stimulus').Stimulus,
    RangeDisplay, obj;

function beforeTest() {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
}

test('load RangeDisplay.', function(t) {
  RangeDisplay = require('../src/RangeDisplay');
  t.ok(RangeDisplay, 'object loaded');
  t.end();
});

test('init() should set additional properties.', function(t) {

  beforeTest();

  var obj, stimulus, sensor, agent;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus,
    RangeDisplay: RangeDisplay
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    stimulus = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(110, 110)
    });
    sensor = this.add('Sensor', {
      type: 'heat',
      displayRange: true
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(100, 100),
      velocity: new Burner.Vector(10, 0),
      sensors: [sensor]
    });
  });

  t.equal(sensor.rangeDisplay.name, 'RangeDisplay', 'default name.');
  t.equal(sensor.rangeDisplay.zIndex, 10, 'default zIndex.');
  t.equal(sensor.rangeDisplay.borderStyle, 'dashed', 'default borderStyle.');
  t.assert(sensor.rangeDisplay.borderDefaultColor[0] === 150 && sensor.rangeDisplay.borderDefaultColor[1] === 150 && sensor.rangeDisplay.borderDefaultColor[2] === 150, 'default borderDefaultColor.');
  t.equal(sensor.rangeDisplay.borderWidth, 2, 'default borderWidth.');
  t.equal(sensor.rangeDisplay.borderRadius, 100, 'default borderRadius.');
  t.equal(sensor.rangeDisplay.width, sensor.sensitivity, 'default width.');
  t.equal(sensor.rangeDisplay.height, sensor.sensitivity, 'default height.');
  t.equal(sensor.rangeDisplay.minOpacity, 0.3, 'default minOpacity.');
  t.equal(sensor.rangeDisplay.maxOpacity, 0.6, 'default maxOpacity.');
  t.equal(sensor.rangeDisplay.opacity, sensor.rangeDisplay.minOpacity, 'default opacity.');
  t.equal(sensor.rangeDisplay.maxAngularVelocity, 1, 'default maxAngularVelocity.');
  t.equal(sensor.rangeDisplay.minAngularVelocity, 0, 'default minAngularVelocity.');

  Burner.System._stepForward(); // sensor is activated

  t.equal(sensor.rangeDisplay.location.x, sensor.location.x, 'step() updates location.x.');
  t.equal(sensor.rangeDisplay.location.y, sensor.location.y, 'step() updates location.y.');
  t.equal(sensor.rangeDisplay.opacity, sensor.rangeDisplay.maxOpacity, 'opacity equals maxOpacity.');
  t.equal(sensor.rangeDisplay.borderColor, sensor.rangeDisplay.sensor.target.color, 'borderColor equals target color.');

  //

  agent.location = new Burner.Vector(300, 300);
  Burner.System._stepForward(); // sensor is deactivateed

  t.equal(sensor.rangeDisplay.opacity, sensor.rangeDisplay.minOpacity, 'opacity equals minOpacity.');
  t.equal(sensor.rangeDisplay.borderColor, sensor.rangeDisplay.borderDefaultColor, 'borderColor equals borderDefaultColor.');

  //

  beforeTest();

  var obj, stimulus, sensor, agent;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus,
    RangeDisplay: RangeDisplay
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    stimulus = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(110, 110)
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(100, 100),
      velocity: new Burner.Vector(10, 0),
      sensors: [
        this.add('Sensor', {
          type: 'heat',
          displayRange: true,
          rangeDisplayBorderStyle: 'dotted',
          rangeDisplayBorderDefaultColor: [255, 255, 255]
        })
      ]
    });

    var sensor = agent.sensors[0];

    t.equal(sensor.rangeDisplay.borderStyle, 'dotted', 'custom borderStyle.');
    t.assert(sensor.rangeDisplay.borderDefaultColor[0] === 255 && sensor.rangeDisplay.borderDefaultColor[1] === 255 && sensor.rangeDisplay.borderDefaultColor[2] === 255, 'custom borderDefaultColor.');

  });

  //

  beforeTest();

  var obj, stimulus, sensor, agent;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus,
    RangeDisplay: RangeDisplay
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    stimulus = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(110, 110)
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(100, 100),
      velocity: new Burner.Vector(10, 0),
      sensors: [
        this.add('Sensor', {
          type: 'heat',
          displayRange: true
        })
      ]
    });

    var sensor = agent.sensors[0];

    t.equal(sensor.rangeDisplay.borderStyle, 'dashed', 'custom borderStyle.');
    t.assert(sensor.rangeDisplay.borderDefaultColor[0] === 150 && sensor.rangeDisplay.borderDefaultColor[1] === 150 && sensor.rangeDisplay.borderDefaultColor[2] === 150, 'custom borderDefaultColor.');

  });

  t.end();
});

test('new RangeDisplay() should require options.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    RangeDisplay: RangeDisplay
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new RangeDisplay();
    t.throws(function () {
      obj.init(world);
    }, 'should throw exception when not passed a sensor.');
  });

  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  var obj, stimulus, sensor, agent;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus,
    RangeDisplay: RangeDisplay
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    stimulus = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(110, 110)
    });
    sensor = this.add('Sensor', {
      type: 'heat',
      displayRange: true
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(100, 100),
      velocity: new Burner.Vector(10, 0),
      sensors: [sensor]
    });
  });

  sensor.rangeDisplay.draw();
  t.equal(sensor.rangeDisplay.el.style.width, '200px', 'el.style width.');
  t.equal(sensor.rangeDisplay.el.style.height, '200px', 'el.style height.');
  t.equal(sensor.rangeDisplay.el.style.borderTopWidth, '2px', 'el.style border top width');
  t.equal(sensor.rangeDisplay.el.style.borderRightWidth, '2px', 'el.style border right width');
  t.equal(sensor.rangeDisplay.el.style.borderBottomWidth, '2px', 'el.style border bottom width');
  t.equal(sensor.rangeDisplay.el.style.borderLeftWidth, '2px', 'el.style border left width');
  t.equal(sensor.rangeDisplay.el.style.borderTopStyle, 'dashed', 'el.style border top style');
  t.equal(sensor.rangeDisplay.el.style.borderRightStyle, 'dashed', 'el.style border right style');
  t.equal(sensor.rangeDisplay.el.style.borderBottomStyle, 'dashed', 'el.style border bottom style');
  t.equal(sensor.rangeDisplay.el.style.borderLeftStyle, 'dashed', 'el.style border left style');
  t.equal(sensor.rangeDisplay.el.style.borderTopColor, 'rgb(150, 150, 150)', 'el.style border top color');
  t.equal(sensor.rangeDisplay.el.style.borderRightColor, 'rgb(150, 150, 150)', 'el.style border right color');
  t.equal(sensor.rangeDisplay.el.style.borderBottomColor, 'rgb(150, 150, 150)', 'el.style border bottom color');
  t.equal(sensor.rangeDisplay.el.style.borderLeftColor, 'rgb(150, 150, 150)', 'el.style border left color');
  t.notEqual(sensor.rangeDisplay.el.style.borderTopLeftRadius.search('100%'), -1, 'el.style border top left radius');
  t.notEqual(sensor.rangeDisplay.el.style.borderTopRightRadius.search('100%'), -1, 'el.style border top right radius');
  t.notEqual(sensor.rangeDisplay.el.style.borderBottomRightRadius.search('100%'), -1, 'el.style border bottom right radius');
  t.notEqual(sensor.rangeDisplay.el.style.borderBottomLeftRadius.search('100%'), -1, 'el.style border bottom left radius');

  t.end();
});
