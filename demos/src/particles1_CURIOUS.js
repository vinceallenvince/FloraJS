/*global Flora */
var system = new Flora.FloraSystem();

system.start(function() {

  'use strict';

  Flora.universe.update({
    c: 0,
    showStats: true,
    gravity: new Flora.Vector(),
    borderWidth: 0
  });

  var walker1 = new Flora.Walker({
    isPerlin: true,
    perlinTime: Flora.Utils.getRandomNumber(0, 10000),
    wrapEdges: true,
    maxSpeed: 20,
    opacity: 0.95,
    color: [255, 150, 150]
  });

  var walker2 = new Flora.Walker({
    isPerlin: true,
    perlinTime: Flora.Utils.getRandomNumber(0, 10000),
    wrapEdges: true,
    maxSpeed: 20,
    opacity: 0.95,
    color: [255, 150, 255]
  });

  var walkers = [walker1, walker2];

  var tail1 = new Flora.ParticleSystem({
    isStatic: false,
    parent: walker1,
    offsetDistance: 0,
    burst: 1,
    burstRate: 1,
    lifespan: -1,
    particle: function () {

      var dir = Flora.Utils.clone(walker1.getVelocity());

      dir.normalize();
      if (dir) {
        dir.mult(-1);
      } else {
        dir = new Flora.Vector();
      }

      return {
        location: this.getLocation(),
        acceleration: dir.mult(8),
        lifespan: 8,
        checkEdges: false,
        width: 3,
        height: 3,
        color: [255, 255, 255]
      };
    }
  });

  var tail2 = new Flora.ParticleSystem({
    isStatic: false,
    parent: walker2,
    offsetDistance: 0,
    burst: 1,
    burstRate: 1,
    particle: function () {

      var dir = Flora.Utils.clone(walker2.getVelocity());

      dir.normalize();
      if (dir) {
        dir.mult(-1);
      } else {
        dir = new Flora.Vector();
      }

      return {
        location: this.getLocation(),
        acceleration: dir.mult(8),
        lifespan: 8,
        checkEdges: false,
        width: 3,
        height: 3,
        color: [255, 255, 255]
      };
    }
  });

  var fishColors = [[255, 125, 125], [255, 125, 255]];
  var fishBorders = ['solid', 'solid'];

  var getMyParticleLifespan = function () {
    return this.myParticleLifespan;
  };

  var particle = function () {

    var lifespan = this.getMyParticleLifespan(),
      dir = Flora.Utils.clone(this.getVelocity()),
      color = fishColors[this.myIndex],
      border = fishBorders[this.myIndex];

    dir.normalize();
    if (dir) {
      dir.mult(-Flora.Utils.map(lifespan, 8, 12, 10, 20));
    } else {
      dir = new Flora.Vector();
    }
    var opacity = 1;
    return {
      parent: this,
      width: 10,
      height: 10,
      opacity: opacity,
      location: this.getLocation(),
      acceleration: dir,
      lifespan: lifespan,
      color: [255, 255, 255],
      borderWidth: 10,
      borderColor: color,
      borderStyle: border,
      borderRadius: "100%",
      boxShadow: "1px 1px 20px 20px rgba(255, 255, 255, 0.25)"
    };
  };

  for (var i = 0; i < (0.004 * Flora.universe.first().width); i += 1) {

    var myIndex = i % 2 === 0 ? 0 : 1;

    var fish1 = new Flora.ParticleSystem({
      isStatic: false,
      myIndex: myIndex,
      location: new Flora.Vector(Flora.Utils.getRandomNumber(0, Flora.universe.first().width), Flora.Utils.getRandomNumber(0, Flora.universe.first().height)),
      flocking: true,
      maxSteeringForce: 1,
      separateStrength: 1,
      alignStrength: 0.5,
      cohesionStrength: 1,
      target: walkers[myIndex],
      burst: 1,
      burstRate: 1,
      lifespan: -1,
      mass: Flora.Utils.getRandomNumber(2, 12),
      myParticleLifespan: Flora.Utils.getRandomNumber(10, 14),
      getMyParticleLifespan: getMyParticleLifespan,
      particle: particle
    });
  }
});