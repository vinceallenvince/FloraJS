/*global Flora */
var system = new Flora.FloraSystem();
  
system.start(function () {
  
  'use strict';

  Flora.world.update({
    c: 0,
    showStats: false,
    gravity: Flora.PVector.create(0, 0),
    style: {
      backgroundImage: "-webkit-radial-gradient(circle, #444, #000)"
    }
  });

  var walker1 = new Flora.Walker({
    isPerlin: true,
    perlinTime: Flora.Utils.getRandomNumber(0, 10000),
    wrapEdges: true,
    maxSpeed: 20,
    opacity: 0.95,
    color: {
      r: 255,
      g: 150,
      b: 150
    }
  });
  
  var walker2 = new Flora.Walker({
    isPerlin: true,
    perlinTime: Flora.Utils.getRandomNumber(0, 10000),
    wrapEdges: true,
    maxSpeed: 20,
    opacity: 0.95,
    color: {
      r: 255,
      g: 150,
      b: 255
    }
  });
  
  var walkers = [walker1, walker2];

  var tail1 = new Flora.ParticleSystem({
    parent: walker1,
    burst: 1,
    particle: function () {
      
      var dir = Flora.Utils.clone(walker1.getVelocity());
        
      dir.normalize();
      if (dir) {
        dir.mult(-1);
      } else {
        dir = Flora.PVector.create(0, 0);
      }

      return {
        parent: this,
        location: this.getLocation(),
        acceleration: dir,
        lifespan: 10,
        checkEdges: false,
        width: 3,
        height: 3,
        color: {
          r: 200,
          g: 200,
          b: 200
        }
      };
    }
  });
        
  var tail2 = new Flora.ParticleSystem({
    parent: walker2,
    burst: 1,
    particle: function () {
      
      var dir = Flora.Utils.clone(walker1.getVelocity());
        
      dir.normalize();
      if (dir) {
        dir.mult(-1);
      } else {
        dir = Flora.PVector.create(0, 0);
      }

      return {
        parent: this,
        location: this.getLocation(),
        acceleration: dir,
        lifespan: 10,
        checkEdges: false,
        width: 3,
        height: 3,
        color: {
          r: 200,
          g: 200,
          b: 200
        }
      };
    }
  });

  var fishColors = ["rgb(255, 125, 125)", "rgb(255, 125, 255)"];
  
  var getMyParticleLifespan = function () {
    return this.myParticleLifespan;
  };

  var particle = function () {

    var lifespan = this.getMyParticleLifespan(),
      dir = Flora.Utils.clone(this.getVelocity()),
      color = fishColors[this.myIndex];
      
    dir.normalize();
    if (dir) {
      dir.mult(-Flora.Utils.map(lifespan, 8, 12, 10, 20));
    } else {
      dir = Flora.PVector.create(0, 0);
    }
    
    return {
      parent: this,
      location: this.getLocation(),
      acceleration: dir,
      lifespan: lifespan,
      border: "10px solid " + color,
      borderRadius: "100%",
      boxShadow: "1px 1px 20px 20px rgba(255, 255, 255, .5)"
    };
  };

  for (var i = 0; i < (0.004 * Flora.world.width); i += 1) {
    
    var myIndex = i % 2 === 0 ? 0 : 1;
    
    var fish1 = new Flora.ParticleSystem({
      myIndex: myIndex,
      location: Flora.PVector.create(Flora.Utils.getRandomNumber(0, Flora.world.width), Flora.Utils.getRandomNumber(0, Flora.world.height)),
      flocking: true,
      maxSteeringForce: 1,
      separateStrength: 1,
      alignStrength: 0.5,
      cohesionStrength: 1,
      width: 20,
      height: 20,
      target: walkers[myIndex],
      burst: 1,
      lifespan: -1,
      mass: Flora.Utils.getRandomNumber(2, 12),
      myParticleLifespan: Flora.Utils.getRandomNumber(8, 12),
      getMyParticleLifespan: getMyParticleLifespan,
      particle: particle
    });
  }
});