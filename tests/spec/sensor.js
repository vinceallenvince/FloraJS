describe("A new Sensor", function() {

  var agent, sensor, heat, v, getDataType, system, records;

  beforeEach(function() {
    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Flora.Burner.System;
    system.create(function() {

      this.add('Heat', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.5, this.world.bounds[2] * 0.5);
        }
      });

      this.add('Agent', {
        sensors: [
          this.add('Sensor', {
            type: 'heat'
          })
        ],
        minSpeed: 1,
        mass: 10,
        motorSpeed: 4,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.5, this.world.bounds[2] * 0.5);
        }
      });
    }, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    agent = system.lastElement();
    sensor = system.getAllElementsByName('Sensor')[0];
    heat = system.getAllElementsByName('Heat')[0];
  });

  afterEach(function() {
    Flora.Burner.PubSub.publish('destroySystem');
    agent = null;
    sensor = null;
  });

  it("should have its required properties.", function() {
    expect(typeof sensor.type).toEqual('string');
    expect(typeof sensor.behavior).toEqual('string');
    expect(typeof sensor.sensitivity).toEqual('number');
    expect(typeof sensor.width).toEqual('number');
    expect(typeof sensor.height).toEqual('number');
    expect(typeof sensor.offsetDistance).toEqual('number');
    expect(typeof sensor.offsetAngle).toEqual('number');
    expect(typeof sensor.opacity).toEqual('number');
    expect(typeof sensor.target).toEqual('object');
    expect(typeof sensor.activated).toEqual('boolean');
    expect(sensor.name).toEqual('Sensor');
  });

  it("should have a method getActivationForce() that return a force to apply to an agentwhen its sensor is activated.", function() {
    // !! depends on browser width
    /*sensor.target = heat;
    sensor.activated = true;

    sensor.behavior = 'COWARD';
    v = sensor.getActivationForce(agent);
    expect(v.x.toFixed(2)).toEqual('0.51');
    expect(v.y.toFixed(2)).toEqual('0.43');

    sensor.behavior = 'AGGRESSIVE';
    v = sensor.getActivationForce(agent);
    expect(v.x.toFixed(2)).toEqual('-0.51');
    expect(v.y.toFixed(2)).toEqual('-0.43');

    sensor.behavior = 'ACCELERATE';
    v = sensor.getActivationForce(agent);
    expect(v.x.toFixed(2)).toEqual('0.00');
    expect(v.y.toFixed(2)).toEqual('-1.00');

    sensor.behavior = 'DECELERATE';
    v = sensor.getActivationForce(agent);
    expect(v.x.toFixed(2)).toEqual('0.00');
    expect(v.y.toFixed(2)).toEqual('1.00');*/
  });

});
