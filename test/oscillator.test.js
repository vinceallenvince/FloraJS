import { test, expect, beforeEach } from 'vitest';
import { createRequire } from 'node:module';
import Burner from '../src/vendor/burner/main';
import Oscillator from '../src/oscillator';

// src/oscillator.js is CommonJS, so its require('./vendor/quietriot') resolves
// through Node's native CJS cache while an ESM import here would get a
// separate Vite-transformed copy. Use createRequire to get the same instance
// the oscillator uses, so SimplexNoise.config() below actually takes effect.
const cjsRequire = createRequire(import.meta.url);
const SimplexNoise = cjsRequire('../src/vendor/quietriot');

var Vector = Burner.Vector;

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

test('load Oscillator.', () => {
  expect(Oscillator).toBeTruthy();
});

test('new Oscillator() should have default properties.', () => {
  Burner.System.Classes = {
    Oscillator: Oscillator
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Oscillator();
    obj.init(world);
  });

  expect(obj.name).not.toBe('Oscillator');
  expect(obj.initialLocation.x === 200 && obj.initialLocation.y === 150).toBeTruthy();
  expect(obj.lastLocation.x === 0 && obj.lastLocation.y === 0).toBeTruthy();
  expect(obj.amplitude.x === 180 && obj.amplitude.y === 130).toBeTruthy();
  expect(obj.acceleration instanceof Vector).toBe(true);
  expect(obj.aVelocity instanceof Vector).toBe(true);
  expect(obj.isStatic).toBe(false);
  expect(obj.perlin).toBe(false);
  expect(obj.perlinSpeed).toBe(0.005);
  expect(obj.perlinTime).toBe(0);
  expect(obj.perlinAccelLow).toBe(-2);
  expect(obj.perlinAccelHigh).toBe(2);
  expect(typeof obj.perlinOffsetX).toBe('number');
  expect(typeof obj.perlinOffsetY).toBe('number');
  expect(obj.width).toBe(20);
  expect(obj.height).toBe(20);
  expect(obj.color[0] === 200 && obj.color[1] === 100 && obj.color[2] === 0).toBeTruthy();
  expect(obj.borderWidth).toBe(0);
  expect(obj.borderStyle).toBe('solid');
  expect(obj.borderColor[0] === 255 && obj.borderColor[1] === 150 && obj.borderColor[2] === 50).toBeTruthy();
  expect(obj.borderRadius).toBe(100);
  expect(obj.boxShadowOffsetX).toBe(0);
  expect(obj.boxShadowOffsetY).toBe(0);
  expect(obj.boxShadowBlur).toBe(0);
  expect(obj.boxShadowSpread).toBe(0);
  expect(obj.boxShadowColor[0] === 200 && obj.boxShadowColor[1] === 100 && obj.boxShadowColor[2] === 0).toBeTruthy();
});

test('new Oscillator() should have custom properties.', () => {
  Burner.System.Classes = {
    Oscillator: Oscillator
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Oscillator', {
      acceleration: new Vector(),
      aVelocity: new Vector(),
      isStatic: true,
      perlin: true,
      perlinSpeed: 0.001,
      perlinTime: 100,
      perlinAccelLow: -3,
      perlinAccelHigh: 3,
      perlinOffsetX: 100,
      perlinOffsetY: 100,
      width: 10,
      height: 10,
      color: [100, 50, 10],
      borderWidth: 20,
      borderStyle: 'dotted',
      borderColor: [150, 10, 10],
      borderRadius: 30,
      boxShadowOffsetX: 10,
      boxShadowOffsetY: 10,
      boxShadowBlur: 4,
      boxShadowSpread: 10,
      boxShadowColor: [10, 30, 80],
      opacity: 0.5,
      zIndex: 200
    });
  });

  expect(obj.acceleration instanceof Vector).toBe(true);
  expect(obj.aVelocity instanceof Vector).toBe(true);
  expect(obj.isStatic).toBe(true);
  expect(obj.perlin).toBe(true);
  expect(obj.perlinSpeed).toBe(0.001);
  expect(obj.perlinTime).toBe(100);
  expect(obj.perlinAccelLow).toBe(-3);
  expect(obj.perlinAccelHigh).toBe(3);
  expect(obj.perlinOffsetX).toBe(100);
  expect(obj.perlinOffsetY).toBe(100);
  expect(obj.width).toBe(10);
  expect(obj.height).toBe(10);
  expect(obj.color[0] === 100 && obj.color[1] === 50 && obj.color[2] === 10).toBeTruthy();
  expect(obj.borderWidth).toBe(20);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 150 && obj.borderColor[1] === 10 && obj.borderColor[2] === 10).toBeTruthy();
  expect(obj.borderRadius).toBe(30);
  expect(obj.boxShadowOffsetX).toBe(10);
  expect(obj.boxShadowOffsetY).toBe(10);
  expect(obj.boxShadowBlur).toBe(4);
  expect(obj.boxShadowSpread).toBe(10);
  expect(obj.boxShadowColor[0] === 10 && obj.boxShadowColor[1] === 30 && obj.boxShadowColor[2] === 80).toBeTruthy();
  expect(obj.opacity).toBe(0.5);
  expect(obj.zIndex).toBe(200);
});

test('draw() should assign a css test string to the style property.', () => {
  var obj;

  Burner.System.Classes = {
    Oscillator: Oscillator
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Oscillator'); // add your new object to the system
  });

  Burner.System._stepForward();

  expect(obj.el.style.width).toBe('20px');
  expect(obj.el.style.height).toBe('20px');
  expect(obj.el.style.backgroundColor).toBe('rgb(200, 100, 0)');
  expect(obj.el.style.borderTopWidth).toBe('0px');
  expect(obj.el.style.borderRightWidth).toBe('0px');
  expect(obj.el.style.borderBottomWidth).toBe('0px');
  expect(obj.el.style.borderLeftWidth).toBe('0px');
  expect(obj.el.style.borderTopStyle).toBe('solid');
  expect(obj.el.style.borderRightStyle).toBe('solid');
  expect(obj.el.style.borderBottomStyle).toBe('solid');
  expect(obj.el.style.borderLeftStyle).toBe('solid');
  expect(obj.el.style.borderTopColor).toBe('rgb(255, 150, 50)');
  expect(obj.el.style.borderRightColor).toBe('rgb(255, 150, 50)');
  expect(obj.el.style.borderBottomColor).toBe('rgb(255, 150, 50)');
  expect(obj.el.style.borderLeftColor).toBe('rgb(255, 150, 50)');
  // jsdom does not expand the border-radius shorthand into longhand
  // properties, so assert on the shorthand.
  expect(obj.el.style.borderRadius.search('100%')).not.toBe(-1);
  expect(obj.el.style.boxShadow.search('0px 0px 0px 0px')).not.toBe(-1);
  expect(obj.el.style.opacity).toBe('0.75');
  expect(obj.el.style.zIndex).toBe('1');
});

test('step() should update oscillator location.', () => {
  var obj;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Oscillator', {
      isStatic: true,
      isPressed: false,
      initialLocation: new Burner.Vector(100, 100)
    });
  });

  Burner.System._stepForward();

  expect(parseFloat(obj.location.x.toFixed(2))).toBe(100);
  expect(parseFloat(obj.location.y.toFixed(2))).toBe(100);

  //

  resetSystem();

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Oscillator', {
      initialLocation: new Burner.Vector(100, 100),
      pointToDirection: true,
      life: 99,
      lifespan: 100
    });
  });

  Burner.System._stepForward();

  expect(parseFloat(obj.location.x.toFixed(2))).toBe(279.99);
  expect(parseFloat(obj.location.y.toFixed(2))).toBe(100);
  expect(parseFloat(obj.aVelocity.x.toFixed(2))).toBe(0.01);
  expect(parseFloat(obj.aVelocity.y.toFixed(2))).toBe(0);
  expect(parseFloat(obj.angle.toFixed(2))).toBe(19.65);
  expect(obj.life).toBe(100);

  Burner.System._stepForward();

  expect(Burner.System._records.length).toBe(1);

  //

  resetSystem();

  var parent;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    parent = this.add('Item', {
      location: new Burner.Vector(50, 50)
    });
    obj = this.add('Oscillator', {
      parent: parent
    });
  });

  Burner.System._stepForward();

  expect(parseFloat(obj.location.x.toFixed(2))).toBe(229.99);
  expect(parseFloat(obj.location.y.toFixed(2))).toBe(50);
});

test('step() should update oscillator location via perlin noise.', () => {
  SimplexNoise.config({
    random: function() {
      return 0.1;
    }
  });

  var obj;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Oscillator', {
      perlin: true,
      perlinOffsetX: 10000,
      perlinOffsetY: 10000
    });
  });

  Burner.System._stepForward();

  expect(parseFloat(obj.location.x.toFixed(2))).toBe(379.92);
  expect(parseFloat(obj.location.y.toFixed(2))).toBe(153.94);
});
