describe("Connector", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(function() {

      var pointA = this.add('Point', {
        location: function () {
          return new Burner.Vector(0, 0);
        }
      });

      var pointB = this.add('Point', {
        location: function () {
          return new Burner.Vector(100, 0);
        }
      });

      this.add('Connector', {
        parentA: pointA,
        parentB: pointB
      });

    }, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastItem();
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create a Connector with its required properties.", function() {

    obj.step();
    obj.draw();

    expect(obj.opacity).toEqual(1);
    expect(obj.zIndex).toEqual(0);
    expect(obj.width).toEqual(95);
    expect(obj.height).toEqual(0);
    expect(obj.color).toEqual('transparent');
    expect(obj.name).toEqual('Connector');
  });

});