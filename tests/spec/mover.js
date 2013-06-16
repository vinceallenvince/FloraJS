describe("Mover", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(function() {
      this.add('Mover', {
        lifespan: 10,
        location: function() {
          return new Burner.Vector(this.world.bounds[1]/2, this.world.bounds[2]/2);
        }
      });
    }, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastItem();
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create a mover with its required properties.", function() {
    expect(getDataType(obj.id)).toEqual('string');
    expect(getDataType(obj.el)).toEqual('object');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.color)).toEqual('array');
    expect(getDataType(obj.motorSpeed)).toEqual('number');
    expect(getDataType(obj.angle)).toEqual('number');
    expect(getDataType(obj.pointToDirection)).toEqual('boolean');
    expect(getDataType(obj.draggable)).toEqual('boolean');
    expect(getDataType(obj.parent)).toEqual('object');
    expect(getDataType(obj.pointToParentDirection)).toEqual('boolean');
    expect(getDataType(obj.offsetDistance)).toEqual('number');
    expect(getDataType(obj.offsetAngle)).toEqual('number');
    expect(getDataType(obj.beforeStep)).toEqual('object');
    expect(getDataType(obj.afterStep)).toEqual('object');
    expect(obj.name).toEqual('Mover');
  });

  it("should have a method step() that updates properties.", function() {

    var lifeLast = obj.life;

    obj.step();

    expect(obj.life - lifeLast).toEqual(1);
  });

  it("should have a method applyForce() that updates acceleration.", function() {

    obj.acceleration = new Burner.Vector();
    obj.mass = 10;
    var f = obj.applyForce(new Burner.Vector(10, 5));

    expect(f.x).toEqual(1);
    expect(f.y).toEqual(0.5);
  });

  it("should have a method draw() that updates the corresponding DOM element's style property.", function() {
    obj.draw();
    expect(getDataType(obj.el.style.cssText)).toEqual('string');
  });

  it("should have a method seek() that calculates a steering force to apply to an object seeking another object.", function() {

      var walker = system.add('Walker', {
        location: function() {
          return new Burner.Vector(10, 10);
        }
      });

      var mover = system.add('Mover', {
        seekTarget: walker,
        location: function() {
          return new Burner.Vector(20000, 20000);
        }
      });

    expect(Math.round(mover._seek(mover.seekTarget).x)).toEqual(-7);
    expect(Math.round(mover._seek(mover.seekTarget).y)).toEqual(-7);
  });

  it("should have a method checkWorldEdges() that determines if this object is outside the world bounds.", function() {

    var world = system.firstItem();

    var mover = system.add('Mover', {
      location: function() {
        return new Burner.Vector(world.bounds[1] * 2, world.bounds[2] * 2);
      }
    });

    mover._checkWorldEdges();

    expect(mover.location.x <= mover.world.width).toEqual(true);

    //

    world.bounds[2] = 2000;

    mover = system.add('Mover', {
      location: function() {
        return new Burner.Vector(this.world.bounds[3] + 100, this.world.bounds[0] + 100);
      }
    });

    mover._checkWorldEdges();

    expect(mover.world.width > mover.location.x).toEqual(true);

  });
  // _checkCameraEdges
});