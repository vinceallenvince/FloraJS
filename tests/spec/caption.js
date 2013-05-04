describe("A new Caption", function() {

  var obj, getDataType, system;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Flora.Burner.System;
    system.create(function() {

      this.add('Caption', {
        text: 'Simple',
        opacity: 0.4,
        borderColor: 'transparent',
        position: 'top center'
      });
    }, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastElement();
  });

  afterEach(function() {
    Flora.Burner.PubSub.publish('destroySystem');
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(getDataType(obj.world)).toEqual('object');
    expect(getDataType(obj.position)).toEqual('string');
    expect(getDataType(obj.text)).toEqual('string');
    expect(getDataType(obj.opacity)).toEqual('number');
    expect(getDataType(obj.color)).toEqual('array');
    expect(getDataType(obj.borderWidth)).toEqual('string');
    expect(getDataType(obj.borderStyle)).toEqual('string');
    expect(getDataType(obj.borderColor)).toEqual('string');
    expect(getDataType(obj.colorMode)).toEqual('string');
    expect(getDataType(obj.el)).toEqual('object');
    expect(obj.name).toEqual('Caption');
  });

  it("should have a method to remove the caption's DOM element.", function() {
    expect(obj.destroy()).toEqual(true);
  });

});
