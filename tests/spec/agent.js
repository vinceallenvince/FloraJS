describe("Agent", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Flora.Burner.System;
    system.create(null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
  });

  afterEach(function() {
    Flora.Burner.PubSub.publish('destroySystem');
    obj = null;
  });

  it("should create an Agent with its required properties.", function() {
    obj = system.add('Agent');
    expect(getDataType(obj.followMouse)).toEqual('boolean');
    expect(getDataType(obj.maxSteeringForce)).toEqual('number');
    expect(getDataType(obj.seekTarget)).toEqual('object');
    expect(getDataType(obj.flocking)).toEqual('boolean');
    expect(getDataType(obj.desiredSeparation)).toEqual('number');
    expect(getDataType(obj.separateStrength)).toEqual('number');
    expect(getDataType(obj.alignStrength)).toEqual('number');
    expect(getDataType(obj.cohesionStrength)).toEqual('number');
    expect(getDataType(obj.flowField)).toEqual('object');
    expect(getDataType(obj.separateSumForceVector)).toEqual('object');
    expect(getDataType(obj.alignSumForceVector)).toEqual('object');
    expect(getDataType(obj.cohesionSumForceVector)).toEqual('object');
    expect(getDataType(obj.borderWidth)).toEqual('number');
    expect(getDataType(obj.borderStyle)).toEqual('string');
    expect(getDataType(obj.borderColor)).toEqual('string');
    expect(obj.borderRadius).toEqual(null);
    expect(getDataType(obj.borderTopLeftRadius)).toEqual('string');
    expect(getDataType(obj.borderTopRightRadius)).toEqual('string');
    expect(getDataType(obj.borderBottomRightRadius)).toEqual('string');
    expect(getDataType(obj.borderBottomLeftRadius)).toEqual('string');
    expect(obj.name).toEqual('Agent');
  });

  it("should have a method to apply forces." , function() {

    var walker = system.add('Walker', {
      location: function() {
        return new Flora.Vector(10, 10);
      }
    });

    var mover = system.add('Agent', {
      seekTarget: walker,
      location: function() {
        return new Flora.Vector(20000, 20000);
      }
    });
    expect(Math.round(mover.applyForces().x)).toEqual(-1);
    expect(Math.round(mover.applyForces().y)).toEqual(-1);
  });

  it("should have a method to apply a separation force." , function() {

    var walker = system.add('Walker', {
      location: function() {
        return new Flora.Vector(100, 100);
      }
    });

    var location = function() {
      return new Flora.Vector(2000 + (i * 10), 2000 + (i * 10));
    };

    var velocity = function() {
      return new Flora.Vector();
    };

    for (var i = 0; i < 2; i++) {
      system.add('Agent', {
        seekTarget: walker,
        flocking: true,
        location: location,
        velocity: velocity
      });
    }
    expect(Math.round(system.lastElement().separate(system.getAllElementsByName('Agent')).x)).toEqual(7);
    expect(Math.round(system.lastElement().separate(system.getAllElementsByName('Agent')).y)).toEqual(7);
  });

  it("should have a method to apply an alignment force." , function() {

    var walker = system.add('Walker', {
      location: function() {
        return new Flora.Vector(10, 10);
      }
    });

    var location = function() {
      return new Flora.Vector(2000 + (i * 20), 2000 + (i * 20));
    };

    var velocity = function() {
      return new Flora.Vector(i + 5, i + 5);
    };

    for (var i = 0; i < 2; i++) {
      system.add('Agent', {
        seekTarget: walker,
        flocking: true,
        location: location,
        velocity: velocity
      });
    }
    expect(Math.round(system.lastElement().align(system.getAllElementsByName('Agent')).x)).toEqual(1);
    expect(Math.round(system.lastElement().align(system.getAllElementsByName('Agent')).y)).toEqual(1);
  });

  it("should have a method to apply a cohesion force." , function() {

    var walker = system.add('Walker', {
      location: function() {
        return new Flora.Vector(10, 10);
      }
    });

    var location = function() {
      return new Flora.Vector(2000 + (i * 5), 2000 + (i * 5));
    };

    var velocity = function() {
      return new Flora.Vector(i + 5, i + 5);
    };

    for (var i = 0; i < 2; i++) {
      system.add('Agent', {
        seekTarget: walker,
        flocking: true,
        location: location,
        velocity: velocity
      });
    }
    expect(Math.round(system.lastElement().cohesion(system.getAllElementsByName('Agent')).x)).toEqual(-7);
    expect(Math.round(system.lastElement().cohesion(system.getAllElementsByName('Agent')).y)).toEqual(-7);
  });

  it("should have a method flock() to apply several flocking forces." , function() {

    var walker = system.add('Walker', {
      location: function() {
        return new Flora.Vector(10, 10);
      }
    });

    var location = function() {
      return new Flora.Vector(2000 + (i * 5), 2000 + (i * 5));
    };

    var velocity = function() {
      return new Flora.Vector(i + 5, i + 5);
    };

    for (var i = 0; i < 2; i++) {
      system.add('Agent', {
        seekTarget: walker,
        flocking: true,
        location: location,
        velocity: velocity
      });
    }
    expect(system.lastElement().flock(system.getAllElementsByName('Agent')).x.toFixed(2)).toEqual('-0.02');
    expect(system.lastElement().flock(system.getAllElementsByName('Agent')).y.toFixed(2)).toEqual('-0.03');
  });

  // getLocation
  // getVelocity

});