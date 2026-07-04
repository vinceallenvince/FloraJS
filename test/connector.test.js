import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Connector from '../src/connector';

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

test('load Connector.', () => {
  expect(Connector).toBeTruthy();
});

test('new Connector() should have default properties.', () => {
  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Connector();
    obj.init(world, {
      parentA: {},
      parentB: {}
    });
  });

  expect(obj.name).not.toBe('Connector');
  expect(obj.zIndex).toBe(0);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 150 && obj.borderColor[1] === 150 && obj.borderColor[2] === 150).toBeTruthy();
  expect(obj.borderWidth).toBe(1);
  expect(obj.borderRadius).toBe(0);
  expect(obj.height).toBe(0);
  expect(obj.color).toBe('transparent');
});

test('new Connector() should require options.', () => {
  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    expect(function() {
      obj = new Connector();
      obj.init(world);
    }).toThrow();
  });
});

test('new Connector() should require parentB.', () => {
  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    expect(() => {
      this.add('Connector', {
        parentA: {}
      });
    }).toThrow();
  });
});

test('new Connector() should require parentA.', () => {
  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    expect(() => {
      this.add('Connector', {
        parentB: {}
      });
    }).toThrow();
  });
});

test('step() should update properties.', () => {
  var obj;

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Connector', {
      parentA: {
        location: new Burner.Vector()
      },
      parentB: {
        location: new Burner.Vector(100, 100)
      }
    });
    obj.step();
    expect(obj.angle).toBe(45);
    expect(obj.width).toBe(141);
    expect(obj.location.x).toBe(50);
    expect(obj.location.y).toBe(50);
  });
});

test('draw() should assign a css text string to the style property.', () => {
  var obj;

  Burner.System.Classes = {
    Connector: Connector
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Connector', {
      parentA: {},
      parentB: {}
    });
    obj.draw();
    expect(obj.el.style.width).toBe('10px');
    expect(obj.el.style.height).toBe('0px');
    expect(obj.el.style.borderTopWidth).toBe('1px');
    expect(obj.el.style.borderRightWidth).toBe('1px');
    expect(obj.el.style.borderBottomWidth).toBe('1px');
    expect(obj.el.style.borderLeftWidth).toBe('1px');
    expect(obj.el.style.borderTopStyle).toBe('dotted');
    expect(obj.el.style.borderRightStyle).toBe('dotted');
    expect(obj.el.style.borderBottomStyle).toBe('dotted');
    expect(obj.el.style.borderLeftStyle).toBe('dotted');
    expect(obj.el.style.borderTopColor).toBe('rgb(150, 150, 150)');
    expect(obj.el.style.borderRightColor).toBe('rgb(150, 150, 150)');
    expect(obj.el.style.borderBottomColor).toBe('rgb(150, 150, 150)');
    expect(obj.el.style.borderLeftColor).toBe('rgb(150, 150, 150)');
    // jsdom does not expand the border-radius shorthand into longhand
    // properties, so assert on the shorthand.
    expect(obj.el.style.borderRadius.search('0%')).not.toBe(-1);
  });
});
