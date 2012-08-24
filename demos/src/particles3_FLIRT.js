/*global Flora */
var system = new Flora.FloraSystem();

system.start(function() {

  'use strict';

  Flora.world.update({
    c: 0,
    showStats: false,
    gravity: Flora.PVector.create(0, 0),
    style: {
      backgroundImage: "-webkit-radial-gradient(circle, #444, #000)"
    }
  });

  var ps = new Flora.ParticleSystem({
    isStatic: false,
    width: 0,
    height: 0,
    burst: 1,
    followMouse: true,
    theta: 0,
    r: 0,
    particle: function () {

      this.theta += 0.01;
      var r = Flora.SimplexNoise.noise(this.theta, 100) * 20;
      var n = Flora.SimplexNoise.noise(this.theta, -this.theta);
      var x = r * Math.cos(n); // Converting from polar (r,theta) to Cartesian (x,y) float x = r * cos(theta);
      var y = r * Math.sin(n); // Converting from polar (r,theta) to Cartesian (x,y) float y = r * sin(theta);

      return {
        parent: this,
        location: Flora.PVector.create(this.getLocation("x"), this.getLocation("y")),
        acceleration: Flora.PVector.create(x, y),
        color: [200, 200, 200],
        width: 50,
        height: 50,
        maxSpeed: 30,
        lifespan: 20,
        borderRadius: "50%",
        boxShadow: "1px 1px 20px 20px rgba(255, 255, 255, .1)"
      };
    }
  });


});