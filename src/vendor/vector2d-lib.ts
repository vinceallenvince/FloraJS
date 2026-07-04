/**
 * A 2D vector.
 */
export default class Vector {
  x: number;
  y: number;
  z?: number;
  // Type-only declaration; the value lives on the prototype (set below).
  declare name: string;

  /**
   * @param opt_x The x location.
   * @param opt_y The y location.
   */
  constructor(opt_x?: number, opt_y?: number) {
    this.x = opt_x || 0;
    this.y = opt_y || 0;
  }

  /** Subtract two vectors. Returns a new Vector. */
  static VectorSub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  /** Add two vectors. Returns a new Vector. */
  static VectorAdd(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  /** Multiply a vector by a scalar value. Returns a new Vector. */
  static VectorMult(v: Vector, n: number): Vector {
    return new Vector(v.x * n, v.y * n);
  }

  /** Divide a vector by a scalar value. Returns a new Vector. */
  static VectorDiv(v: Vector, n: number): Vector {
    return new Vector(v.x / n, v.y / n);
  }

  /** Calculates the distance between two vectors. */
  static VectorDistance(v1: Vector, v2: Vector): number {
    return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
  }

  /** Get the midpoint between two vectors. Returns a new Vector. */
  static VectorMidPoint(v1: Vector, v2: Vector): Vector {
    return Vector.VectorAdd(v1, v2).div(2); // midpoint = (v1 + v2)/2
  }

  /** Get the angle between two vectors. */
  static VectorAngleBetween(v1: Vector, v2: Vector): number {
    var dot = v1.dot(v2);
    return Math.acos(dot / (v1.mag() * v2.mag()));
  }

  /**
   * Returns a new vector with all properties and methods of the
   * old vector copied to the new vector's prototype.
   */
  clone(): Vector {
    return Object.create(this);
  }

  /** Adds a vector to this vector. Returns this vector. */
  add(vector: Vector): Vector {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /** Subtracts a vector from this vector. Returns this vector. */
  sub(vector: Vector): Vector {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  /** Multiplies this vector by a passed value. Returns this vector. */
  mult(n: number): Vector {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /** Divides this vector by a passed value. Returns this vector. */
  div(n: number): Vector {
    this.x = this.x / n;
    this.y = this.y / n;
    return this;
  }

  /** Calculates the magnitude of this vector. */
  mag(): number {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }

  /**
   * Limits the vector's magnitude.
   * @param opt_high The upper bound of the vector's magnitude.
   * @param opt_low The lower bound of the vector's magnitude.
   */
  limit(opt_high?: number, opt_low?: number): Vector {
    var high = opt_high || null,
        low = opt_low || null;
    if (high && this.mag() > high) {
      this.normalize();
      this.mult(high);
    }
    if (low && this.mag() < low) {
      this.normalize();
      this.mult(low);
    }
    return this;
  }

  /**
   * Divides a vector by its magnitude to reduce its magnitude to 1.
   * Typically used to retrieve the direction of the vector for later
   * manipulation.
   */
  normalize(): Vector | undefined {
    var m = this.mag();
    if (m !== 0) {
      return this.div(m);
    }
  }

  /** Calculates the distance between this vector and a passed vector. */
  distance(vector: Vector): number {
    return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
  }

  /** Rotates a vector using a passed angle in radians. Returns this vector. */
  rotate(radians: number): Vector {
    var cos = Math.cos(radians),
        sin = Math.sin(radians),
        x = this.x,
        y = this.y;
    this.x = x * cos - y * sin;
    this.y = x * sin + y * cos;
    return this;
  }

  /** Calculates the midpoint between this vector and a passed vector. */
  midpoint(vector: Vector): Vector {
    return Vector.VectorAdd(this, vector).div(2);
  }

  /** Calculates the dot product. */
  dot(vector: Vector): number {
    if (this.z && vector.z) {
      return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
    return this.x * vector.x + this.y * vector.y;
  }
}

// Kept from the original prototype for callers that read vector.name.
Vector.prototype.name = 'Vector';
