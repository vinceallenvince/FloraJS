import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Agent from '../src/agent';
import Sensor from '../src/sensor';
import Stimulus from '../src/stimulus';
import RangeDisplay from '../src/rangedisplay';

let obj;

function resetSystem() {
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

beforeEach(resetSystem);

test('load RangeDisplay.', () => {
  expect(RangeDisplay).toBeTruthy();
});

test('init() should set additional properties.', () => {
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

  expect(sensor.rangeDisplay.name).toBe('RangeDisplay');
  expect(sensor.rangeDisplay.zIndex).toBe(10);
  expect(sensor.rangeDisplay.borderStyle).toBe('dashed');
  expect(sensor.rangeDisplay.borderDefaultColor[0] === 150 && sensor.rangeDisplay.borderDefaultColor[1] === 150 && sensor.rangeDisplay.borderDefaultColor[2] === 150).toBeTruthy();
  expect(sensor.rangeDisplay.borderWidth).toBe(2);
  expect(sensor.rangeDisplay.borderRadius).toBe(100);
  expect(sensor.rangeDisplay.width).toBe(sensor.sensitivity);
  expect(sensor.rangeDisplay.height).toBe(sensor.sensitivity);
  expect(sensor.rangeDisplay.minOpacity).toBe(0.3);
  expect(sensor.rangeDisplay.maxOpacity).toBe(0.6);
  expect(sensor.rangeDisplay.opacity).toBe(sensor.rangeDisplay.minOpacity);
  expect(sensor.rangeDisplay.maxAngularVelocity).toBe(1);
  expect(sensor.rangeDisplay.minAngularVelocity).toBe(0);

  Burner.System._stepForward(); // sensor is activated

  expect(sensor.rangeDisplay.location.x).toBe(sensor.location.x);
  expect(sensor.rangeDisplay.location.y).toBe(sensor.location.y);
  expect(sensor.rangeDisplay.opacity).toBe(sensor.rangeDisplay.maxOpacity);
  expect(sensor.rangeDisplay.borderColor).toBe(sensor.rangeDisplay.sensor.target.color);

  //

  agent.location = new Burner.Vector(300, 300);
  Burner.System._stepForward(); // sensor is deactivateed

  expect(sensor.rangeDisplay.opacity).toBe(sensor.rangeDisplay.minOpacity);
  expect(sensor.rangeDisplay.borderColor).toBe(sensor.rangeDisplay.borderDefaultColor);

  //

  resetSystem();

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

    expect(sensor.rangeDisplay.borderStyle).toBe('dotted');
    expect(sensor.rangeDisplay.borderDefaultColor[0] === 255 && sensor.rangeDisplay.borderDefaultColor[1] === 255 && sensor.rangeDisplay.borderDefaultColor[2] === 255).toBeTruthy();
  });

  //

  resetSystem();

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

    expect(sensor.rangeDisplay.borderStyle).toBe('dashed');
    expect(sensor.rangeDisplay.borderDefaultColor[0] === 150 && sensor.rangeDisplay.borderDefaultColor[1] === 150 && sensor.rangeDisplay.borderDefaultColor[2] === 150).toBeTruthy();
  });
});

test('new RangeDisplay() should require options.', () => {
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
    expect(function() {
      obj.init(world);
    }).toThrow();
  });
});

test('draw() should assign a css test string to the style property.', () => {
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
  expect(sensor.rangeDisplay.el.style.width).toBe('200px');
  expect(sensor.rangeDisplay.el.style.height).toBe('200px');
  expect(sensor.rangeDisplay.el.style.borderTopWidth).toBe('2px');
  expect(sensor.rangeDisplay.el.style.borderRightWidth).toBe('2px');
  expect(sensor.rangeDisplay.el.style.borderBottomWidth).toBe('2px');
  expect(sensor.rangeDisplay.el.style.borderLeftWidth).toBe('2px');
  expect(sensor.rangeDisplay.el.style.borderTopStyle).toBe('dashed');
  expect(sensor.rangeDisplay.el.style.borderRightStyle).toBe('dashed');
  expect(sensor.rangeDisplay.el.style.borderBottomStyle).toBe('dashed');
  expect(sensor.rangeDisplay.el.style.borderLeftStyle).toBe('dashed');
  expect(sensor.rangeDisplay.el.style.borderTopColor).toBe('rgb(150, 150, 150)');
  expect(sensor.rangeDisplay.el.style.borderRightColor).toBe('rgb(150, 150, 150)');
  expect(sensor.rangeDisplay.el.style.borderBottomColor).toBe('rgb(150, 150, 150)');
  expect(sensor.rangeDisplay.el.style.borderLeftColor).toBe('rgb(150, 150, 150)');
  // jsdom does not expand the border-radius shorthand into longhand
  // properties, so assert on the shorthand.
  expect(sensor.rangeDisplay.el.style.borderRadius.search('100%')).not.toBe(-1);
});
