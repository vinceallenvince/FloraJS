import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import FlowField from '../src/flowfield';
import Sensor from '../src/sensor';
import SimplexNoise from '../src/vendor/quietriot';
import Stimulus from '../src/stimulus';
import Agent from '../src/agent';

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

test('load Agent.', () => {
  expect(Agent).toBeTruthy();
});

test('new Agent() should have default properties.', () => {
  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Agent();
    obj.init(world);
  });

  expect(obj.name).toBe('Agent');
  expect(obj.followMouse).toBe(false);
  expect(obj.maxSteeringForce).toBe(5);
  expect(obj.seekTarget).toBe(null);
  expect(obj.flocking).toBe(false);
  expect(obj.separateStrength).toBe(0.3);
  expect(obj.alignStrength).toBe(0.2);
  expect(obj.cohesionStrength).toBe(0.1);
  expect(obj.flowField).toBe(null);
  expect(obj.sensors.length).toBe(0);
  expect(obj.motorSpeed).toBe(0);
  expect(obj.color[0]).toBe(197);
  expect(obj.color[1]).toBe(177);
  expect(obj.color[2]).toBe(115);
  expect(obj.borderWidth).toBe(0);
  expect(obj.borderStyle).toBe('none');
  expect(obj.borderColor[0]).toBe(255);
  expect(obj.borderColor[1]).toBe(255);
  expect(obj.borderColor[2]).toBe(255);
  expect(obj.borderRadius).toBe(0);
});

test('new Agent() should have custom properties.', () => {
  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Agent', {
      followMouse: true,
      maxSteeringForce: 10,
      remainsOnScreen: true,
      seekTarget: {'hello': 'hello'},
      flocking: true,
      separateStrength: 0.5,
      alignStrength: 0.5,
      cohesionStrength: 0.5,
      flowField: {'hello': 'hello'},
      sensors: [{}],
      motorSpeed: 10,
      color: [10, 20, 30],
      borderWidth: 2,
      borderStyle: 'dotted',
      borderColor: [10, 20, 30],
      borderRadius: 100
    });
  });

  expect(obj.followMouse).toBe(true);
  expect(obj.maxSteeringForce).toBe(10);
  expect(obj.seekTarget.hello).toBe('hello');
  expect(obj.flocking).toBe(true);
  expect(obj.separateStrength).toBe(0.5);
  expect(obj.alignStrength).toBe(0.5);
  expect(obj.cohesionStrength).toBe(0.5);
  expect(obj.flowField.hello).toBe('hello');
  expect(obj.sensors.length).toBe(1);
  expect(obj.motorSpeed).toBe(10);
  expect(obj.color[0]).toBe(10);
  expect(obj.color[1]).toBe(20);
  expect(obj.color[2]).toBe(30);
  expect(obj.borderWidth).toBe(2);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0]).toBe(10);
  expect(obj.borderColor[1]).toBe(20);
  expect(obj.borderColor[2]).toBe(30);
  expect(obj.borderRadius).toBe(100);

  expect(obj.separateSumForceVector instanceof Burner.Vector).toBe(true);
  expect(obj.separateSumForceVector.x).toBe(0);
  expect(obj.separateSumForceVector.y).toBe(0);
  expect(obj.alignSumForceVector instanceof Burner.Vector).toBe(true);
  expect(obj.alignSumForceVector.x).toBe(0);
  expect(obj.alignSumForceVector.y).toBe(0);
  expect(obj.cohesionSumForceVector instanceof Burner.Vector).toBe(true);
  expect(obj.cohesionSumForceVector.x).toBe(0);
  expect(obj.cohesionSumForceVector.y).toBe(0);
  expect(obj.followTargetVector instanceof Burner.Vector).toBe(true);
  expect(obj.followTargetVector.x).toBe(0);
  expect(obj.followTargetVector.y).toBe(0);
  expect(obj.followDesiredVelocity instanceof Burner.Vector).toBe(true);
  expect(obj.followDesiredVelocity.x).toBe(0);
  expect(obj.followDesiredVelocity.y).toBe(0);
  expect(obj.motorDir instanceof Burner.Vector).toBe(true);
  expect(obj.motorDir.x).toBe(0);
  expect(obj.motorDir.y).toBe(0);
});

test('step() should update location.', () => {
  var agent, sensor, heat, val = 0;
  var sensorHeat, sensorCold;

  Burner.System.Classes = {
    Agent: Agent,
    Sensor: Sensor,
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    agent = this.add('Agent', {
      location: new Burner.Vector(200, 150),
      sensors: [
        this.add('Sensor', {
          type: 'heat',
          behavior: 'AGGRESSIVE'
        }),
        this.add('Sensor', {
          type: 'cold'
        })
      ]
    });
    heat = this.add('Stimulus', {
      type: 'heat',
      location: new Burner.Vector(230, 150)
    });
  });

  sensorHeat = agent.sensors[0];
  sensorCold = agent.sensors[1];

  Burner.System._stepForward();

  expect(sensorHeat.location.x === 230 && sensorHeat.location.y === 150.1).toBeTruthy();
  expect(sensorCold.borderStyle).toBe('none');

  Burner.System._stepForward();
  expect(sensorHeat.activated && !sensorCold.activated).toBeTruthy();
  expect(parseFloat(agent.location.x.toFixed(2)) == 200.5 && parseFloat(agent.location.y.toFixed(2)) == 150.29).toBeTruthy();

  sensorHeat.behavior = function() {
    val = 200;
  };

  Burner.System._stepForward();

  expect(val).toBe(200);

  //

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Agent', {
      sensors: [{}],
      motorSpeed: 100,
      angle: 30
    });
  });

  expect(obj.borderRadius).toBe(100);
  expect(obj.sensors[0].parent instanceof Agent).toBe(true);
  expect(obj.desiredSeparation).toBe(obj.width * 2);
  expect(parseFloat(obj.velocity.x.toFixed(2))).toBe(86.60);
  expect(parseFloat(obj.velocity.y.toFixed(2))).toBe(50.00);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Agent');
  });

  expect(obj.borderRadius).toBe(0);
  expect(obj.desiredSeparation).toBe(obj.width * 2);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Agent', {
      desiredSeparation: 100
    });
  });

  expect(obj.desiredSeparation).toBe(100);
});

test('applyAdditionalForces() should update agent acceleration.', () => {
  var obj;

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Agent', {
      motorSpeed: 10
    });
  });

  obj.applyAdditionalForces();

  expect(obj.acceleration.x).toBe(1);
  expect(obj.acceleration.y).toBe(0);

  obj.velocity = new Burner.Vector(0, 100);

  obj.applyAdditionalForces();
  expect(obj.acceleration.x).toBe(1);
  expect(obj.acceleration.y).toBe(-1);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Agent', {
      followMouse: true
    });
  });

  Burner.System.mouse.location.x = 10;
  Burner.System.mouse.location.y = 10;

  obj.applyAdditionalForces();

  expect(parseFloat(obj.acceleration.x.toFixed(2))).toBe(-0.40);
  expect(parseFloat(obj.acceleration.y.toFixed(2))).toBe(-0.30);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Agent', {
      seekTarget: {
        location: new Burner.Vector(300, 200)
      }
    });
  });

  obj.applyAdditionalForces();

  expect(parseFloat(obj.acceleration.x.toFixed(2))).toBe(0.45);
  expect(parseFloat(obj.acceleration.y.toFixed(2))).toBe(0.22);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    for (var i = 0; i < 10; i++) {
      this.add('Agent', {
        flocking: true,
        location: new Burner.Vector(200, 200)
      });
    }
    obj = this.add('Agent', {
      flocking: true,
      location: new Burner.Vector(201, 201)
    });
  });

  Burner.System._stepForward();

  expect(parseFloat(obj.location.x.toFixed(2))).toBe(201.07);
  expect(parseFloat(obj.location.y.toFixed(2))).toBe(201.17);
});

test('seek() should update agent acceleration.', () => {
  var obj, target;

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Agent');
    target = this.add('Agent', {
      location: new Burner.Vector(50, 50)
    });
  });

  var dVel = obj._seek(target);

  expect(parseFloat(dVel.x.toFixed(2))).toBe(-4.16);
  expect(parseFloat(dVel.y.toFixed(2))).toBe(-2.77);
});

test('separate() should calculates a force to apply to avoid all other items.', () => {
  var obj;

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    for (var i = 0; i < 10; i++) {
      this.add('Agent', {
        flocking: true,
        location: new Burner.Vector(200, 200)
      });
    }
    obj = this.add('Agent', {
      flocking: true,
      location: new Burner.Vector(201, 201)
    });
  });

  var a = obj._separate(Burner.System.getAllItemsByName('Agent'));

  expect(parseFloat(a.x.toFixed(2))).toBe(3.54);
  expect(parseFloat(a.y.toFixed(2))).toBe(3.54);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    for (var i = 0; i < 10; i++) {
      this.add('Agent', {
        flocking: true,
        location: new Burner.Vector(10, 10)
      });
    }
    obj = this.add('Agent', {
      flocking: true,
      location: new Burner.Vector(390, 290)
    });
  });

  var a = obj._separate(Burner.System.getAllItemsByName('Agent'));

  expect(parseFloat(a.x.toFixed(2))).toBe(0);
  expect(parseFloat(a.y.toFixed(2))).toBe(0);
});

test('align() should calculates a force to apply to avoid all other items.', () => {
  var obj;

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    for (var i = 0; i < 10; i++) {
      this.add('Agent', {
        flocking: true,
        location: new Burner.Vector(202, 202),
        velocity: new Burner.Vector(1, 1)
      });
    }
    obj = this.add('Agent', {
      flocking: true,
      location: new Burner.Vector(200, 200),
      velocity: new Burner.Vector(2, 2)
    });
  });

  var a = obj._align(Burner.System.getAllItemsByName('Agent'));

  expect(parseFloat(a.x.toFixed(2))).toBe(3.54);
  expect(parseFloat(a.y.toFixed(2))).toBe(3.54);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    for (var i = 0; i < 10; i++) {
      this.add('Agent', {
        flocking: true,
        location: new Burner.Vector(10, 10),
        velocity: new Burner.Vector(1, 1)
      });
    }
    obj = this.add('Agent', {
      flocking: true,
      location: new Burner.Vector(390, 290),
      velocity: new Burner.Vector(2, 2)
    });
  });

  var a = obj._align(Burner.System.getAllItemsByName('Agent'));

  expect(parseFloat(a.x.toFixed(2))).toBe(0);
  expect(parseFloat(a.y.toFixed(2))).toBe(0);
});

test('cohesion() should calculates a force to apply to avoid all other items.', () => {
  var obj;

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    for (var i = 0; i < 10; i++) {
      this.add('Agent', {
        flocking: true,
        location: new Burner.Vector(202, 202),
        velocity: new Burner.Vector(1, 1)
      });
    }
    obj = this.add('Agent', {
      flocking: true,
      location: new Burner.Vector(200, 200),
      velocity: new Burner.Vector(2, 2)
    });
  });

  var a = obj._cohesion(Burner.System.getAllItemsByName('Agent'));

  expect(parseFloat(a.x.toFixed(2))).toBe(3.54);
  expect(parseFloat(a.y.toFixed(2))).toBe(3.54);

  //

  beforeTest();

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    for (var i = 0; i < 10; i++) {
      this.add('Agent', {
        flocking: true,
        location: new Burner.Vector(202, 202),
        velocity: new Burner.Vector(1, 1)
      });
    }
    obj = this.add('Agent', {
      flocking: true,
      location: new Burner.Vector(390, 290),
      velocity: new Burner.Vector(2, 2)
    });
  });

  var a = obj._cohesion(Burner.System.getAllItemsByName('Agent'));

  expect(parseFloat(a.x.toFixed(2))).toBe(0);
  expect(parseFloat(a.y.toFixed(2))).toBe(0);
});

test('Agent with a flowField should update location based on flowField.', () => {
  var agent;

  Burner.System.Classes = {
    Agent: Agent,
    FlowField: FlowField
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      gravity: new Burner.Vector(),
      width: 400,
      height: 300
    });

    var ffield = this.add('FlowField');
    ffield.build();

    agent = this.add('Agent', {
      flowField: ffield,
      checkWorldEdges: true,
      wrapWorldEdges: true
    });
  });

  var x = agent.location.x;
  var y = agent.location.y;

  Burner.System._stepForward();

  expect(agent.followTargetVector.x >= -1 || agent.followTargetVector.x <= 1).toBeTruthy();
  expect(agent.followTargetVector.y >= -1 || agent.followTargetVector.y <= 1).toBeTruthy();

  //

  var followLoc = agent._follow({location: new Burner.Vector(100, 75)});
  expect(parseFloat(followLoc.x.toFixed(2))).toBe(4);
  expect(parseFloat(followLoc.y.toFixed(2))).toBe(3);
});

test('Agent with an out of range flowField should not update followTargetVector.', () => {
  var agent;

  Burner.System.Classes = {
    Agent: Agent,
    FlowField: FlowField
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      gravity: new Burner.Vector(),
      width: 400,
      height: 300
    });

    var ffield = this.add('FlowField');
    ffield.build();

    agent = this.add('Agent', {
      flowField: ffield,
      checkWorldEdges: true,
      wrapWorldEdges: true
    });
  });

  agent.flowField = {
    resolution: 50,
    field: {4: {}}
  };

  var x = agent.location.x;
  var y = agent.location.y;

  Burner.System._stepForward();

  expect(agent.followTargetVector.x === x).toBeTruthy();
  expect(agent.followTargetVector.y === y).toBeTruthy();
});
