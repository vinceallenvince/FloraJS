import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Attractor from '../src/attractor';

let obj;

beforeEach(() => {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
});

test('load Attractor.', () => {
  expect(Attractor).toBeTruthy();
});

test('new Attractor() should have default properties.', () => {
  Burner.System.Classes = {
    Attractor: Attractor
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Attractor();
    obj.init(world);
  });

  expect(obj.name).not.toBe('Attractor');
  expect(obj.G).toBe(10);
  expect(obj.mass).toBe(1000);
  expect(obj.isStatic).toBe(true);
  expect(obj.width).toBe(100);
  expect(obj.height).toBe(100);
  expect(obj.color[0] === 92 && obj.color[1] === 187 && obj.color[2] === 0).toBeTruthy();
  expect(obj.borderWidth).toBe(obj.width / 4);
  expect(obj.borderStyle).toBe('double');
  expect(obj.borderColor[0] === 224 && obj.borderColor[1] === 228 && obj.borderColor[2] === 204).toBeTruthy();
  expect(obj.borderRadius).toBe(100);
  expect(obj.boxShadowSpread).toBe(obj.width / 4);
  expect(obj.boxShadowColor[0] === 64 && obj.boxShadowColor[1] === 129 && obj.boxShadowColor[2] === 0).toBeTruthy();
  expect(obj.opacity).toBe(0.75);
  expect(obj.zIndex).toBe(1);
});

test('new Attractor() should have custom properties.', () => {
  Burner.System.Classes = {
    Attractor: Attractor
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Attractor', {
      G: 20,
      mass: 3000,
      isStatic: false,
      width: 10,
      height: 10,
      color: [10, 20, 30],
      borderWidth: 2,
      borderStyle: 'dotted',
      borderColor: [30, 20, 10],
      borderRadius: 20,
      boxShadowSpread: 2,
      boxShadowColor: [100, 110, 120],
      opacity: 0.25,
      zIndex: 20
    });
  });

  expect(obj.G).toBe(20);
  expect(obj.isStatic).toBe(false);
  expect(obj.mass).toBe(3000);
  expect(obj.width).toBe(10);
  expect(obj.height).toBe(10);
  expect(obj.color[0] === 10 && obj.color[1] === 20 && obj.color[2] === 30).toBeTruthy();
  expect(obj.borderWidth).toBe(2);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 30 && obj.borderColor[1] === 20 && obj.borderColor[2] === 10).toBeTruthy();
  expect(obj.borderRadius).toBe(20);
  expect(obj.boxShadowSpread).toBe(2);
  expect(obj.boxShadowColor[0] === 100 && obj.boxShadowColor[1] === 110 && obj.boxShadowColor[2] === 120).toBeTruthy();
  expect(obj.opacity).toBe(0.25);
  expect(obj.zIndex).toBe(20);
});

test('draw() should assign a css text string to the style property.', () => {
  var obj;

  Burner.System.Classes = {
    Attractor: Attractor
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Attractor'); // add your new object to the system
    obj.draw();
  });

  expect(obj.el.style.width).toBe('100px');
  expect(obj.el.style.height).toBe('100px');
  expect(obj.el.style.backgroundColor).toBe('rgb(92, 187, 0)');
  expect(obj.el.style.borderTopWidth).toBe('25px');
  expect(obj.el.style.borderRightWidth).toBe('25px');
  expect(obj.el.style.borderBottomWidth).toBe('25px');
  expect(obj.el.style.borderLeftWidth).toBe('25px');
  expect(obj.el.style.borderTopStyle).toBe('double');
  expect(obj.el.style.borderRightStyle).toBe('double');
  expect(obj.el.style.borderBottomStyle).toBe('double');
  expect(obj.el.style.borderLeftStyle).toBe('double');
  expect(obj.el.style.borderTopColor).toBe('rgb(224, 228, 204)');
  expect(obj.el.style.borderRightColor).toBe('rgb(224, 228, 204)');
  expect(obj.el.style.borderBottomColor).toBe('rgb(224, 228, 204)');
  expect(obj.el.style.borderLeftColor).toBe('rgb(224, 228, 204)');
  // jsdom does not expand the border-radius shorthand into longhand
  // properties, so assert on the shorthand.
  expect(obj.el.style.borderRadius.search('100%')).not.toBe(-1);
  expect(obj.el.style.boxShadow.search('0px 0px 0px 25px')).not.toBe(-1);
  expect(obj.el.style.opacity).toBe('0.75');
  expect(obj.el.style.zIndex).toBe('1');
});

test('attract() should return an attraction force.', () => {
  var obj;

  Burner.System.Classes = {
    Attractor: Attractor
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Attractor', {
      location: new Burner.Vector(100, 100)
    });
    var item = this.add('Item', {
      location: new Burner.Vector(10, 10)
    });
    this.add('Attractor');
    var force = obj.attract(item);

    expect(parseFloat(force.x.toPrecision(3))).toBe(4.36);
    expect(parseFloat(force.y.toPrecision(3))).toBe(4.36);
  });
});
