describe("FlowField", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    world.style.width = '1024px';
    world.style.height = '768px';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(null, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create a FlowField with its required properties.", function() {
    obj = system.add('FlowField');
    expect(getDataType(obj.resolution)).toEqual('number');
    expect(getDataType(obj.perlinSpeed)).toEqual('number');
    expect(getDataType(obj.perlinTime)).toEqual('number');
    expect(getDataType(obj.field)).toEqual('object');
    expect(getDataType(obj.createMarkers)).toEqual('boolean');
    expect(getDataType(obj.world)).toEqual('object');
    expect(obj.name).toEqual('FlowField');
  });

  it("should have a method build() that creates a list of vectors that define the field.", function() {
    obj = system.add('FlowField', { createMarkers: true });
    obj.build();
    expect(obj.field[0][0] instanceof Burner.Vector).toEqual(true);
  });

});