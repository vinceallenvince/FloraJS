var Burner = require('Burner'),
    test = require('tape'),
    FlowField = require('../src/FlowField').FlowField,
    Sensor = require('../src/Sensor').Sensor,
    SimplexNoise = require('../src/SimplexNoise').SimplexNoise,
    Stimulus = require('../src/Stimulus').Stimulus,
    Agent, obj;

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

test('load Agent.', function(t) {
  Agent = require('../src/Agent').Agent;
  t.ok(Agent, 'object loaded');
  t.end();
});

test('new Agent() should have default properties.', function(t) {

  beforeTest();

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

  t.equal(obj.name, 'Agent', 'default name.');
  t.equal(obj.followMouse, false, 'default followMouse.');
  t.equal(obj.maxSteeringForce, 5, 'default maxSteeringForce.');
  t.equal(obj.seekTarget, null, 'default seekTarget.');
  t.equal(obj.flocking, false, 'default flocking.');
  t.equal(obj.separateStrength, 0.3, 'default separateStrength.');
  t.equal(obj.alignStrength, 0.2, 'default alignStrength.');
  t.equal(obj.cohesionStrength, 0.1, 'default cohesionStrength.');
  t.equal(obj.flowField, null, 'default flowField.');
  t.equal(obj.sensors.length, 0, 'default sensors.');
  t.equal(obj.motorSpeed, 0, 'default motorSpeed.');
  t.equal(obj.color[0], 197, 'default color r.');
  t.equal(obj.color[1], 177, 'default color g.');
  t.equal(obj.color[2], 115, 'default color b.');
  t.equal(obj.borderWidth, 0, 'default borderWidth.');
  t.equal(obj.borderStyle, 'none', 'default borderStyle.');
  t.equal(obj.borderColor[0], 255, 'default borderColor r.');
  t.equal(obj.borderColor[1], 255, 'default borderColor g.');
  t.equal(obj.borderColor[2], 255, 'default borderColor b.');
  t.equal(obj.borderRadius, 0, 'default borderRadius.');
  t.end();
});

test('new Agent() should have custom properties.', function(t) {

  beforeTest();

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

  t.equal(obj.followMouse, true, 'custom followMouse.');
  t.equal(obj.maxSteeringForce, 10, 'custom maxSteeringForce.');
  t.equal(obj.seekTarget.hello, 'hello', 'custom seekTarget.');
  t.equal(obj.flocking, true, 'custom flocking.');
  t.equal(obj.separateStrength, 0.5, 'custom separateStrength.');
  t.equal(obj.alignStrength, 0.5, 'custom alignStrength.');
  t.equal(obj.cohesionStrength, 0.5, 'custom cohesionStrength.');
  t.equal(obj.flowField.hello, 'hello', 'custom flowField.');
  t.equal(obj.sensors.length, 1, 'custom sensors.');
  t.equal(obj.motorSpeed, 10, 'custom motorSpeed.');
  t.equal(obj.color[0], 10, 'custom color r.');
  t.equal(obj.color[1], 20, 'custom color g.');
  t.equal(obj.color[2], 30, 'custom color b.');
  t.equal(obj.borderWidth, 2, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'custom borderStyle.');
  t.equal(obj.borderColor[0], 10, 'custom borderColor r.');
  t.equal(obj.borderColor[1], 20, 'custom borderColor g.');
  t.equal(obj.borderColor[2], 30, 'custom borderColor b.');
  t.equal(obj.borderRadius, 100, 'custom borderRadius.');

  t.equal(obj.separateSumForceVector instanceof Burner.Vector, true, 'default separateSumForceVector.');
  t.equal(obj.separateSumForceVector.x, 0, 'default separateSumForceVector.x');
  t.equal(obj.separateSumForceVector.y, 0, 'default separateSumForceVector.y');
  t.equal(obj.alignSumForceVector instanceof Burner.Vector, true, 'default alignSumForceVector.');
  t.equal(obj.alignSumForceVector.x, 0, 'default alignSumForceVector.x');
  t.equal(obj.alignSumForceVector.y, 0, 'default alignSumForceVector.y');
  t.equal(obj.cohesionSumForceVector instanceof Burner.Vector, true, 'default cohesionSumForceVector.');
  t.equal(obj.cohesionSumForceVector.x, 0, 'default cohesionSumForceVector.x');
  t.equal(obj.cohesionSumForceVector.y, 0, 'default cohesionSumForceVector.y');
  t.equal(obj.followTargetVector instanceof Burner.Vector, true, 'default followTargetVector.');
  t.equal(obj.followTargetVector.x, 0, 'default followTargetVector.x');
  t.equal(obj.followTargetVector.y, 0, 'default followTargetVector.y');
  t.equal(obj.followDesiredVelocity instanceof Burner.Vector, true, 'default followDesiredVelocity.');
  t.equal(obj.followDesiredVelocity.x, 0, 'default followDesiredVelocity.x');
  t.equal(obj.followDesiredVelocity.y, 0, 'default followDesiredVelocity.y');
  t.equal(obj.motorDir instanceof Burner.Vector, true, 'default motorDir.');
  t.equal(obj.motorDir.x, 0, 'default motorDir.x');
  t.equal(obj.motorDir.y, 0, 'default motorDir.y');

  t.end();
});

test('step() should update location.', function(t) {

  beforeTest();

  var agent, sensor, heat, val = 0;

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

  t.assert(sensorHeat.location.x === 230 && sensorHeat.location.y === 150.1, 'updates sensor location.');
  t.equal(sensorCold.borderStyle, 'none', 'hides all sensors after first.');

  Burner.System._stepForward();
  t.assert(sensorHeat.activated && !sensorCold.activated, 'sensorHeat is activated.');
  t.assert(parseFloat(agent.location.x.toFixed(2)) == 200.5 && parseFloat(agent.location.y.toFixed(2)) == 150.29, 'behavior updates agent location.');

  sensorHeat.behavior = function() {
    val = 200;
  };

  Burner.System._stepForward();

  t.equal(val, 200, 'fires custom behavior.');

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

  t.equal(obj.borderRadius, 100, 'if sensors.length > 0, borderRadius = 100.');
  t.equal(obj.sensors[0].parent instanceof Agent, true, 'sensors.parent should be an instance of Agent.');
  t.equal(obj.desiredSeparation, obj.width * 2, 'obj width');
  t.equal(parseFloat(obj.velocity.x.toFixed(2)), 86.60, 'velocity.x');
  t.equal(parseFloat(obj.velocity.y.toFixed(2)), 50.00, 'velocity.y');

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
    obj = this.add('Agent');
  });

  t.equal(obj.borderRadius, 0, 'if sensors.length = 0, borderRadius = 0.');
  t.equal(obj.desiredSeparation, obj.width * 2, 'default desiredSeparation.');

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
      desiredSeparation: 100
    });
  });

  t.equal(obj.desiredSeparation, 100, 'custom desiredSeparation.');

  t.end();

});


test('applyAdditionalForces() should update agent acceleration.', function(t) {

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
      motorSpeed: 10
    });
  });

  obj.applyAdditionalForces();

  t.equal(obj.acceleration.x, 1, 'applyAdditionalForces() motorSpeed updates acceleration.x');
  t.equal(obj.acceleration.y, 0, 'applyAdditionalForces() motorSpeed updates acceleration.y');

  obj.velocity = new Burner.Vector(0, 100);

  obj.applyAdditionalForces();
  t.equal(obj.acceleration.x, 1, 'applyAdditionalForces() motorSpeed updates acceleration.x');
  t.equal(obj.acceleration.y, -1, 'applyAdditionalForces() motorSpeed updates acceleration.y');

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
      followMouse: true
    });
  });

  Burner.System.mouse.location.x = 10;
  Burner.System.mouse.location.y = 10;

  obj.applyAdditionalForces();

  t.equal(parseFloat(obj.acceleration.x.toFixed(2)), -0.40, 'applyAdditionalForces() followMouse updates acceleration.x');
  t.equal(parseFloat(obj.acceleration.y.toFixed(2)), -0.30, 'applyAdditionalForces() followMouse updates acceleration.y');

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
      seekTarget: {
        location: new Burner.Vector(300, 200)
      }
    });
  });


  obj.applyAdditionalForces();

  t.equal(parseFloat(obj.acceleration.x.toFixed(2)), 0.45, 'applyAdditionalForces() seekTarget updates acceleration.x');
  t.equal(parseFloat(obj.acceleration.y.toFixed(2)), 0.22, 'applyAdditionalForces() seekTarget updates acceleration.y');

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

  t.equal(parseFloat(obj.location.x.toFixed(2)), 201.07, 'applyAdditionalForces() seekTarget updates acceleration.x');
  t.equal(parseFloat(obj.location.y.toFixed(2)), 201.17, 'applyAdditionalForces() seekTarget updates acceleration.y');

  //

  t.end();

});

test('seek() should update agent acceleration.', function(t) {

  beforeTest();

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

  t.equal(parseFloat(dVel.x.toFixed(2)), -4.16, 'seek() returns force.x');
  t.equal(parseFloat(dVel.y.toFixed(2)), -2.77, 'seek() returns force.y');
  t.end();
});


/*test('flocking() should bundle flocking behaviors (separate, align, cohesion) into one call.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Agent: Agent
  };

  Burner.System.setup(function() {
    this.add('World', {
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

  var a = obj._flock(Burner.System.getAllItemsByName('Agent'));

  t.equal(parseFloat(a.x.toFixed(2)), 0.07, 'applyAdditionalForces() seekTarget updates acceleration.x');
  t.equal(parseFloat(a.y.toFixed(2)), 0.07, 'applyAdditionalForces() seekTarget updates acceleration.y');

  //

  t.end();

});*/

test('separate() should calculates a force to apply to avoid all other items.', function(t) {

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

  t.equal(parseFloat(a.x.toFixed(2)), 3.54, 'applyAdditionalForces() returns an updated force.');
  t.equal(parseFloat(a.y.toFixed(2)), 3.54, 'applyAdditionalForces() returns an updated force.');

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

  t.equal(parseFloat(a.x.toFixed(2)), 0, 'applyAdditionalForces() returns an empty force.');
  t.equal(parseFloat(a.y.toFixed(2)), 0, 'applyAdditionalForces() returns an empty force.');

  //
  t.end();

});

test('align() should calculates a force to apply to avoid all other items.', function(t) {

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

  t.equal(parseFloat(a.x.toFixed(2)), 3.54, 'applyAdditionalForces() returns an updated force.');
  t.equal(parseFloat(a.y.toFixed(2)), 3.54, 'applyAdditionalForces() returns an updated force.');

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

  t.equal(parseFloat(a.x.toFixed(2)), 0, 'applyAdditionalForces() returns an empty force.');
  t.equal(parseFloat(a.y.toFixed(2)), 0, 'applyAdditionalForces() returns an empty force.');

  //
  t.end();

});

test('cohesion() should calculates a force to apply to avoid all other items.', function(t) {

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

  t.equal(parseFloat(a.x.toFixed(2)), 3.54, 'applyAdditionalForces() returns an updated force.');
  t.equal(parseFloat(a.y.toFixed(2)), 3.54, 'applyAdditionalForces() returns an updated force.');

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

  t.equal(parseFloat(a.x.toFixed(2)), 0, 'applyAdditionalForces() returns an empty force.');
  t.equal(parseFloat(a.y.toFixed(2)), 0, 'applyAdditionalForces() returns an empty force.');

  //
  //
  t.end();

});

test('Agent with a flowField should update location based on flowField.', function(t) {

  beforeTest();

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

  t.assert(agent.location.x !== x, 'FlowField updates location.x.');
  t.assert(agent.location.y !== y, 'FlowField updates location.y.');

  //

  var followLoc = agent._follow({location: new Burner.Vector(100, 75)});
  t.equal(parseFloat(followLoc.x.toFixed(2)), 4, 'returns force x.');
  t.equal(parseFloat(followLoc.y.toFixed(2)), 3, 'returns force y.');

  t.end();
});


test('Agent with a flowField should update location based on flowField.', function(t) {

  beforeTest();

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
    field: {0:{}}
  };

  var x = agent.location.x;
  var y = agent.location.y;

  Burner.System._stepForward();

  t.assert(agent.location.x === x, 'If FlowField is out of range location.x does not update.');
  t.assert(agent.location.y === y, 'If FlowField is out of range location.y does not update.');

  t.end();
});
