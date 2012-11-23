# FloraJS: a JavaScript framework for rendering natural systems in a web browser.

In Flora, the 'world' is your web browser. DOM elements inhabit the world and behave according to rules meant to simulate a natural environment. You can find demos at http://www.florajs.com.

The formulas driving a large part of Flora are adapted from Daniel Shiffman's 'The Nature of Code' at http://natureofcode.com. Inspiration also came from the writings of Valentino Braitenberg and Gary Flake.

## Simple System

To setup a simple Flora system, reference the Flora .js file from a script tag in the &lt;head&gt; of your document. Also, reference the flora.css file.

In the body, add a &lt;script&gt; tag and create a new Flora system. Pass the system a function that describes the elements in your world.

The following is taken from examples/simple.html.

```html
<!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link rel="stylesheet" href="css/flora.css" type="text/css" charset="utf-8">
    <script src="js/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      // start the system; pass initial instuctions
      Flora.System.start(function() {
        new Flora.Agent();
      });
    </script>
  </body>
</html>
```

You should see a block fall and bounce off the bottom of your browser window.

http://www.florajs.com/examples/simple.html

#### The Universe and its Worlds

Every Flora system starts with one Universe and one World. While a universe may have many Worlds, by default, Flora's system uses the &lt;body&gt; as the only World.

In the example above, immediately after the system starts, a Agent is created and appended to the World (or &lt;body&gt;).

Worlds carry two properties that directly affect their elements.

* gravity {Vector} default: new Vector(0, 1)
* c (coefficient of friction) {number} 0.01

We can change these defaults after the system starts via the Universe's update() method.

        Flora.System.start(function() {
          Flora.universe.update({
            gravity: new Flora.Vector(0, -1),
            c: 0.75
          });
          new Flora.Agent();
        });

We've reversed the World's gravity and increased its friction. Now the block slowly drifts upwards.

http://www.florajs.com/examples/universe_update.html

#### Agents

Agents are basic Flora elements that respond to forces like gravity, attraction, repulsion, etc. They can also chase after other Agents, organize with other Agents in a flocking behavior, and steer away from obstacles.

All other Flora elements like Walkers and Oscillators inherit properties from Agents.

Agents are highly configurable. For a complete list of options see the docs at http://www.florajs.com/docs.

For an example of the Agent's seek behavior, set 'followMouse' to 'true' when creating the Agent.

        Flora.System.start(function() {
          new Flora.Agent({
            followMouse: true
          });
        });


http://www.florajs.com/examples/agent_follow_mouse.html

#### Walkers

Walkers are a step down on the evolutionary chain from Agents. They have no seeking, steering or directional behavior and just randomly explore their World. Use Walkers to create wandering objects or targets for Agents to seek.

Walkers carry two properties that directly affect how they 'walk'.

* isPerlin {boolean} default: true
* isRandom {boolean} default: false

By default, Walkers use an algorithm called Perlin Noise (http://en.wikipedia.org/wiki/Perlin_noise) to navigate their World. Below is an example.

        Flora.System.start(function() {
          new Flora.Walker();
        });


http://www.florajs.com/examples/walker.html

#### Targets

In the Agent example above, the Agent targeted the mouse. By saving a reference to a new Walker and passing at as a 'seekTarget' for a new Agent, we can make the Agent seek the Walker.

        Flora.System.start(function() {
          var walker = new Flora.Walker();
          new Flora.Agent({
            seekTarget: walker
          });
        });


http://www.florajs.com/examples/agent_seeks_walker.html

#### Flocking

Agents can also organize in flocks. The following properties affect flocking behavior.

* flocking {boolean} default: false
* desiredSeparation {number} default: width * 2
* separateStrength {number} default: 0.3
* alignStrength {number} default: 0.2
* cohesionStrength {number} default: 0.1

In the example below, we create 20 Agents and set their 'seekTarget' to the Walker. We also set 'flocking' to true to enable the flocking behavior.

        Flora.System.start(function() {
          var i, walker = new Flora.Walker();
          for (i = 0; i < 20; i += 1) {
            new Flora.Agent({
              seekTarget: walker,
              flocking: true
            });
          }
        });

http://www.florajs.com/examples/agents_flock_to_walker.html

In the example below, Agents flock to the mouse. We've also adjusted the 'width' and 'height' properties.

        Flora.System.start(function() {
          for (i = 0; i < 20; i += 1) {
            new Flora.Agent({
              followMouse: true,
              flocking: true,
              width: 20,
              height: 15
            });
          }
        });


http://www.florajs.com/examples/agents_flock_to_mouse.html

#### Proximity

FloraJS has some built in Proximity objects that exert a force on Agents that come in direct contact or land within the object's range of influence.

* Liquid
* Attractor
* Repeller

In the example below, we create a Liquid object and an Agent that follows the mouse. You can click and drag to place the Liquid anywhere in the World. Use your mouse to make the Agent pass through the Liquid.

        Flora.System.start(function() {
          new Flora.Agent({
            followMouse: true
          });
          new Flora.Liquid({
            draggable: true
          });
        });

You can replace 'Liquid' with 'Attractor' and 'Repeller' to view how the Proximity objects affect an Agent.

http://www.florajs.com/examples/liquid.html

#### Sensors and Stimuli

Agents can carry an unlimited amount of Sensors that react to Flora's Stimulus objects. The following Stimulus objects are available:

* Cold
* Heat
* Food
* Light
* Oxygen
* Predator

Sensors are tuned specifically to a Stimulant and can be configured to activate a specific behavior. The following behaviors are available:

* ACCELERATE
* DECELERATE
* AGGRESSIVE
* COWARD
* LIKES
* LOVES
* EXPLORER
* RUN

In the example below, the Agent carries a Sensor that senses Heat. When activated, it triggers the 'COWARD' behavior.

        Flora.System.start(function () {

          var universe = Flora.universe.first(),
              uw = universe.width,
              uh = universe.height;

          universe.update({
            gravity: new Flora.Vector()
          });

          var heat1 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.75, uh * 0.75)
          });

          var sensor = new exports.Sensor({
            type: 'heat',
            behavior: 'COWARD'
          });

          new Flora.Agent({
            sensors: [sensor],
            velocity: new Flora.Vector(1, 0.5),
            maxSpeed: 5,
            motorSpeed: 10
          });
        });

Notice, we've updated the World and removed any gravitational forces. We've also updated the 'motorSpeed' property to give the Agent a constant velocity. You should see the Agent navigate the World and avoid the Heat objects.

http://www.florajs.com/examples/sensor.html

#### A small World

Putting it all together, we can observe Agents navigate a World with multiple Stimuli and Proximity objects.

        Flora.System.start(function () {

          var universe = Flora.universe.first(),
              uw = universe.width,
              uh = universe.height;

          universe.update({
            gravity: new Flora.Vector()
          });

          var heat1 = new Flora.Heat({
            locati
            on: new Flora.Vector(uw * 0.25, uh * 0.15)
          });

          var heat2 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.85, uh * 0.15)
          });

          var heat3 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.85, uh * 0.85)
          });

          var heat4 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.15, uh * 0.75)
          });

          var cold = new Flora.Cold({
            location: new Flora.Vector(uw * 0.5, uh * 0.5)
          });

          var liquid1 = new Flora.Liquid({
            location: new Flora.Vector(uw * 0.45, uh * 0.8)
          });

          var liquid2 = new Flora.Liquid({
            location: new Flora.Vector(uw * 0.65, uh * 0.2)
          });

          var i, agent, sensorHeat, sensorCold;

          for (i = 0; i < 5; i += 1) {

            sensorHeat = new exports.Sensor({
              type: 'heat',
              behavior: 'COWARD'
            });

            sensorCold = new exports.Sensor({
              type: 'cold',
              behavior: 'ACCELERATE'
            });

            agent = new Flora.Agent({
              sensors: [sensorHeat, sensorCold],
              velocity: new Flora.Vector(Flora.Utils.getRandomNumber(-1, 1, true),
                  Flora.Utils.getRandomNumber(-1, 1, true)),
              motorSpeed: 4
            });
          }
        });


http://www.florajs.com/examples/sensor_stimuli.html

#### Camera

In the above example, we have a fixed, third-person perspective of our World. But Flora can also provide a first-person perspective from the point of view of an Agent. Setting 'controlCamera' to 'true' on an agent will force Flora's camera to track that agent. Of course, there can only be one agent controlling the World's Camera.

        Flora.System.start(function () {

          var universe = Flora.universe.first(),
              windowSize = Flora.Utils.getWindowSize(),
              uw, uh;

          universe.update({
            gravity: new Flora.Vector(),
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: [100, 100, 100],
            width: windowSize.width * 1.5,
            height: windowSize.height * 1.5
          });

          uw = universe.width;
          uh = universe.height;

          var heat1 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.25, uh * 0.15)
          });

          var heat2 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.85, uh * 0.15)
          });

          var heat3 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.85, uh * 0.85)
          });

          var heat4 = new Flora.Heat({
            location: new Flora.Vector(uw * 0.15, uh * 0.75)
          });

          var cold = new Flora.Cold({
            location: new Flora.Vector(uw * 0.5, uh * 0.5)
          });

          var liquid1 = new Flora.Liquid({
            location: new Flora.Vector(uw * 0.45, uh * 0.8)
          });

          var liquid2 = new Flora.Liquid({
            location: new Flora.Vector(uw * 0.65, uh * 0.2)
          });

          var i, agent, sensorHeat, sensorCold;

          for (i = 0; i < 5; i += 1) {

            sensorHeat = new exports.Sensor({
              type: 'heat',
              behavior: 'COWARD'
            });

            sensorCold = new exports.Sensor({
              type: 'cold',
              behavior: 'ACCELERATE'
            });

            agent = new Flora.Agent({
              sensors: [sensorHeat, sensorCold],
              velocity: new Flora.Vector(Flora.Utils.getRandomNumber(-1, 1, true),
                  Flora.Utils.getRandomNumber(-1, 1, true)),
              motorSpeed: 4,
              minSpeed: 1,
              controlCamera: !i,
              color: !i ? [255, 100, 0] : null
            });
          }

          var caption = new Flora.Caption({
            text: 'Sensor, Stimuli and Proximity Objects',
            opacity: 0.4,
            borderColor: 'transparent',
            position: 'top center'
          });

          var inputMenu = new Flora.InputMenu({
            opacity: 0.4,
            borderColor: 'transparent',
            position: 'bottom center'
          });
        });

http://www.florajs.com/examples/camera.html

#### DOM Renderer

You can think of FloraJS as having two major components, a set of classes for elements in a natural system, and a renderer to draw those elements to the DOM. If you want to drop the Flora classes and use your own, you can still use the FloraJS DOM renderer to render your system.

For example, in the 'build' folder, you'll find 'floraDOM.js'. Reference this file instead of the latest FloraJS build in the &lt;head&gt; of your document.

```html
<!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link rel="stylesheet" href="css/flora.css" type="text/css" charset="utf-8">
    <style type='text/css'>
      .ball {
        background: rgb(197, 150, 200);
        border-color: rgb(255, 255, 255);
        border-width: 0.25em;
        border-style: solid;
        border-radius: 100%;
      }
    </style>
    <script src="js/floraDOM.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      function Ball(world, opt_options) {

        var options = opt_options || {},
            world = Flora.universe.first();

        // You must call Flora.Element
        Flora.Element.call(this, options);

        this.acceleration = new Flora.Vector(0, 0.1);
        this.velocity = new Flora.Vector();
        this.location = new Flora.Vector(world.width/2, 0);
      }
      // You must extend Flora.Element
      exports.Utils.extend(Ball, Flora.Element);

      Ball.prototype.name = 'Ball';

      // You must include a step function
      Ball.prototype.step = function() {

        var world = Flora.universe.first();

        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);

        if (this.location.y + this.height/2 > world.height) {
          this.velocity.mult(-0.75);
          this.location.y = world.height - this.height/2;
        }

      };

      Flora.System.start(function() {
        new Ball();
      });
    </script>
  </body>
</html>
```

In the example above, we've created a simple Ball class that falls from the top of the browser and bounces off the bottom. For your own classes to work correctly, you must extend Flora's 'Element' class and call Element inside your constructor. To update your instance's properties, you must include a 'step' function.

http://www.florajs.com/examples/dom.html

#### More to come

I'll post more examples soon. You can see the examples above in action at http://www.florajs.com/examples. You can also find full documentation at http://www.florajs.com/docs.

#### Advanced exmaples

The following examples implement advanced functions of FloraJS.

* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle3c_VALUES.html'>Values</a>
* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle3b_EXPLORER.html'>Explorer</a>
* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle3a_LOVES.html'>Loves</a>
* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle2b_AGGRESSIVE.html'>Aggressive</a>
* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle2a_COWARD.html'>Coward</a>
* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle1_ALIVE.html'>Alive</a>

* Flocking - <a href='http://www.florajs.com/demos/flap.html'>Flap</a>

* Particles - <a href='http://www.florajs.com/demos/particles1_CURIOUS.html'>Curious</a>
* Particles - <a href='http://www.florajs.com/demos/particles2_SMOTHER.html'>Smother</a>
* Particles - <a href='http://www.florajs.com/demos/particles3_FLIRT.html'>Flirt</a>

#### History

0.0.2
* added feature detection
* added Universe.clearWorld(id) to remove all elements from a World
* separated Agent and Element properties
* changed Agent.target to Agent.seekTarget
* bug fixes in Vector class w midpoint()
* added static methods in Vector class and updated docs
* camel casing class 'name' property
* updated tests

0.0.3
* separate build for the DOM rendering components of the framework (floraDOM.js)
* added indicator in stats if browser supports 3d transforms

