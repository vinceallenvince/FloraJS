import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import FlowFieldMarker from '../src/flowfieldmarker';

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

test('load FlowFieldMarker.', () => {
  expect(FlowFieldMarker).toBeTruthy();
});

test('new FlowFieldMarker() should have default properties.', () => {
  Burner.System.Classes = {
    FlowFieldMarker: FlowFieldMarker
  };

  var marker;

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new FlowFieldMarker();
    marker = obj.init({ // create the marker
      location: new Burner.Vector(),
      scale: 1,
      opacity: 0.5,
      width: 50,
      height: 25,
      field: {},
      angle: 30,
      colorMode: 'rgb',
      color: [200, 100, 50],
      borderRadius: 0,
      zIndex: 0
    });
  });

  expect(marker.className).toBe('flowFieldMarker item');
  expect(marker.style.width).toBe('50px');
});

test('new FlowFieldMarker() should throw an error if options are not passed.', () => {
  Burner.System.Classes = {
    FlowFieldMarker: FlowFieldMarker
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new FlowFieldMarker();
    expect(function() {
      obj.init();
    }).toThrow();
  });
});
