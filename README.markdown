# FloraJS: a JavaScript framework for rendering natural systems in a web browser.

FloraJS is a JavaScript framework for simulating natural systems in a web browser. In Flora, the "world" is your web browser. DOM elements inhabit the world and behave according to rules meant to simulate a natural environment. You can find demos at http://www.florajs.com.

The formulas driving a large part of Flora are adapted from Daniel Shiffman's 'The Nature of Code' at https://github.com/shiffman/The-Nature-of-Code. Inspiration also came from the writings of Valentino Braitenberg and Gary Flake.

## Simple System

To setup a simple Flora system, reference the Flora .js file and the latest version of Modernizr from two script tags in the &lt;head&gt; of your document. Also, reference the flora.css file.

In the body, add a &lt;script&gt; tag and create a new Flora system. Pass the system a function that describes the elements in your world.

The following is taken from examples/simple.html.

```html
<!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link rel="stylesheet" href="css/flora.css" type="text/css" charset="utf-8">
    <script src="js/modernizr.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      // start the system; pass initial instuctions
      Flora.System.start(function() {
        new Flora.Mover();
      });
    </script>
  </body>
</html>
```

You should see a block fall and bounce off the bottom of your browser window.

#### The Universe and its Worlds

Every Flora system starts with one Universe and one World. While a universe may have many Worlds, by default, Flora's system uses the &lt;body&gt; as the only World.

In the example above, immediately after the system starts, a Mover is created and appended to the World (or &lt;body&gt;).

Worlds carry two properties that directly affect their elements.

* gravity {Vector} default: new Vector(0, 1)
* c (coefficient of friction) {number} 0.01

We can change these defaults after the system starts via the Universe's update() method.

        Flora.System.start(function() {
          Flora.universe.update({
            gravity: new Flora.Vector(0, -1),
            c: 0.75
          });
          new Flora.Mover();
        });

We've reversed the World's gravity and increased its friction. Now the block slowly drifts upwards.

#### Movers

Movers are basic Flora elements that respond to forces like gravity, attraction, repulsion, etc. They can also chase after other Movers, organize with other Movers in a flocking behavior, and steer away from obstacles.

All other Flora elements like Walkers and Oscillators inherit properties from Movers.

Movers are highly configurable. For a complete list of options see the docs at http://www.florajs.com/docs.

For an example of the Mover's seek behavior, set 'followMouse' to 'true' when creating the Mover.

        Flora.System.start(function() {
          new Flora.Mover({
            followMouse: true
          });
        });

#### Walkers

Walkers are a step down on the evolutionary chain from Movers. They have no seeking, steering or directional behavior and just randomly explore their World. Use Walkers to create wandering objects or targets for Movers to seek.

Walkers carry two properties that directly affect how they 'walk'.

* isPerlin {boolean} default: true
* isRandom {boolean} default: false

By default, Walkers use an algorithm called Perlin Noise (http://en.wikipedia.org/wiki/Perlin_noise) to navigate their World. Below is an example.

        Flora.System.start(function() {
          new Flora.Walker();
        });

#### Targets

In the Mover example above, the Mover targeted the mouse. By saving a reference to a new Walker and passing at as a 'target' for a new Mover, we can make the Mover seek the Walker.

        Flora.System.start(function() {
          var walker = new Flora.Walker();
          new Flora.Mover({
            target: walker
          });
        });

#### Flocking

Movers can also organize in flocks. The following properties affect flocking behavior.

* flocking {boolean} default: false
* desiredSeparation {number} default: width * 2
* separateStrength {number} default: 0.3
* alignStrength {number} default: 0.2
* cohesionStrength {number} default: 0.1

In the example below, we create 20 Movers and set their target to the Walker. We also set 'flocking' to true to enable the flocking behavior.

        Flora.System.start(function() {
          var i, walker = new Flora.Walker();
          for (i = 0; i < 20; i += 1) {
            new Flora.Mover({
              target: walker,
              flocking: true
            });
          }
        });

In the example below, Movers flock to the mouse. We've also adjusted the 'width' and 'height' properties.

        Flora.System.start(function() {
          for (i = 0; i < 20; i += 1) {
            new Flora.Mover({
              followMouse: true,
              flocking: true,
              width: 20,
              height: 5
            });
          }
        });

#### More to come

I'll post more examples soon. You can see the examples above in action at http://www.florajs.com/examples. You can also find full documentation at http://www.florajs.com/docs.

