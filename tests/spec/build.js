describe("A new Attractor", function() {

  var attractor;

  beforeEach(function() {
    attractor = new exports.Attractor();
  });

  afterEach(function() {
    attractor = null;
  });

  it("should have its required properties.", function() {
    expect(typeof attractor.G).toEqual('number');
    expect(typeof attractor.mass).toEqual('number');
    expect(typeof attractor.isStatic).toEqual('boolean');            
    expect(typeof attractor.width).toEqual('number');
    expect(typeof attractor.height).toEqual('number');
    expect(typeof attractor.color).toEqual('object');
    expect(typeof attractor.opacity).toEqual('number');
  });
});

describe("A new Camera", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Camera();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.location).toEqual('object');
  });
});

describe("A new Cold", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Cold();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');            
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
  });
});

describe("A new Connector", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Connector();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');            
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
  });
});

describe("A new FlowField", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.FlowField();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.resolution).toEqual('number');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');            
    expect(typeof obj.createMarkers).toEqual('boolean');
  });
});

describe("A new FlowFieldMarker", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.FlowField();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.resolution).toEqual('number');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');            
    expect(typeof obj.createMarkers).toEqual('boolean');
  });
});

describe("A new Food", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Food();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');            
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
  });
});

describe("A new Heat", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Heat();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');            
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
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

  var obj;

  beforeEach(function() {
    obj = new exports.Light();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');            
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
  });
});

describe("A new Liquid", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Liquid();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.c).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
  });
});

describe("A new Mover", function() {

  var obj, interfaceCheck = exports.Interface;

  beforeEach(function() {
    obj = new exports.Mover();
  });

  afterEach(function() {
    obj = null;
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
  });
});

describe("A new Obj", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Obj({
      hello: 'hello'
    });
  });

  afterEach(function() {
    obj = null;
  });

  it("should accept all properties passed to the constructor.", function() {
    expect(obj.hello).toEqual('hello');
  });
});

describe("A new Oxygen", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Oxygen();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');            
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
  });
});

describe("A new Particle", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Particle();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');            
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.borderRadius).toEqual('string');
  });
});

describe("A new ParticleSystem", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.ParticleSystem();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.beforeStep).toEqual('function');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.lifespan).toEqual('number');            
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('string'); 
    expect(typeof obj.burst).toEqual('number');
    expect(typeof obj.particle).toEqual('function');           
  });
});

describe("A new Point", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Point();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');                          
  });
});

describe("A new Predator", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Predator();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');            
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');                          
  });
});

describe("PVector", function() {

  var vector;

  beforeEach(function() {
    vector = new exports.PVector.create(10, 20);
  });

  afterEach(function() {
    vector = null;
  });

  it("should create vectors.", function() {
    expect(vector.x).toEqual(10);
    expect(vector.y).toEqual(20);
  });
});

describe("A new Repeller", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Repeller();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.G).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');            
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');                          
  });
});

describe("A new Sensor", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Sensor();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.type).toEqual('string');
    expect(typeof obj.behavior).toEqual('string');
    expect(typeof obj.sensitivity).toEqual('number');
    expect(typeof obj.width).toEqual('number');            
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.length).toEqual('number');
    expect(typeof obj.offsetAngle).toEqual('number');
    expect(typeof obj.color).toEqual('object'); 
    expect(typeof obj.opacity).toEqual('number'); 
    expect(typeof obj.target).toEqual('object'); 
    expect(typeof obj.activated).toEqual('boolean');
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
});

describe("A new Walker", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Walker();
  });

  afterEach(function() {
    obj = null;
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
    expect(typeof obj.isHarmonic).toEqual('boolean');  
    expect(typeof obj.harmonicAmplitude).toEqual('object'); 
    expect(typeof obj.harmonicPeriod).toEqual('object'); 
    expect(typeof obj.width).toEqual('number'); 
    expect(typeof obj.height).toEqual('number'); 
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.maxSpeed).toEqual('number');
    expect(typeof obj.wrapEdges).toEqual('boolean'); 
    expect(typeof obj.isStatic).toEqual('boolean');                                              
  });
});

describe("A new World", function() {

  var world;

  beforeEach(function() {
    world = new exports.World();
  });

  afterEach(function() {
    system = null;
    world = null;
  });

  it("should have its required properties.", function() {
    expect(typeof world.showStats).toEqual('boolean');
    expect(typeof world.statsInterval).toEqual('number');
    expect(typeof world.clock).toEqual('number');            
    expect(typeof world.c).toEqual('number');
    expect(typeof world.gravity).toEqual('object');
    expect(typeof world.wind).toEqual('object');
    expect(typeof world.location).toEqual('object');
    expect(typeof world.width).toEqual('number');
    expect(typeof world.height).toEqual('number');
    expect(typeof world.mouseX).toEqual('number');
    expect(typeof world.mouseY).toEqual('number');
  });

  it("should have a DOM element", function() {
    world.configure();
    expect(typeof world.el).toEqual('object');
  });  
});