describe("ParticleSystem", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(function() {
      obj = this.add('ParticleSystem');
    }, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create a particleSystem with its required properties.", function() {
    expect(getDataType(obj.isStatic)).toEqual('boolean');
    expect(getDataType(obj.lifespan)).toEqual('number');
    expect(getDataType(obj.life)).toEqual('number');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.burst)).toEqual('number');
    expect(getDataType(obj.burstRate)).toEqual('number');
    expect(getDataType(obj.emitRadius)).toEqual('number');
    expect(getDataType(obj.startColor)).toEqual('array');
    expect(getDataType(obj.endColor)).toEqual('array');
    expect(getDataType(obj.particleOptions)).toEqual('object');
    expect(getDataType(obj.beforeStep)).toEqual('function');
    expect(obj.name).toEqual('ParticleSystem');
  });

  it("should have a method beforeStep that creates a new Particle.", function() {
    obj = system.add('ParticleSystem');
    var clock = obj.clock;
    obj.beforeStep();
    var clock = 1;
  });

});