/*global Flora */
Flora.System.start(function() {

  'use strict';

  Flora.universe.update({
    c: 0,
    showStats: false,
    gravity: new Flora.Vector(),
    borderWidth: 0
  });

  var ps = new Flora.ParticleSystem({
    isStatic: false,
    width: 0,
    height: 0,
    burst: 1,
    burstRate: 1,
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
        location: this.getLocation(),
        acceleration: new Flora.Vector(x, y),
        color: [200, 200, 200],
        width: 50,
        height: 50,
        maxSpeed: 30,
        lifespan: 20,
        borderRadius: '50%',
        boxShadow: '1px 1px 20px 20px rgba(255, 255, 255, .1)'
      };
    }
  });


});