import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Caption from '../src/caption';

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

test('load Caption.', () => {
  expect(Caption).toBeTruthy();
});

test('new Caption() should have default properties.', () => {
  var obj = new Caption();
  expect(obj.name).toBe('Caption');
});

test('init() should initialize with default properties.', () => {
  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Caption();
    obj.init(world);
  });

  expect(obj.world instanceof Burner.World).toBe(true);
  expect(obj.position).toBe('top left');
  expect(obj.text).toBe('');
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

    obj = new Caption();
    expect(function() {
      obj.init();
    }).toThrow();
  });

  //

  beforeTest();

  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'bye'
    });
    obj = this.add('Caption', {
      text: 'hi'
    });
  });

  var caption = document.getElementById('caption');
  expect(caption.firstChild.textContent).toBe('hi');
});

test('init() should initialize with custom properties.', () => {
  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Caption();
    obj.init(world, {
      position: 'bottom center',
      text: 'hello',
      opacity: 0.5,
      color: [200, 200, 200],
      borderWidth: 4,
      borderStyle: 'dotted',
      borderColor: [100, 100, 100]
    });
  });

  expect(obj.position).toBe('bottom center');
  expect(obj.text).toBe('hello');
  expect(obj.opacity).toBe(0.5);
  expect(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200).toBeTruthy();
  expect(obj.borderWidth).toBe(4);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 100 && obj.borderColor[1] === 100 && obj.borderColor[2] === 100).toBeTruthy();
});

test('init() should append caption element to DOM.', () => {
  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'hello goodbye',
      borderColor: 'transparent'
    });
  });

  var caption = document.getElementById('caption');
  expect(caption).toBeTruthy();
  expect(caption.className).toBe('caption captionTop captionLeft ');
  expect(caption.style.opacity).toBe('0.75');
  expect(caption.style.color).toBe('rgb(255, 255, 255)');
  expect(caption.style.borderWidth).toBe('0px');
  expect(caption.style.borderStyle).toBe('none');
  expect(caption.style.borderColor).toBe('transparent');
  expect(caption.style.zIndex).toBe('100');
  expect(caption.firstChild.textContent).toBe('hello goodbye');
});

test('update() should update caption text.', () => {
  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'red yellow blue',
      borderColor: 'transparent'
    });
  });

  obj.update('green purple cyan');
  var caption = document.getElementById('caption');
  expect(caption.firstChild.textContent).toBe('green purple cyan');
});

test('remove() should remove caption.', () => {
  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'red yellow blue',
      borderColor: 'transparent'
    });
  });

  obj.remove();
  var caption = document.getElementById('caption');
  expect(caption).toBeFalsy();
});
