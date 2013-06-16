describe("A new InputMenu", function() {

  var obj, getDataType, system;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(function() {
      this.add('InputMenu', {
        opacity: 0.4,
        borderColor: 'transparent',
        position: 'top center'
      });
    }, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastItem();
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(getDataType(obj.world)).toEqual('object');
    expect(getDataType(obj.position)).toEqual('string');
    expect(getDataType(obj.opacity)).toEqual('number');
    expect(getDataType(obj.color)).toEqual('array');
    expect(getDataType(obj.borderWidth)).toEqual('number');
    expect(getDataType(obj.borderStyle)).toEqual('string');
    expect(getDataType(obj.borderColor)).toEqual('string');
    expect(getDataType(obj.colorMode)).toEqual('string');
    expect(getDataType(obj.el)).toEqual('object');
    expect(obj.name).toEqual('InputMenu');
  });

  it("should have a method to remove the inputmenu's DOM element.", function() {
    expect(obj.destroy()).toEqual(true);
  });

});
