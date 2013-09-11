describe("A new Sensor", function() {

  var agent, sensor, heat, v, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(function() {

      this.add('Stimulus', {
        type: 'Heat',
        location: function () {
          return new Burner.Vector(this.world.bounds[1] * 0.5, this.world.bounds[2] * 0.5);
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
          return new Burner.Vector(this.world.bounds[1] * 0.5, this.world.bounds[2] * 0.5);
        }
      });
    }, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    agent = system.lastItem();
    sensor = system.getAllItemsByName('Sensor')[0];
    heat = system.getAllItemsByName('Heat')[0];
  });

  afterEach(function() {
    system._destroySystem();
    agent = null;
    sensor = null;
    heat = null;
  });

  it("should have its required properties.", function() {
    expect(getDataType(sensor.type)).toEqual('string');
    expect(getDataType(sensor.behavior)).toEqual('string');
    expect(getDataType(sensor.sensitivity)).toEqual('number');
    expect(getDataType(sensor.width)).toEqual('number');
    expect(getDataType(sensor.height)).toEqual('number');
    expect(getDataType(sensor.offsetDistance)).toEqual('number');
    expect(getDataType(sensor.offsetAngle)).toEqual('number');
    expect(getDataType(sensor.opacity)).toEqual('number');
    expect(getDataType(sensor.target)).toEqual('object');
    expect(getDataType(sensor.activated)).toEqual('boolean');
    expect(sensor.name).toEqual('Sensor');
  });

  it("should have a method getActivationForce() that return a force to apply to an agentwhen its sensor is activated.", function() {
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
