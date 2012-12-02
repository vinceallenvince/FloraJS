var interfaceCheck = exports.Interface;

describe("A new Attractor", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Attractor();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.G).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Attractor');
  });
});


describe("A new BorderPalette", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.BorderPalette();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(obj._borders)).toEqual('array');
    expect(obj.id).toEqual(0);
    expect(obj.name).toEqual('BorderPalette');
  });

  it("should have an addBorder() method that pushed border styles (strings) on to a borders property.", function() {
    expect(interfaceCheck.getDataType(obj.addBorder)).toEqual('function');

    obj.addBorder({
      min: 2,
      max: 8,
      style: 'dotted'
    });

    expect(obj._borders.length).toBeGreaterThan(1);
    expect(obj._borders.length).toBeLessThan(9);
    expect(interfaceCheck.getDataType(obj._borders[0])).toEqual('string');
  });

  it("should have have a method that returns a string representing a border from the borders property", function() {
    expect(interfaceCheck.getDataType(obj.getBorder)).toEqual('function');

    obj.addBorder({
      min: 2,
      max: 8,
      style: 'dotted'
    });

    var border = obj.getBorder();

    expect(interfaceCheck.getDataType(border)).toEqual('string');
  });
});

describe("A new Camera", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Camera();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.location).toEqual('object');
    expect(obj.name).toEqual('Camera');
  });
});

describe("A new Caption", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Caption();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.position).toEqual('string');
    expect(typeof obj.text).toEqual('string');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj._el).toEqual('object');
    expect(obj.name).toEqual('Caption');
  });
});

describe("A new Cold", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Cold();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Cold');
  });
});

describe("A new ColorPalette", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.ColorPalette();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(obj._gradients)).toEqual('array');
    expect(interfaceCheck.getDataType(obj._colors)).toEqual('array');
    expect(obj.id).toEqual(0);
    expect(obj.name).toEqual('ColorPalette');
  });

  it("should have a createGradient() method that pushes an array of color arrays on to a gradients property.", function() {

    expect(interfaceCheck.getDataType(obj.createGradient)).toEqual('function');

    obj.createGradient({
      startColor: [255, 0, 0],
      endColor: [0, 0, 0],
      totalColors: 255
    });

    expect(obj._gradients.length).toEqual(1);
    expect(interfaceCheck.getDataType(obj._gradients[0])).toEqual('array');
    expect(interfaceCheck.getDataType(obj._gradients[0][0][0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj._gradients[0][0][1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj._gradients[0][0][2])).toEqual('number');
  });

  it("should have an addColor() method that pushes color arrays on to a colors property.", function() {
    expect(interfaceCheck.getDataType(obj.addColor)).toEqual('function');

    obj.addColor({
      min: 3,
      max: 8,
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    expect(obj._colors.length).toBeGreaterThan(2);
    expect(obj._colors.length).toBeLessThan(9);
    expect(interfaceCheck.getDataType(obj._colors[0])).toEqual('array');
    expect(interfaceCheck.getDataType(obj._colors[0][0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj._colors[0][1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj._colors[0][2])).toEqual('number');
  });

  it("should have have a method that returns an array of 3 numeric values representing a color value", function() {
    expect(interfaceCheck.getDataType(obj.getColor)).toEqual('function');

    obj.addColor({
      min: 3,
      max: 8,
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    var color = obj.getColor();

    expect(interfaceCheck.getDataType(color)).toEqual('array');
    expect(interfaceCheck.getDataType(color[0])).toEqual('number');
    expect(interfaceCheck.getDataType(color[1])).toEqual('number');
    expect(interfaceCheck.getDataType(color[2])).toEqual('number');
  });
});

describe("A new ColorTable", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.ColorTable();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(obj.name).toEqual('ColorTable');
  });

  it("should have a method that adds an object representing a color range to a 'colors' property.", function() {
    expect(interfaceCheck.getDataType(obj.addColor)).toEqual('function');

    obj.addColor({
      name: 'heat',
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    expect(interfaceCheck.getDataType(obj)).toEqual('object');
    expect(interfaceCheck.getDataType(obj.heat)).toEqual('object');
    expect(interfaceCheck.getDataType(obj.heat.startColor)).toEqual('array');
    expect(interfaceCheck.getDataType(obj.heat.startColor[0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.startColor[1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.startColor[2])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.endColor)).toEqual('array');
    expect(interfaceCheck.getDataType(obj.heat.endColor[0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.endColor[1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.endColor[2])).toEqual('number');
  });

  it("should have a method that accepts a name and range position and returns an array representing a single color.", function() {
    expect(interfaceCheck.getDataType(obj.getColor)).toEqual('function');

    obj.addColor({
      name: 'heat',
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    c = obj.getColor('heat');
    expect(interfaceCheck.getDataType(c)).toEqual('object');

    c = obj.getColor('heat', true, true);
    expect(interfaceCheck.getDataType(c)).toEqual('object');

    c = obj.getColor('heat', true);
    expect(interfaceCheck.getDataType(c)).toEqual('array');

    c = obj.getColor('heat', false, true);
    expect(interfaceCheck.getDataType(c)).toEqual('array');

  });
});

describe("A new Connector", function() {

  var system, obj, walkerA, walkerB;

  beforeEach(function() {
    Flora.System.start(function() {
      walkerA = new Flora.Walker();
      walkerB = new Flora.Walker();
      obj = new exports.Connector(walkerA, walkerB, {opacity: 0.9, zIndex: 10});
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.color).toEqual('string');
    expect(typeof obj.zIndex).toEqual('number');
    expect(obj.zIndex).toEqual(10);
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.opacity).toEqual(0.9);
    expect(typeof obj.parentA).toEqual('object');
    expect(typeof obj.parentB).toEqual('object');
    expect(obj.name).toEqual('Connector');
  });
});

describe("A new ElementList", function() {

  var system;

  beforeEach(function() {
    Flora.System.start(function() {});
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(exports.elementList._records)).toEqual('array');
  });
  it("all() should return the 'records' array.", function() {
    expect(interfaceCheck.getDataType(exports.elementList.all())).toEqual('array');
  });
  it("count() should return the total number of elements.", function() {
    expect(exports.elementList.count()).toEqual(1);
  });
  it("getElement() should receive an id and return the corresponding element.", function() {

      var check = true,
          point = new exports.Point(),
          obj = exports.elementList.getElement(point.id);

      expect(typeof obj).toEqual('object');
  });
  it("getAllByName() should return an array of records with the same 'name' property.", function() {

    var i, max, check = null,
        point = new exports.Point(),
        arr;

    arr = exports.elementList.getAllByName('Point');

    expect(interfaceCheck.getDataType(arr)).toEqual('array');

    for (i = 0, max = arr.length; i < max; i++) {
      if (arr[i].name === 'Point') {
        check = true;
      } else {
        check = false;
      }
    }
    expect(check).toEqual(true);
  });
  it("getAllByAttribute() should return an array of records with a property matching 'attr'. If 'val' is provided, 'attr' should equal 'val'.", function() {

    var i, max, check = null,
        point1 = new exports.Point({
          hello: 'hello'
        }),
        agent = new exports.Agent({
          hello: 'goodbye'
        }),
        point2 = new exports.Point({
          color: 'blue'
        }),
        arr, attr = "hello";

    arr = exports.elementList.getAllByAttribute(attr);

    expect(interfaceCheck.getDataType(arr)).toEqual('array');
    expect(arr.length).toEqual(2);

    for (i = 0, max = arr.length; i < max; i++) {
      if (arr[i][attr]) {
        check = true;
      } else {
        check = false;
        break;
      }
    }
    expect(check).toEqual(true);

    arr = exports.elementList.getAllByAttribute(attr, 'hello');
    expect(interfaceCheck.getDataType(arr)).toEqual('array');
    expect(arr.length).toEqual(1);

  });
  it("destroyElement() should receive an id and remove the corresponding element " +
      "from elementList.records and the element's world.", function() {

      var check = true,
          records = exports.elementList.all(),
          point = new exports.Point();

      exports.elementList.destroyElement(point.id);

      for (i = 0, max = records.length; i < max; i += 1) {
        if (records[i].id === point.id) {
          check = false;
        }
      }
      expect(check).toEqual(true);
  });
  it("destroyAll() should remove all elements from their world and reset " +
      "the 'records' array.", function() {

      var i, check = true, point;

      for (i = 0; i < 100; i += 1) {
        point = new exports.Point();
      }

      exports.elementList.destroyAll();
      expect(exports.elementList.all().length).toEqual(0);
  });
  it("updatePropsByName() should update the properties of elements created " +
      "from the same constructor.", function() {

      var i, check = true, point;

      for (i = 0; i < 100; i += 1) {
        point = new exports.Point();
      }

      exports.elementList.updatePropsByName('point', {
        color: [0, 0, 0],
        scale: 2
      });

      for (i = 0, max = exports.elementList.all().length; i < max; i += 1) {
        if (exports.elementList.all()[i].name === 'point' &&
            (!exports.elementList.all()[i].color || exports.elementList.all()[i].scale !== 2)) {
          check = false;
        }
      }
      expect(check).toEqual(true);
  });
  // destroyByWorld
});

describe("A new FeatureDetector", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.FeatureDetector();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(obj.name).toEqual('FeatureDetector');
  });
  it("should have a method detect() that returns true if feature is detected, false if not.", function() {
    expect(interfaceCheck.getDataType(obj.detect('csstransforms'))).toEqual('boolean');
    expect(interfaceCheck.getDataType(obj.detect('csstransforms3d'))).toEqual('boolean');
    expect(interfaceCheck.getDataType(obj.detect('touch'))).toEqual('boolean');
  });
});

describe("A new FlowField", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.FlowField();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.resolution).toEqual('number');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');
    expect(typeof obj.createMarkers).toEqual('boolean');
    expect(obj.name).toEqual('FlowField');
  });
});

describe("A new FlowFieldMarker", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.FlowFieldMarker({
        location: {x: 0, y: 0},
        scale: 1,
        angle: 90,
        opacity: 0.75,
        width: 100,
        height: 100,
        colorMode: 'rgb',
        color: [0, 0, 0]
      });
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should return a DOM element.", function() {
    expect(obj.className).toEqual('flowFieldMarker floraElement');
    expect(obj.style.width).toEqual('100px');
    expect(obj.style.height).toEqual('100px');
    expect(typeof obj).toEqual('object');
  });
});

describe("A new Food", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Food();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Food');
  });
});

describe("A new Heat", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Heat();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Heat');
  });
});

describe("A new InputMenu", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.InputMenu();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.position).toEqual('string');
    expect(typeof obj.text).toEqual('string');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj._el).toEqual('object');
    expect(obj.name).toEqual('InputMenu');
  });
});

describe("The Interface", function() {

  var interfaceCheck = exports.Interface,
      requiredOptions,
      options;

  beforeEach(function() {
    requiredOptions = {
      age: 'number',
      name: 'string',
      foods: 'array',
      grades: 'object'
    };
  });

  it("should check that passsed options match required options.", function() {
    options = {
      age: 100,
      name: 'Joey',
      foods: ['ham', 'cheese', 'milk'],
      grades: {
        english: 90,
        math: 80
      }
    };
    expect(interfaceCheck.checkRequiredParams(options, requiredOptions)).toEqual(true);
    options = {
      age: '100',
      name: 'Joey',
      foods: ['ham', 'cheese', 'milk'],
      grades: {
        english: 90,
        math: 80
      }
    };
    expect(interfaceCheck.checkRequiredParams(options, requiredOptions)).toEqual(false);
  });
  it("should correctly check data types.", function() {
    expect(interfaceCheck.getDataType('100')).toEqual('string');
    expect(interfaceCheck.getDataType(100)).toEqual('number');
    expect(interfaceCheck.getDataType([100, '100'])).toEqual('array');
    expect(interfaceCheck.getDataType({100: 100})).toEqual('object');
  });
});

describe("A new Light", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Light();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Light');
  });
});

describe("A new Liquid", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Liquid();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.c).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Liquid');
  });
});

describe("A new Agent", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Agent();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.className).toEqual('string');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.maxSpeed).toEqual('number');
    expect(typeof obj.minSpeed).toEqual('number');
    expect(typeof obj.scale).toEqual('number');
    expect(typeof obj.angle).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.colorMode).toEqual('string');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.pointToDirection).toEqual('boolean');
    expect(typeof obj.followMouse).toEqual('boolean');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.checkEdges).toEqual('boolean');
    expect(typeof obj.wrapEdges).toEqual('boolean');
    expect(typeof obj.avoidEdges).toEqual('boolean');
    expect(typeof obj.avoidEdgesStrength).toEqual('number');
    expect(typeof obj.bounciness).toEqual('number');
    expect(typeof obj.maxSteeringForce).toEqual('number');
    expect(typeof obj.flocking).toEqual('boolean');
    expect(typeof obj.desiredSeparation).toEqual('number');
    expect(typeof obj.separateStrength).toEqual('number');
    expect(typeof obj.alignStrength).toEqual('number');
    expect(interfaceCheck.getDataType(obj.sensors)).toEqual('array');
    expect(typeof obj.flowField).toEqual('object');
    expect(typeof obj.acceleration).toEqual('object');
    expect(typeof obj.velocity).toEqual('object');
    expect(typeof obj.location).toEqual('object');
    expect(typeof obj.controlCamera).toEqual('boolean');
    expect(obj.name).toEqual('Agent');
  });
});

describe("A new Element", function() {

  var system, obj, agent;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Element({
        hello: 'hello'
      });
      agent = new exports.Agent();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should accept all properties passed to the constructor.", function() {
    expect(obj.hello).toEqual('hello');
    expect(obj.name).toEqual('Element');
  });
  it("Element should should have a static method to check if mouse is inside World.", function() {
    exports.mouse.loc.x = 1;
    exports.mouse.loc.y = 1;
    expect(exports.Element.mouseIsInsideWorld(agent.world)).toEqual(true);
  });
});

describe("A new Oscillator", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Oscillator({
        initialLocation: new exports.Vector()
      });
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.initialLocation).toEqual('object');
    expect(typeof obj.lastLocation).toEqual('object');
    expect(typeof obj.amplitude).toEqual('object');
    expect(typeof obj.acceleration).toEqual('object');
    expect(typeof obj.aVelocity).toEqual('object');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.isPerlin).toEqual('boolean');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');
    expect(typeof obj.perlinAccelLow).toEqual('number');
    expect(typeof obj.perlinAccelHigh).toEqual('number');
    expect(typeof obj.perlinOffsetX).toEqual('number');
    expect(typeof obj.perlinOffsetY).toEqual('number');
    expect(obj.name).toEqual('Oscillator');
  });
});

describe("A new Oxygen", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Oxygen();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Oxygen');
  });
});

describe("A new Particle", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Particle();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.borderRadius).toEqual('string');
    expect(obj.name).toEqual('Particle');
  });
});

describe("A new ParticleSystem", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.ParticleSystem();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.beforeStep).toEqual('function');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.burst).toEqual('number');
    expect(typeof obj.particle).toEqual('function');
    expect(obj.name).toEqual('ParticleSystem');
  });
});

describe("A new Point", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Point();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.offsetAngle).toEqual('number');
    expect(typeof obj.length).toEqual('number');
    expect(obj.name).toEqual('Point');
  });
});

describe("A new Predator", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Predator();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Predator');
  });
});

describe("A new Repeller", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Repeller();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.G).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.name).toEqual('Repeller');
  });
});

describe("A new Sensor", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Sensor();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.type).toEqual('string');
    expect(typeof obj.behavior).toEqual('string');
    expect(typeof obj.sensitivity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.offsetDistance).toEqual('number');
    expect(typeof obj.offsetAngle).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.target).toEqual('object');
    expect(typeof obj.activated).toEqual('boolean');
    expect(obj.name).toEqual('Sensor');
  });
});

describe("SimplexNoise", function() {

  var obj, n1, n2;

  beforeEach(function() {
    obj = exports.SimplexNoise;
    n1 = exports.SimplexNoise.noise(0.001, 0.002);
    n2 = exports.SimplexNoise.noise(0.002, 0.002);
  });

  afterEach(function() {
    obj = null;
  });

  it("should create a number.", function() {
    expect(typeof n1).toEqual('number');
  });

  it("should create different numbers as input parameters change.", function() {
    expect(n1).toNotEqual(n2);
  });
});

describe("A new StatsDisplay", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.StatsDisplay();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(obj._fps).toEqual(0);
    expect(typeof obj._time).toEqual('number');
    expect(typeof obj._timeLastFrame).toEqual('number');
    expect(typeof obj._timeLastSecond).toEqual('number');
    expect(typeof obj._frameCount).toEqual('number');
    expect(typeof obj._el).toEqual('object');
    expect(obj.name).toEqual('StatsDisplay');
  });
  it("update() should calculate the difference in ms between time now and last call to update().", function() {

  });
  it("getFPS() should return the current FPS.", function() {
    expect(typeof obj.getFPS()).toEqual('number');
  });
});


describe("A new Universe", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Universe();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(obj.isPlaying)).toEqual('boolean');
    expect(interfaceCheck.getDataType(obj.zSorted)).toEqual('boolean');
    expect(interfaceCheck.getDataType(obj.showStats)).toEqual('boolean');
    expect(interfaceCheck.getDataType(obj._records)).toEqual('array');
    expect(obj.name).toEqual('Universe');
  });
  it("addWorld() should add a new World to the 'records' array.", function() {
    obj.addWorld();
    expect(obj.all().length).toEqual(1);
    expect(obj.all()[obj.all().length - 1].name).toEqual('World');
  });
  it("first() should return the first record in the 'records' array.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    expect(obj.all().length).toEqual(3);
    expect(obj.first()).toEqual(obj.all()[0]);
  });
  it("last() should return the last record in the 'records' array.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    expect(obj.all().length).toEqual(3);
    expect(obj.last()).toEqual(obj.all()[obj.all().length - 1]);
  });
  it("count() should return the total number of worlds.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    expect(obj.count()).toEqual(4);
  });
  it("all() should return the 'records' array.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    expect(obj.all().length).toEqual(3);
  });
  it("update() should update the specified world's properties", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    obj.update({
      'hello': 'hello'
    },
    obj.last());
    expect(obj.last().hello).toEqual('hello');
  });
  it("getWorldById() should return the world with the passed id", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    var id = obj.last().id;
    expect(obj.getWorldById(id).id).toEqual(id);
  });
  it("destroyWorld() should remove the world with the passed id from 'records' and remove the associated DOM element from the DOM.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    var id = obj.last().id;
    obj.destroyWorld(id);
    expect(obj.getWorldById(id)).toEqual(null);
  });
  it("destroyAll() should remove all worlds from the DOM and reset the records array.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    obj.destroyAll();
    expect(obj.count()).toEqual(0);
    expect(obj.all().length).toEqual(0);
  });
  it("createStats() should create a StatsDisplay instance.", function() {

  });
  it("destroyStats() should destroy the StatsDisplay instance and remove any associated DOM elements.", function() {

  });
});

describe("Utils", function() {

  var utils = exports.Utils;

  it("map() should re-map a number from one range to another.", function() {
    expect(utils.map(1, 0, 10, 0, 100)).toEqual(10);
  });
  it("getRandomNumber() should return a random number within a range.", function() {
    expect(typeof utils.getRandomNumber(1, 100)).toEqual('number');
    expect(utils.getRandomNumber(1, 100)).toBeGreaterThan(0);
    expect(utils.getRandomNumber(1, 100)).toBeLessThan(101);
  });
  it("getRandomNumber() should return a float when passing 'true' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, true) % 1).toNotEqual(0);
  });
  it("getRandomNumber() should return an integer when passing 'false' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, false) % 1).toEqual(0);
  });
  it("degreesToRadians() should converts degrees to radians.", function() {
    expect(utils.degreesToRadians(180)).toEqual(Math.PI);
    expect(utils.degreesToRadians(90)).toEqual(Math.PI/2);
  });
  it("radiansToDegrees() should converts radians to degrees.", function() {
    expect(utils.radiansToDegrees(Math.PI)).toEqual(180);
    expect(utils.radiansToDegrees(Math.PI/2)).toEqual(90);
  });
  it("constrain() should constrain a value within a range.", function() {
    expect(utils.constrain(1000, 10, 100)).toEqual(100);
    expect(utils.constrain(-1000, 10, 100)).toEqual(10);
  });
  it("clone() should return a new object with all properties and methods of " +
    "the old object copied to the new object's prototype.", function() {
    var newObj = {hello: 'hello', sayHi: function() {return 'hi';}},
        clonedObj = utils.clone(newObj);
    expect(clonedObj.hello).toEqual('hello');
    expect(clonedObj.sayHi()).toEqual('hi');
  });
  it("getWindowSize() should return the current window width and height", function() {
    expect(typeof utils.getWindowSize()).toEqual('object');
    expect(typeof utils.getWindowSize().width).toEqual('number');
    expect(typeof utils.getWindowSize().height).toEqual('number');

  });
  it("getCSSText() should return a text string.", function() {
    var obj = new exports.Element({
      location: {x: 100, y: 100},
      scale: 1,
      angle: 90,
      opacity: 0.75,
      width: 100,
      height: 100,
      colorMode: 'rgb',
      color: {r: 0, g: 0, b: 0},
      zIndex: 1,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: [255, 69, 0],
      borderRadius: '100%',
      boxShadow: '1px 1px 0 0 #000'
    });

    css = utils.getCSSText({
      x: obj.location.x - obj.width/2,
      y: obj.location.y - obj.height/2,
      s: obj.scale,
      a: obj.angle,
      o: obj.opacity,
      w: obj.width,
      h: obj.height,
      cm: obj.colorMode,
      color: obj.color,
      z: obj.zIndex,
      borderWidth: obj.borderWidth,
      borderStyle: obj.borderStyle,
      borderColor: obj.borderColor,
      borderRadius: obj.borderRadius,
      boxShadow: obj.boxShadow
    });
    expect(typeof css).toEqual('string');
    expect(css.search('border-width')).toNotEqual(-1);
  });
});

describe("Vector", function() {

  var system, obj, objA, objB;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Vector(22, 10);
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should create vectors.", function() {
    expect(obj.x).toEqual(22);
    expect(obj.y).toEqual(10);
  });
  it('VectorAdd() should add two vectors.', function() {
    objA = new exports.Vector(1, 1);
    expect(exports.Vector.VectorAdd(obj, objA).x).toEqual(23);
    expect(exports.Vector.VectorAdd(obj, objA).y).toEqual(11);
  });
  it('add() should add a vector.', function() {
    obj.add(new exports.Vector(1, 1));
    expect(obj.x).toEqual(23);
    expect(obj.y).toEqual(11);
  });
  it('VectorSub() should subtract two vectors.', function() {
    objA = new exports.Vector(1, 1);
    expect(exports.Vector.VectorSub(obj, objA).x).toEqual(21);
    expect(exports.Vector.VectorSub(obj, objA).y).toEqual(9);
  });
  it('sub() should subtract a vector.', function() {
    obj.sub(new exports.Vector(1, 1));
    expect(obj.x).toEqual(21);
    expect(obj.y).toEqual(9);
  });
  it('VectorMult() should multiply a vector by a scalar value.', function() {
    expect(exports.Vector.VectorMult(obj, 2).x).toEqual(44);
    expect(exports.Vector.VectorMult(obj, 2).y).toEqual(20);
  });
  it('mult() should multiply a vector.', function() {
    obj.mult(2);
    expect(obj.x).toEqual(44);
    expect(obj.y).toEqual(20);
  });
  it('VectorDiv() should divide a vector by a scalar value.', function() {
    expect(exports.Vector.VectorDiv(obj, 2).x).toEqual(11);
    expect(exports.Vector.VectorDiv(obj, 2).y).toEqual(5);
  });
  it('div() should divide a vector.', function() {
    obj.div(2);
    expect(obj.x).toEqual(11);
    expect(obj.y).toEqual(5);
  });
  it('mag() should calculate the magnitude of a vector.', function() {
    obj = new exports.Vector(10, 10);
    expect(obj.mag()).toEqual(14.142135623730951);
  });
  it('limit() should limit the magnitude of a vector.', function() {
    obj = new exports.Vector(10, 10);
    expect(obj.limit(5).mag()).toEqual(5);
  });
  it('normalize() should divide a vector by its magnitude to reduce its magnitude to 1.', function() {
    obj = new exports.Vector(3, 4);
    expect(obj.normalize().x).toEqual(0.6);
    expect(obj.normalize().y).toEqual(0.8);
  });
  it('VectorDistance(v1, v2) should return the distance between two vectors.', function() {
    objA = new exports.Vector(50, 100);
    objB = new exports.Vector(100, 100);
    expect(exports.Vector.VectorDistance(objA, objB)).toEqual(50);
  });
  it('distance() should calculate the distance between this vector and a passed vector.', function() {
    obj = new exports.Vector(5, 0);
    expect(obj.distance(new exports.Vector(1, 0))).toEqual(4);
  });
  it('rotate() should rotate a vector using a passed angle in radians.', function() {
    obj = new exports.Vector(10, 0);
    expect(obj.rotate(Math.PI).x).toEqual(-10);
  });
  it('VectorMidPoint(v1, v2) should return the midpoint between two vectors.', function() {
    objA = new exports.Vector(50, 100);
    objB = new exports.Vector(100, 200);
    expect(exports.Vector.VectorMidPoint(objA, objB).x).toEqual(75);
    expect(exports.Vector.VectorMidPoint(objA, objB).y).toEqual(150);
  });
  it('midpoint() should return the midpoint between this vector and a passed vector.', function() {
    objA = new exports.Vector(50, 100);
    objB = new exports.Vector(100, 200);
    expect(objA.midpoint(objB).x).toEqual(75);
    expect(objA.midpoint(objB).y).toEqual(150);
  });
  it('Vector.VectorAngleBetween should return the angle between two Vectors.', function() {
    objA = new exports.Vector(50, 0);
    objB = new exports.Vector(50, 180);
    expect(Math.round(exports.Vector.VectorAngleBetween(objA, objB))).toEqual(1);
  });
});

describe("A new Walker", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.Walker();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.isPerlin).toEqual('boolean');
    expect(typeof obj.remainsOnScreen).toEqual('boolean');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');
    expect(typeof obj.perlinAccelLow).toEqual('number');
    expect(typeof obj.perlinAccelHigh).toEqual('number');
    expect(typeof obj.offsetX).toEqual('number');
    expect(typeof obj.offsetY).toEqual('number');
    expect(typeof obj.isRandom).toEqual('boolean');
    expect(typeof obj.randomRadius).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.maxSpeed).toEqual('number');
    expect(typeof obj.wrapEdges).toEqual('boolean');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(obj.name).toEqual('Walker');
  });
});

describe("A new World", function() {

  var system, obj;

  beforeEach(function() {
    Flora.System.start(function() {
      obj = new exports.World();
    });
  });

  afterEach(function() {
    Flora.System.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.clock).toEqual('number');
    expect(typeof obj.c).toEqual('number');
    expect(typeof obj.gravity).toEqual('object');
    expect(typeof obj.wind).toEqual('object');
    expect(typeof obj.location).toEqual('object');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(obj.name).toEqual('World');
  });

  it("should have a DOM element", function() {
    obj.configure();
    expect(typeof obj.el).toEqual('object');
  });
});