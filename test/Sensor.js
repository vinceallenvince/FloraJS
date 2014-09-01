var Burner = require('burner'),
    test = require('tape'),
    Agent = require('../src/Agent'),
    ParticleSystem = require('../src/ParticleSystem'),
    Stimulus = require('../src/Stimulus'),
    Sensor, obj;

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

test('load Sensor.', function(t) {
  Sensor = require('../src/Sensor');
  t.ok(Sensor, 'object loaded');
  t.end();
});

test('new Sensor() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Sensor: Sensor
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Sensor();
    obj.init(world);
  });

  t.notEqual(obj.name, 'Sensor', 'System.add() should pass name.');
  t.equal(obj.type, '', 'default type.');
  t.equal(typeof obj.behavior, 'function', 'default behavior.');
  t.equal(obj.sensitivity, 200, 'default sensitivity.');
  t.equal(obj.width, 7, 'default width.');
  t.equal(obj.height, 7, 'default height.');
  t.assert(obj.offsetDistance === 30, 'default offsetDistance.');
  t.equal(obj.offsetAngle, 0, 'default offsetAngle.');
  t.assert(obj.opacity === 0.75, 'default opacity.');
  t.equal(obj.target, null, 'default target.');
  t.assert(obj.activatedColor[0] === 255 && obj.activatedColor[1] === 255 && obj.activatedColor[2] === 255, 'default activatedColor.');
  t.equal(obj.borderRadius, 100, 'default borderRadius.');
  t.equal(obj.borderWidth, 2, 'default borderWidth.');
  t.equal(obj.borderStyle, 'solid', 'default borderStyle.');
  t.assert(obj.borderColor[0] === 255 && obj.borderColor[1] === 255 && obj.borderColor[2] === 255, 'default borderColor.');
  t.equal(obj.onConsume, null, 'default onConsume.');
  t.equal(obj.rangeDisplayBorderStyle, false, 'default rangeDisplayBorderStyle');
  t.equal(obj.rangeDisplayBorderDefaultColor, false, 'default rangeDisplayBorderDefaultColor.');
  t.equal(obj.visibility, 'hidden', 'default visibility.')

  t.end();
});

test('new Sensor() should have custom properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Sensor: Sensor
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Sensor', {
      type: 'heat',
      behavior: function() {return 100;},
      sensitivity: 100,
      width: 17,
      height: 17,
      offsetDistance: 10,
      offsetAngle: 30,
      opacity: 0.5,
      target: {x: 100},
      activatedColor: [100, 110, 120],
      borderRadius: 30,
      borderWidth: 4,
      borderStyle: 'double',
      borderColor: [100, 110, 120],
      onConsume: function() {return 100;},
      displayRange: true,
      displayConnector: true,
      rangeDisplayBorderStyle: 'dotted',
      rangeDisplayBorderDefaultColor: [200, 200, 200]
    });
  });

  t.equal(obj.type, 'heat', 'custom type');
  t.equal(obj.behavior(), 100, 'custom behavior.');
  t.equal(obj.width, 17, 'custom width.');
  t.equal(obj.height, 17, 'custom height.');
  t.assert(obj.offsetDistance, 10, 'custom offsetDistance.');
  t.equal(obj.offsetAngle, 30, 'custom offsetAngle.');
  t.assert(obj.opacity, 0.5, 'custom opacity.');
  t.equal(obj.target.x, 100, 'custom target.');
  t.assert(obj.activatedColor[0] === 100 && obj.activatedColor[1] === 110 && obj.activatedColor[2] === 120, 'custom activatedColor.');
  t.equal(obj.borderRadius, 30, 'custom borderRadius.');
  t.equal(obj.borderWidth, 4, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'double', 'custom borderStyle.');
  t.assert(obj.borderColor[0] === 100 && obj.borderColor[1] === 110 && obj.borderColor[2] === 120, 'custom borderColor.');
  t.equal(obj.borderWidth, 4, 'custom borderWidth.');
  t.equal(obj.onConsume(), 100, 'custom onConsume.');
  t.equal(obj.displayRange, true, 'custom displayRange.');
  t.equal(obj.displayConnector, true, 'custom displayConnector.');
  t.equal(obj.rangeDisplayBorderStyle, 'dotted', 'default rangeDisplayBorderStyle');
  t.assert(obj.rangeDisplayBorderDefaultColor[0] === 200 && obj.rangeDisplayBorderDefaultColor[1] === 200 && obj.rangeDisplayBorderDefaultColor[2] === 200, 'default rangeDisplayBorderDefaultColor.');

  //

  beforeTest();

  Burner.System.Classes = {
    Sensor: Sensor
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Sensor'); // add your new object to the system
  });

  t.equal(obj.displayRange, false, 'default displayRange.');
  t.equal(obj.displayConnector, false, 'default displayConnector.');
  t.equal(obj.activationLocation instanceof Burner.Vector, true, 'default activationLocation');
  t.equal(obj._force instanceof Burner.Vector, true, 'default _force');

  t.end();
});

test('new Sensor() location should match parent location if offsetDistance = 0.', function(t) {

  beforeTest();

  var obj, sensor, agent

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(190, 140)
    });
    sensor = this.add('Sensor', {
      parent: agent,
      type: 'heat',
      location: new Burner.Vector(200, 150),
      offsetDistance: 0
    });
  });

  sensor.step();

  t.equal(sensor.location.x, sensor.parent.location.x, 'updates location.x');
  t.equal(sensor.location.y, sensor.parent.location.y, 'updates location.y');

  t.end();
});

test('step() should set additional properties.', function(t) {

  beforeTest();

  var obj, sensor, heat, agent, val = 0;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(190, 140)
    });
    sensor = this.add('Sensor', {
      parent: agent,
      type: 'heat',
      location: new Burner.Vector(200, 150),
      afterStep: function() {
        val = 100;
      }
    });
    heat = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(210, 160)
    });
  });

  Burner.System._stepForward();

  t.equal(sensor.activationLocation.x, 190, 'updates activationLocation.x');
  t.equal(sensor.activationLocation.y, 140, 'updates activationLocation.y');
  t.equal(sensor.activated, true, 'sets activated = true.');
  t.equal(sensor.activatedColor, heat.color, 'sets activatedColor = parent.activatedColor.');
  t.equal(sensor.color, sensor.activatedColor, 'sets color = activatedColor.');
  t.equal(val, 100, 'calls afterStep.');
  //

  beforeTest();

  var obj, sensor, heat, agent, val = 0;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(190, 140)
    });
    sensor = this.add('Sensor', {
      parent: agent,
      type: 'heat',
      location: new Burner.Vector(200, 150),
      displayConnector: true
    });
    heat = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(210, 160)
    });
  });

  Burner.System._stepForward();

  t.equal(Burner.System._records.length, 5, 'displayConnector: true creates a connector.');
  t.equal(sensor.connector.parentB, heat, 'sensor\'s connector parentB is the sensor\'s target.');

  // move the stimulus so we can deactivate the sensor
  heat.location.x = 0;
  heat.location.y = 0;

  Burner.System._stepForward();

  t.equal(Burner.System._records.length, 4, 'the sensor was removed from System._records.');
  t.equal(sensor.connector, null, 'sensor deactivated; connector = null.');
  t.equal(sensor.target, null, 'sensor deactivated; target = null.');
  t.equal(sensor.activated, false, 'sensor deactivated; activated = false.');
  t.equal(sensor.state, null, 'sensor deactivated; state = null.');
  t.assert(sensor.color[0] === 255 && sensor.color[1] === 255 && sensor.color[2] === 255, 'sensor deactivated; color = [255, 255, 255].');
  t.equal(sensor.activationLocation.x, null, 'sensor deactivated; activationLocation.x = null.');
  t.equal(sensor.activationLocation.y, null, 'sensor deactivated; activationLocation.y = null.');

  t.end();
});

test('sensorActive() should check if sensor should be active.', function(t) {

  beforeTest();

  var obj, sensor, heat, agent, val = 0;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(190, 140)
    });
    sensor = this.add('Sensor', {
      parent: agent,
      type: 'heat',
      location: new Burner.Vector(200, 150)
    });
    heat = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(210, 160)
    });
  });

  t.equal(sensor._sensorActive(heat), true, 'sensor active.');

  // move the stimulus so we can deactivate the sensor
  heat.location.x = 0;
  heat.location.y = 0;

  t.equal(sensor._sensorActive(heat), false, 'sensor inactive.');

  t.end();

});

test('getBehavior() updates objects in system based on behavior type.', function(t) {

  beforeTest();

  var obj, sensor, heat, agent, val = 0;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(190, 140),
      sensors: [
        this.add('Sensor', {
          type: 'heat',
          offsetDistance: 0
        })
      ]
    });
    heat = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(210, 160)
    });
  });

  Burner.System._stepForward();

  var sensor = agent.sensors[0];

  sensor.behavior = 'LIKES';
  var behavior = sensor.getBehavior();
  var likes = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(likes.x.toFixed(2)) === 3.54 && parseFloat(likes.y.toFixed(2)) === 3.53, 'behavior = LIKES.');

  sensor.behavior = 'COWARD';
  var behavior = sensor.getBehavior();
  var coward = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(coward.x.toFixed(2)) === -0.15 && parseFloat(coward.y.toFixed(2)) === -0.15, 'behavior = COWARD.');

  heat.location.x = 200; // change location to get very close to stimulus
  heat.location.y = 150;

  sensor.behavior = 'AGGRESSIVE';
  var behavior = sensor.getBehavior();
  var aggressive = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(aggressive.x.toFixed(2)) === 1 && parseFloat(aggressive.y.toFixed(2)) === 0.89, 'behavior = AGGRESSIVE; very close.');

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  sensor.behavior = 'AGGRESSIVE';
  var behavior = sensor.getBehavior();
  var aggressive = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(aggressive.x.toFixed(2)) === 3.55 && parseFloat(aggressive.y.toFixed(2)) === 3.52, 'behavior = AGGRESSIVE.');

  heat.location.x = 195; // change location to get very close to stimulus
  heat.location.y = 145;

  sensor.behavior = 'CURIOUS';
  var behavior = sensor.getBehavior();
  var curious = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(curious.x.toFixed(2)) === 0.25 && parseFloat(curious.y.toFixed(2)) === 0.15, 'behavior = CURIOUS.');

  Burner.System._stepForward();

  var curious = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(curious.x.toFixed(2)) === -3.63 && parseFloat(curious.y.toFixed(2)) === -3.43, 'behavior = CURIOUS.');

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  sensor.behavior = 'EXPLORER';
  var behavior = sensor.getBehavior();
  var explorer = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(explorer.x.toFixed(2)) === -0.17 && parseFloat(explorer.y.toFixed(2)) === -0.18, 'behavior = EXPLORER.');

  heat.location.x = 195; // change location to get very close to stimulus
  heat.location.y = 145;

  agent.velocity.x = 0;
  agent.velocity.y = 0;
  var behavior = sensor.getBehavior();
  var explorer = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(explorer.x.toFixed(2)) === -0.18 && parseFloat(explorer.y.toFixed(2)) === -0.17, 'behavior = EXPLORER.');

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  sensor.behavior = 'LOVES';
  var behavior = sensor.getBehavior();
  var loves = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(loves.x.toFixed(2)) === 0.89 && parseFloat(loves.y.toFixed(2)) === 0.88, 'behavior = LOVES.');

  heat.location.x = 192; // change location to get very close to stimulus
  heat.location.y = 142;

  var behavior = sensor.getBehavior();
  var loves = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(loves.x.toFixed(2)) === 0 && parseFloat(loves.y.toFixed(2)) === 0, 'behavior = LOVES; very close.');

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  agent.velocity.x = 1;
  agent.velocity.y = 1;

  sensor.behavior = 'ACCELERATE';
  var behavior = sensor.getBehavior();
  var accel = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(accel.x.toFixed(2)) === 0.25 && parseFloat(accel.y.toFixed(2)) === 0.25, 'behavior = ACCELERATE.');

  agent.velocity.x = 1;
  agent.velocity.y = 1;

  sensor.behavior = 'DECELERATE';
  var behavior = sensor.getBehavior();
  var decel = behavior.call(agent, sensor, heat);
  t.assert(parseFloat(decel.x.toFixed(2)) === -0.25 && parseFloat(decel.y.toFixed(2)) === -0.25, 'behavior = DECELERATE.');

  t.end();

});

test('getBehavior() DESTORY should remove the target stimulus and create a ParticleSystem.', function(t) {

  beforeTest();

  var obj, sensor, heat, agent, val = 0;

  Burner.System.Classes = {
    Agent: Agent,
    ParticleSystem: ParticleSystem,
    Sensor: Sensor,
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(190, 140),
      sensors: [
        this.add('Sensor', {
          type: 'heat',
          offsetDistance: 0,
          behavior: 'DESTROY',
          onDestroy: function() {
            val = 100;
          }
        })
      ]
    });
    heat = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(192, 142)
    });
  });

  var sensor = agent.sensors[0];

  Burner.System._stepForward();

  var behavior = sensor.getBehavior();
  var destroy = behavior.call(agent, sensor, heat);

  var totalStimulus = Burner.System.getAllItemsByName('heat').length;
  var totalPS = Burner.System.getAllItemsByName('ParticleSystem').length;
  t.equal(totalStimulus, 0, 'DESTROY should remove Stimulus.');
  t.equal(totalPS, 1, 'Should create a Particle system.');
  t.equal(val, 100, 'DESTROY should fire onDestroy callback.');
  t.end();
});

test('getBehavior() CONSUME should shrink the target until it\'s small enough to be removed.', function(t) {

  beforeTest();

  var obj, sensor, heat, agent, val = 0;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(190, 140),
      sensors: [
        this.add('Sensor', {
          type: 'heat',
          offsetDistance: 0,
          onConsume: function() {
            val = 100;
          }
        })
      ]
    });
    heat = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(210, 160)
    });
  });

  var heatInitialHeight = heat.height;
  var heatBorderWidth = heat.borderWidth;
  var heatBoxShadowSpread = heat.boxShadowSpread

  Burner.System._stepForward();

  var sensor = agent.sensors[0];

  heat.location.x = 192; // change location to get very close to stimulus
  heat.location.y = 142;

  sensor.behavior = 'CONSUME';
  var behavior = sensor.getBehavior();
  behavior.call(agent, sensor, heat);

  t.equal(sensor.parent['heatLevel'], 1, 'Should add property \'heatLevel\' and increment it.');
  t.assert(heat.height < heatInitialHeight, 'Target height should decrease.');
  t.assert(heat.borderWidth < heatBorderWidth, 'Target borderWidth should decrease.');
  t.assert(heat.boxShadowSpread < heatBoxShadowSpread, 'Target boxShadowSpread should decrease.');

  heat.width = 1;

  Burner.System._stepForward();
  behavior.call(agent, sensor, heat);

  var totalStimulus = Burner.System.getAllItemsByName('heat').length;

  t.equal(totalStimulus, 0, 'Should remove stimulus when smaller than 2px.');
  t.equal(val, 100, 'Should call sensor\'s onConsume() when smaller than 2px.');


  t.end();
});
