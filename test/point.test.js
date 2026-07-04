import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Point from '../src/point';

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

test('load Point.', () => {
  expect(Point).toBeTruthy();
});

test('new Point() should have default properties.', () => {
  Burner.System.Classes = {
    Point: Point
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Point();
    obj.init(world);
  });

  expect(obj.name).not.toBe('Point');
  expect(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200).toBeTruthy();
  expect(obj.borderRadius).toBe(100);
  expect(obj.borderWidth).toBe(2);
  expect(obj.borderStyle).toBe('solid');
  expect(obj.borderColor[0] === 60 && obj.borderColor[1] === 60 && obj.borderColor[2] === 60).toBeTruthy();
  expect(obj.isStatic).toBe(true);
});

test('new Point() should have custom properties.', () => {
  Burner.System.Classes = {
    Point: Point
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Point', {
      color: [10, 10, 10],
      borderRadius: 10,
      borderWidth: 1,
      borderStyle: 'dotted',
      borderColor: [30, 30, 30],
      isStatic: false
    });
  });

  expect(obj.color[0] === 10 && obj.color[1] === 10 && obj.color[2] === 10).toBeTruthy();
  expect(obj.borderRadius).toBe(10);
  expect(obj.borderWidth).toBe(1);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 30 && obj.borderColor[1] === 30 && obj.borderColor[2] === 30).toBeTruthy();
});

test('draw() should assign a css text string to the style property.', () => {
  var obj;

  Burner.System.Classes = {
    Point: Point
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Point');
    obj.draw();
    expect(obj.el.style.width).toBe('10px');
    expect(obj.el.style.height).toBe('10px');
    expect(obj.el.style.backgroundColor).toBe('rgb(200, 200, 200)');
    expect(obj.el.style.borderTopWidth).toBe('2px');
    expect(obj.el.style.borderRightWidth).toBe('2px');
    expect(obj.el.style.borderBottomWidth).toBe('2px');
    expect(obj.el.style.borderLeftWidth).toBe('2px');
    expect(obj.el.style.borderTopStyle).toBe('solid');
    expect(obj.el.style.borderRightStyle).toBe('solid');
    expect(obj.el.style.borderBottomStyle).toBe('solid');
    expect(obj.el.style.borderLeftStyle).toBe('solid');
    expect(obj.el.style.borderTopColor).toBe('rgb(60, 60, 60)');
    expect(obj.el.style.borderRightColor).toBe('rgb(60, 60, 60)');
    expect(obj.el.style.borderBottomColor).toBe('rgb(60, 60, 60)');
    expect(obj.el.style.borderLeftColor).toBe('rgb(60, 60, 60)');
    // jsdom does not expand the border-radius shorthand into longhand
    // properties, so assert on the shorthand.
    expect(obj.el.style.borderRadius.search('100%')).not.toBe(-1);
  });
});
