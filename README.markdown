# FloraJS: a JavaScript framework for rendering natural systems in a web browser.

FloraJS is a JavaScript framework for exploring natural systems simulation. In Flora, the "world" is your web browser. DOM elements inhabit the world and behave according to rules meant to simulate a natural environment.

The formulas driving a large part of Flora are adapted from Daniel Shiffman's 'The Nature of Code' at https://github.com/shiffman/The-Nature-of-Code. Inspiration also came from the writings of Valentino Braitenberg and Gary Flake.

## Simple System

To setup a simple Flora system, reference the Flora .js file and the latest version of Modernizr from two script tags in the &lt;head&gt; of your document. Also, reference in the flora.css file.

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

      // create a new system
      var system = new exports.System();

      // start the system; pass initial instuctions
      system.start(function () {
        new Flora.Mover();
      });
    </script>
  </body>
</html>
```

You should see a block fall and bounce off the bottom of your browser window.

#### The Universe and its Worlds

Every Flora system starts with one universe and one world. While a universe may have many worlds, by default, Flora's system uses the &lt;body&gt; as the only world.

In the example above, immediately after the system starts, a Mover is created and appended to the world (or &lt;body&gt;).

Worlds carry two properties that directly affect their elements.

* gravity {Vector} default: new Vector(0, 1)
* c (coefficient of friction) {number} 0.01

We can change these defaults after the system starts via the universe's update() method.

        system.start(function () {
          Flora.universe.update({
            gravity: new Flora.Vector(0, -1),
            c: 0.75
          });
          new Flora.Mover();
        });

We've reversed the world's gravity and increased its friction. Now the block slowly drifts upwards.

#### Movers

Movers are basic Flora elements that respond to forces like gravity, attraction, repulsion, etc. They can also chase after other Movers, organize with other Movers in a flocking behavior, and steer away from obstacles.

All other Flora elements like Walkers and Oscillators inherit properties from Movers.

Movers are highly configurable. For a complete list of options see the docs at http://www.florajs.com/docs

For an example of the Mover's seek behavior, set 'followMouse' to 'true' when creating the Mover.

        system.start(function () {
          new Flora.Mover({
            followMouse: true
          });
        });


- Walker
- Mover follows Walker
- Movers flock toward Walker
- Movers flock around mouse


