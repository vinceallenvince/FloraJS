describe("Vector", function() {

  var obj, objA, objB, getDataType, system;

  beforeEach(function() {
    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Flora.Burner.System;
    system.create(function() {
      this.add('Walker');
    }, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = new exports.Vector(22, 10);
  });

  afterEach(function() {
    Flora.Burner.PubSub.publish('destroySystem');
    obj = null;
    objA = null;
    objB = null;
  });

  it("should create vectors.", function() {
    expect(obj.x).toEqual(22);
    expect(obj.y).toEqual(10);
  });
  it('VectorAdd() should add two vectors.', function() {
    objA = new exports.Vector(1, 1);
    expect(exports.Vector.VectorAdd(obj, objA).x).toEqual(23);
    expect(exports.Vector.VectorAdd(obj, objA).y).toEqual(11);
  });
  it('add() should add a vector.', function() {
    obj.add(new exports.Vector(1, 1));
    expect(obj.x).toEqual(23);
    expect(obj.y).toEqual(11);
  });
  it('VectorSub() should subtract two vectors.', function() {
    objA = new exports.Vector(1, 1);
    expect(exports.Vector.VectorSub(obj, objA).x).toEqual(21);
    expect(exports.Vector.VectorSub(obj, objA).y).toEqual(9);
  });
  it('sub() should subtract a vector.', function() {
    obj.sub(new exports.Vector(1, 1));
    expect(obj.x).toEqual(21);
    expect(obj.y).toEqual(9);
  });
  it('VectorMult() should multiply a vector by a scalar value.', function() {
    expect(exports.Vector.VectorMult(obj, 2).x).toEqual(44);
    expect(exports.Vector.VectorMult(obj, 2).y).toEqual(20);
  });
  it('mult() should multiply a vector.', function() {
    obj.mult(2);
    expect(obj.x).toEqual(44);
    expect(obj.y).toEqual(20);
  });
  it('VectorDiv() should divide a vector by a scalar value.', function() {
    expect(exports.Vector.VectorDiv(obj, 2).x).toEqual(11);
    expect(exports.Vector.VectorDiv(obj, 2).y).toEqual(5);
  });
  it('div() should divide a vector.', function() {
    obj.div(2);
    expect(obj.x).toEqual(11);
    expect(obj.y).toEqual(5);
  });
  it('mag() should calculate the magnitude of a vector.', function() {
    obj = new exports.Vector(10, 10);
    expect(obj.mag()).toEqual(14.142135623730951);
  });
  it('limit() should limit the magnitude of a vector.', function() {
    obj = new exports.Vector(10, 10);
    expect(obj.limit(5).mag()).toEqual(5);
    obj = new exports.Vector(5, 5);
    expect(Math.round(obj.limit(null, 8).mag())).toEqual(8);
  });
  it('normalize() should divide a vector by its magnitude to reduce its magnitude to 1.', function() {
    obj = new exports.Vector(3, 4);
    expect(obj.normalize().x).toEqual(0.6);
    expect(obj.normalize().y).toEqual(0.8);
  });
  it('VectorDistance(v1, v2) should return the distance between two vectors.', function() {
    objA = new exports.Vector(50, 100);
    objB = new exports.Vector(100, 100);
    expect(exports.Vector.VectorDistance(objA, objB)).toEqual(50);
  });
  it('distance() should calculate the distance between this vector and a passed vector.', function() {
    obj = new exports.Vector(5, 0);
    expect(obj.distance(new exports.Vector(1, 0))).toEqual(4);
  });
  it('rotate() should rotate a vector using a passed angle in radians.', function() {
    obj = new exports.Vector(10, 0);
    expect(obj.rotate(Math.PI).x).toEqual(-10);
  });
  it('VectorMidPoint(v1, v2) should return the midpoint between two vectors.', function() {
    objA = new exports.Vector(50, 100);
    objB = new exports.Vector(100, 200);
    expect(exports.Vector.VectorMidPoint(objA, objB).x).toEqual(75);
    expect(exports.Vector.VectorMidPoint(objA, objB).y).toEqual(150);
  });
  it('midpoint() should return the midpoint between this vector and a passed vector.', function() {
    objA = new exports.Vector(50, 100);
    objB = new exports.Vector(100, 200);
    expect(objA.midpoint(objB).x).toEqual(75);
    expect(objA.midpoint(objB).y).toEqual(150);
  });
  it('Vector.VectorAngleBetween should return the angle between two Vectors.', function() {
    objA = new exports.Vector(50, 0);
    objB = new exports.Vector(50, 180);
    expect(Math.round(exports.Vector.VectorAngleBetween(objA, objB))).toEqual(1);
  });
});
