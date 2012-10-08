# FloraJS: a JavaScript framework for rendering natural systems in a web browser.

FloraJS is a JavaScript framework for exploring natural systems simulation. In Flora, the "world" is your web browser. DOM elements inhabit the world and behave according to rules meant to simulate a natural environment.

The formulas driving a large part of Flora are taken from Daniel Shiffman's 'The Nature of Code' at https://github.com/shiffman/The-Nature-of-Code. Inspiration also came from the writings of Valentino Braitenberg and Gary Flake.

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

- World
- Mover
- Follow mouse
- Walker
- Mover follows Walker
- Movers flock toward Walker
- Movers flock around mouse


