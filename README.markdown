# Flora: a JavaScript framework for rendering natural systems in a web browser.

FloraJS is a JavaScript framework I built to explore natural systems simulation. In Flora, the "world" is your web browser. DOM elements inhabit the world and behave according to rules meant to simulate a natural environment.

You can see examples at http://www.florajs.com

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
              var system = new exports.FloraSystem();

              // start the system; pass initial instuctions
              system.start(function () {
                new Flora.Mover();
              });
            </script>
          </body>
        </html>