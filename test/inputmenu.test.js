import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import { createRequire } from 'node:module';

// src/inputmenu.js loads './config' through Vitest's externalized (native
// CommonJS) module cache, while an ESM `import` here would create a second,
// separate instance of the module. Use a native require so the test mutates
// the same config object InputMenu reads from.
const config = createRequire(import.meta.url)('../src/config').config;
import InputMenu from '../src/inputmenu';

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

beforeEach(() => {
  beforeTest();
});

test('load InputMenu.', () => {
  expect(InputMenu).toBeTruthy();
});

test('new InputMenu() should have default properties.', () => {
  var obj = new InputMenu();
  expect(obj.name).toBe('InputMenu');
});

test('init() should initialize with default properties.', () => {
  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new InputMenu();
    obj.init(world);
  });

  expect(obj.world instanceof Burner.World).toBe(true);
  expect(obj.position).toBe('top left');
  expect(obj.opacity).toBe(0.75);
  expect(obj.color[0] === 255 && obj.color[1] === 255 && obj.color[2] === 255).toBeTruthy();
  expect(obj.borderWidth).toBe(0);
  expect(obj.borderStyle).toBe('none');
  expect(obj.borderColor[0] === 204 && obj.borderColor[1] === 204 && obj.borderColor[2] === 204).toBeTruthy();
  expect(obj.colorMode).toBe('rgb');

  //

  beforeTest();

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new InputMenu();
    expect(function() {
      obj.init();
    }).toThrow();
  });

  //

  beforeTest();

  Burner.System.Classes = {
    InputMenu: InputMenu
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('InputMenu');
    obj = this.add('InputMenu');
  });

  expect(document.querySelectorAll('.inputMenu').length).toBe(1);
});

test('init() should initialize with custom properties.', () => {
  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new InputMenu();
    obj.init(world, {
      position: 'bottom center',
      opacity: 0.5,
      color: [200, 200, 200],
      borderWidth: 4,
      borderStyle: 'dotted',
      borderColor: [100, 100, 100]
    });
  });

  expect(obj.position).toBe('bottom center');
  expect(obj.opacity).toBe(0.5);
  expect(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200).toBeTruthy();
  expect(obj.borderWidth).toBe(4);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 100 && obj.borderColor[1] === 100 && obj.borderColor[2] === 100).toBeTruthy();
});

test('init() should append caption element to DOM.', () => {
  config.keyMap = {
    pause: 70,
    resetSystem: 72,
    stats: 73
  };

  Burner.System.Classes = {
    InputMenu: InputMenu
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('InputMenu', {
      text: 'hello goodbye',
      borderColor: 'transparent'
    });
  });

  var inputMenu = document.getElementById('inputMenu');
  expect(inputMenu).toBeTruthy();
  expect(inputMenu.className).toBe('inputMenu inputMenuTop inputMenuLeft ');
  expect(inputMenu.style.opacity).toBe('0.75');
  expect(inputMenu.style.color).toBe('rgb(255, 255, 255)');
  expect(inputMenu.style.borderWidth).toBe('0px');
  expect(inputMenu.style.borderStyle).toBe('none');
  expect(inputMenu.style.borderColor).toBe('transparent');
  expect(inputMenu.style.zIndex).toBe('100');
  expect(inputMenu.firstChild.textContent).toBe('\'f\' = pause | \'h\' = reset | \'i\' = stats');
});

test('remove() should remove caption.', () => {
  Burner.System.Classes = {
    InputMenu: InputMenu
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('InputMenu');
  });

  obj.remove();
  var inputMenu = document.getElementById('inputMenu');
  expect(inputMenu).toBeFalsy();
});
