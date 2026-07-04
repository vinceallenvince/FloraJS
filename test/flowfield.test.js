import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import FlowField from '../src/flowfield';

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

test('load FlowField.', () => {
  expect(FlowField).toBeTruthy();
});

test('new FlowField() should have default properties.', () => {
  Burner.System.Classes = {
    FlowField: FlowField
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new FlowField();
    obj.init(world);
  });

  expect(obj.name).not.toBe('FlowField');
  expect(obj.resolution).toBe(50);
  expect(obj.perlinSpeed).toBe(0.01);
  expect(obj.perlinTime).toBe(100);
  expect(obj.field).toBe(null);
  expect(obj.createMarkers).toBe(false);
  expect(obj.world instanceof Burner.World).toBeTruthy();
});

test('new FlowField() should have custom properties.', () => {
  Burner.System.Classes = {
    FlowField: FlowField
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('FlowField', {
      resolution: 100,
      perlinSpeed: 1,
      perlinTime: 1000,
      field: {x: 10},
      createMarkers: true
    });
  });

  expect(obj.resolution).toBe(100);
  expect(obj.perlinSpeed).toBe(1);
  expect(obj.perlinTime).toBe(1000);
  expect(obj.field.x).toBe(10);
  expect(obj.createMarkers).toBe(true);
});

test('build() should build a grid of columns and rows.', () => {
  Burner.System.Classes = {
    FlowField: FlowField
  };

  var world;

  Burner.System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('FlowField', {
      createMarkers: true
    });
  });

  obj.build();

  var cols = Math.ceil(obj.world.width / parseFloat(obj.resolution));
  var rows = Math.ceil(obj.world.height / parseFloat(obj.resolution));

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      expect(obj.field[i][j].x >= -1 && obj.field[i][j].x <= 1 && obj.field[i][j].y >= -1 && obj.field[i][j].y <= 1).toBeTruthy();
    }
  }

  expect(world.el.querySelectorAll('.flowFieldMarker').length).toBe(cols * rows);
});
