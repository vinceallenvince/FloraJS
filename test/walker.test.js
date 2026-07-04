import { test, expect, beforeEach } from 'vitest';
import { createRequire } from 'node:module';
import Burner from '../src/vendor/burner/main';
import Walker from '../src/walker';

// Load quietriot through Node's CommonJS cache so we get the exact same
// module instance Walker uses internally; an ESM import would create a
// second instance and SimplexNoise.config() would not affect Walker.
const require = createRequire(import.meta.url);
const SimplexNoise = require('../src/vendor/quietriot');

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

test('load Walker.', () => {
  expect(Walker).toBeTruthy();
});

test('new Walker() should have default properties.', () => {
  Burner.System.Classes = {
    Walker: Walker
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Walker();
    obj.init(world);
  });

  expect(obj.name).not.toBe('Walker');
  expect(obj.width).toBe(10);
  expect(obj.height).toBe(10);
  expect(obj.remainsOnScreen).toBe(false);
  expect(obj.maxSpeed).toBe(1);
  expect(obj.perlin).toBe(true);
  expect(obj.perlinSpeed).toBe(0.005);
  expect(obj.perlinTime).toBe(0);
  expect(obj.perlinAccelLow).toBe(-0.075);
  expect(obj.perlinAccelHigh).toBe(0.075);
  expect(typeof obj.perlinOffsetX).toBe('number');
  expect(typeof obj.perlinOffsetY).toBe('number');
  expect(obj.color[0]).toBe(255);
  expect(obj.color[1]).toBe(150);
  expect(obj.color[2]).toBe(50);
  expect(obj.borderWidth).toBe(0);
  expect(obj.borderStyle).toBe('none');
  expect(obj.borderColor[0]).toBe(255);
  expect(obj.borderColor[1]).toBe(255);
  expect(obj.borderColor[2]).toBe(255);
  expect(obj.opacity).toBe(1);
  expect(obj.zIndex).toBe(0);
  expect(obj.borderRadius).toBe(100);
  expect(obj._randomVector.x).toBe(0);
  expect(obj._randomVector.y).toBe(0);
});

test('new Walker() should have custom properties.', () => {
  Burner.System.Classes = {
    Walker: Walker
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Walker', {
      width: 100,
      height: 200,
      remainsOnScreen: true,
      maxSpeed: 10,
      perlin: false,
      perlinSpeed: 0.1,
      perlinTime: 2000,
      perlinAccelLow: -1,
      perlinAccelHigh: 1,
      perlinOffsetX: 200,
      perlinOffsetY: 100,
      color: [5, 10, 200],
      borderWidth: 3,
      borderStyle: 'dotted',
      borderColor: [100, 110, 120],
      borderRadius: 30,
      opacity: 1,
      zIndex: 0
    });
  });

  expect(obj.width).toBe(100);
  expect(obj.height).toBe(200);
  expect(obj.remainsOnScreen).toBe(true);
  expect(obj.maxSpeed).toBe(10);
  expect(obj.perlin).toBe(false);
  expect(obj.perlinSpeed).toBe(0.1);
  expect(obj.perlinTime).toBe(2000);
  expect(obj.perlinAccelLow).toBe(-1);
  expect(obj.perlinAccelHigh).toBe(1);
  expect(obj.perlinOffsetX).toBe(200);
  expect(obj.perlinOffsetY).toBe(100);
  expect(obj.color[0]).toBe(5);
  expect(obj.color[1]).toBe(10);
  expect(obj.color[2]).toBe(200);
  expect(obj.borderWidth).toBe(3);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0]).toBe(100);
  expect(obj.borderColor[1]).toBe(110);
  expect(obj.borderColor[2]).toBe(120);
  expect(obj.borderRadius).toBe(30);
  expect(obj.opacity).toBe(1);
  expect(obj.zIndex).toBe(0);
});

test('draw() should assign a css test string to the style property.', () => {
  var obj;

  Burner.System.Classes = {
    Walker: Walker
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Walker'); // add your new object to the system
  });

  Burner.System._stepForward();

  expect(obj.el.style.width).toBe('10px');
  expect(obj.el.style.height).toBe('10px');
  expect(obj.el.style.backgroundColor).toBe('rgb(255, 150, 50)');
  expect(obj.el.style.borderTopWidth).toBe('0px');
  expect(obj.el.style.borderRightWidth).toBe('0px');
  expect(obj.el.style.borderBottomWidth).toBe('0px');
  expect(obj.el.style.borderLeftWidth).toBe('0px');
  expect(obj.el.style.borderTopStyle).toBe('none');
  expect(obj.el.style.borderRightStyle).toBe('none');
  expect(obj.el.style.borderBottomStyle).toBe('none');
  expect(obj.el.style.borderLeftStyle).toBe('none');
  expect(obj.el.style.borderTopColor).toBe('rgb(255, 255, 255)');
  expect(obj.el.style.borderRightColor).toBe('rgb(255, 255, 255)');
  expect(obj.el.style.borderBottomColor).toBe('rgb(255, 255, 255)');
  expect(obj.el.style.borderLeftColor).toBe('rgb(255, 255, 255)');
  // jsdom does not expand the border-radius shorthand into longhand
  // properties, so assert on the shorthand.
  expect(obj.el.style.borderRadius.search('100%')).not.toBe(-1);
  expect(obj.el.style.opacity).toBe('1');
  expect(obj.el.style.zIndex).toBe('0');
});

test('step() should update oscillator location.', () => {
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
    obj = this.add('Walker', {
      perlin: true,
      perlinOffsetX: 1000,
      perlinOffsetY: 1000,
      remainsOnScreen: false
    });
  });

  Burner.System._stepForward();

  expect(parseFloat(obj.location.x.toFixed(2))).toBe(200.00);
  expect(parseFloat(obj.location.y.toFixed(2))).toBe(150.00);

  //

  beforeTest();

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Walker', {
      perlin: true,
      perlinOffsetX: 1000,
      perlinOffsetY: 1000,
      remainsOnScreen: true
    });
  });

  Burner.System._stepForward();

  expect(parseFloat(obj.location.x.toFixed(2))).toBe(195.65);
  expect(parseFloat(obj.location.y.toFixed(2))).toBe(153.27);

  //

  beforeTest();

  var x, y;

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Walker', {
      perlin: false
    });
  });

  x = obj.location.x;
  y = obj.location.y;

  Burner.System._stepForward();

  expect(obj.location.x !== x).toBeTruthy();
  expect(obj.location.y !== y).toBeTruthy();
});
