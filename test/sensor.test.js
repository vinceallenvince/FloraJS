import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Agent from '../src/agent';
import ParticleSystem from '../src/particlesystem';
import Stimulus from '../src/stimulus';
import Sensor from '../src/sensor';

let obj;

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

beforeEach(beforeTest);

test('load Sensor.', () => {
  expect(Sensor).toBeTruthy();
});

test('new Sensor() should have default properties.', () => {
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

  expect(obj.name).not.toBe('Sensor');
  expect(obj.type).toBe('');
  expect(typeof obj.behavior).toBe('function');
  expect(obj.sensitivity).toBe(200);
  expect(obj.width).toBe(7);
  expect(obj.height).toBe(7);
  expect(obj.offsetDistance === 30).toBeTruthy();
  expect(obj.offsetAngle).toBe(0);
  expect(obj.opacity === 0.75).toBeTruthy();
  expect(obj.target).toBe(null);
  expect(obj.activatedColor[0] === 255 && obj.activatedColor[1] === 255 && obj.activatedColor[2] === 255).toBeTruthy();
  expect(obj.borderRadius).toBe(100);
  expect(obj.borderWidth).toBe(2);
  expect(obj.borderStyle).toBe('solid');
  expect(obj.borderColor[0] === 255 && obj.borderColor[1] === 255 && obj.borderColor[2] === 255).toBeTruthy();
  expect(obj.onConsume).toBe(null);
  expect(obj.rangeDisplayBorderStyle).toBe(false);
  expect(obj.rangeDisplayBorderDefaultColor).toBe(false);
  expect(obj.visibility).toBe('hidden');
});

test('new Sensor() should have custom properties.', () => {
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

  expect(obj.type).toBe('heat');
  expect(obj.behavior()).toBe(100);
  expect(obj.width).toBe(17);
  expect(obj.height).toBe(17);
  expect(obj.offsetDistance).toBeTruthy();
  expect(obj.offsetAngle).toBe(30);
  expect(obj.opacity).toBeTruthy();
  expect(obj.target.x).toBe(100);
  expect(obj.activatedColor[0] === 100 && obj.activatedColor[1] === 110 && obj.activatedColor[2] === 120).toBeTruthy();
  expect(obj.borderRadius).toBe(30);
  expect(obj.borderWidth).toBe(4);
  expect(obj.borderStyle).toBe('double');
  expect(obj.borderColor[0] === 100 && obj.borderColor[1] === 110 && obj.borderColor[2] === 120).toBeTruthy();
  expect(obj.borderWidth).toBe(4);
  expect(obj.onConsume()).toBe(100);
  expect(obj.displayRange).toBe(true);
  expect(obj.displayConnector).toBe(true);
  expect(obj.rangeDisplayBorderStyle).toBe('dotted');
  expect(obj.rangeDisplayBorderDefaultColor[0] === 200 && obj.rangeDisplayBorderDefaultColor[1] === 200 && obj.rangeDisplayBorderDefaultColor[2] === 200).toBeTruthy();

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

  expect(obj.displayRange).toBe(false);
  expect(obj.displayConnector).toBe(false);
  expect(obj.activationLocation instanceof Burner.Vector).toBe(true);
  expect(obj._force instanceof Burner.Vector).toBe(true);
});

test('new Sensor() location should match parent location if offsetDistance = 0.', () => {
  var obj, sensor, agent;

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

  expect(sensor.location.x).toBe(sensor.parent.location.x);
  expect(sensor.location.y).toBe(sensor.parent.location.y);
});

test('step() should set additional properties.', () => {
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

  expect(sensor.activationLocation.x).toBe(190);
  expect(sensor.activationLocation.y).toBe(140);
  expect(sensor.activated).toBe(true);
  expect(sensor.activatedColor).toBe(heat.color);
  expect(sensor.color).toBe(sensor.activatedColor);
  expect(val).toBe(100);

  //

  beforeTest();

  val = 0;

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

  expect(Burner.System._records.length).toBe(5);
  expect(sensor.connector.parentB).toBe(heat);

  // move the stimulus so we can deactivate the sensor
  heat.location.x = 0;
  heat.location.y = 0;

  Burner.System._stepForward();

  expect(Burner.System._records.length).toBe(4);
  expect(sensor.connector).toBe(null);
  expect(sensor.target).toBe(null);
  expect(sensor.activated).toBe(false);
  expect(sensor.state).toBe(null);
  expect(sensor.color[0] === 255 && sensor.color[1] === 255 && sensor.color[2] === 255).toBeTruthy();
  expect(sensor.activationLocation.x).toBe(null);
  expect(sensor.activationLocation.y).toBe(null);
});

test('sensorActive() should check if sensor should be active.', () => {
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

  expect(sensor._sensorActive(heat)).toBe(true);

  // move the stimulus so we can deactivate the sensor
  heat.location.x = 0;
  heat.location.y = 0;

  expect(sensor._sensorActive(heat)).toBe(false);
});

test('getBehavior() updates objects in system based on behavior type.', () => {
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
  expect(parseFloat(likes.x.toFixed(2)) === 3.54 && parseFloat(likes.y.toFixed(2)) === 3.53).toBeTruthy();

  sensor.behavior = 'COWARD';
  var behavior = sensor.getBehavior();
  var coward = behavior.call(agent, sensor, heat);
  expect(parseFloat(coward.x.toFixed(2)) === -0.15 && parseFloat(coward.y.toFixed(2)) === -0.15).toBeTruthy();

  heat.location.x = 200; // change location to get very close to stimulus
  heat.location.y = 150;

  sensor.behavior = 'AGGRESSIVE';
  var behavior = sensor.getBehavior();
  var aggressive = behavior.call(agent, sensor, heat);
  expect(parseFloat(aggressive.x.toFixed(2)) === 1 && parseFloat(aggressive.y.toFixed(2)) === 0.89).toBeTruthy();

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  sensor.behavior = 'AGGRESSIVE';
  var behavior = sensor.getBehavior();
  var aggressive = behavior.call(agent, sensor, heat);
  expect(parseFloat(aggressive.x.toFixed(2)) === 3.55 && parseFloat(aggressive.y.toFixed(2)) === 3.52).toBeTruthy();

  heat.location.x = 195; // change location to get very close to stimulus
  heat.location.y = 145;

  sensor.behavior = 'CURIOUS';
  var behavior = sensor.getBehavior();
  var curious = behavior.call(agent, sensor, heat);
  expect(parseFloat(curious.x.toFixed(2)) === 0.25 && parseFloat(curious.y.toFixed(2)) === 0.15).toBeTruthy();

  Burner.System._stepForward();

  var curious = behavior.call(agent, sensor, heat);
  expect(parseFloat(curious.x.toFixed(2)) === -3.63 && parseFloat(curious.y.toFixed(2)) === -3.43).toBeTruthy();

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  sensor.behavior = 'EXPLORER';
  var behavior = sensor.getBehavior();
  var explorer = behavior.call(agent, sensor, heat);
  expect(parseFloat(explorer.x.toFixed(2)) === -0.17 && parseFloat(explorer.y.toFixed(2)) === -0.18).toBeTruthy();

  heat.location.x = 195; // change location to get very close to stimulus
  heat.location.y = 145;

  agent.velocity.x = 0;
  agent.velocity.y = 0;
  var behavior = sensor.getBehavior();
  var explorer = behavior.call(agent, sensor, heat);
  expect(parseFloat(explorer.x.toFixed(2)) === -0.18 && parseFloat(explorer.y.toFixed(2)) === -0.17).toBeTruthy();

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  sensor.behavior = 'LOVES';
  var behavior = sensor.getBehavior();
  var loves = behavior.call(agent, sensor, heat);
  expect(parseFloat(loves.x.toFixed(2)) === 0.89 && parseFloat(loves.y.toFixed(2)) === 0.88).toBeTruthy();

  heat.location.x = 192; // change location to get very close to stimulus
  heat.location.y = 142;

  var behavior = sensor.getBehavior();
  var loves = behavior.call(agent, sensor, heat);
  expect(parseFloat(loves.x.toFixed(2)) === 0 && parseFloat(loves.y.toFixed(2)) === 0).toBeTruthy();

  heat.location.x = 210; // change to initial location
  heat.location.y = 160;

  agent.velocity.x = 1;
  agent.velocity.y = 1;

  sensor.behavior = 'ACCELERATE';
  var behavior = sensor.getBehavior();
  var accel = behavior.call(agent, sensor, heat);
  expect(parseFloat(accel.x.toFixed(2)) === 0.25 && parseFloat(accel.y.toFixed(2)) === 0.25).toBeTruthy();

  agent.velocity.x = 1;
  agent.velocity.y = 1;

  sensor.behavior = 'DECELERATE';
  var behavior = sensor.getBehavior();
  var decel = behavior.call(agent, sensor, heat);
  expect(parseFloat(decel.x.toFixed(2)) === -0.25 && parseFloat(decel.y.toFixed(2)) === -0.25).toBeTruthy();
});

test('getBehavior() DESTORY should remove the target stimulus and create a ParticleSystem.', () => {
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
  expect(totalStimulus).toBe(0);
  expect(totalPS).toBe(1);
  expect(val).toBe(100);
});

test('getBehavior() CONSUME should shrink the target until it\'s small enough to be removed.', () => {
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
  var heatBoxShadowSpread = heat.boxShadowSpread;

  Burner.System._stepForward();

  var sensor = agent.sensors[0];

  heat.location.x = 192; // change location to get very close to stimulus
  heat.location.y = 142;

  sensor.behavior = 'CONSUME';
  var behavior = sensor.getBehavior();
  behavior.call(agent, sensor, heat);

  expect(sensor.parent['heatLevel']).toBe(1);
  expect(heat.height < heatInitialHeight).toBeTruthy();
  expect(heat.borderWidth < heatBorderWidth).toBeTruthy();
  expect(heat.boxShadowSpread < heatBoxShadowSpread).toBeTruthy();

  heat.width = 1;

  Burner.System._stepForward();
  behavior.call(agent, sensor, heat);

  var totalStimulus = Burner.System.getAllItemsByName('heat').length;

  expect(totalStimulus).toBe(0);
  expect(val).toBe(100);
});
