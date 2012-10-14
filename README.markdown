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
        new Flora.Agent();
      });
    </script>
  </body>
</html>
```

You should see a block fall and bounce off the bottom of your browser window.

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

#### Walkers

Walkers are a step down on the evolutionary chain from Agents. They have no seeking, steering or directional behavior and just randomly explore their World. Use Walkers to create wandering objects or targets for Agents to seek.

Walkers carry two properties that directly affect how they 'walk'.

* isPerlin {boolean} default: true
* isRandom {boolean} default: false

By default, Walkers use an algorithm called Perlin Noise (http://en.wikipedia.org/wiki/Perlin_noise) to navigate their World. Below is an example.

        Flora.System.start(function() {
          new Flora.Walker();
        });

#### Targets

In the Agent example above, the Agent targeted the mouse. By saving a reference to a new Walker and passing at as a 'target' for a new Agent, we can make the Agent seek the Walker.

        Flora.System.start(function() {
          var walker = new Flora.Walker();
          new Flora.Agent({
            target: walker
          });
        });

#### Flocking

Agents can also organize in flocks. The following properties affect flocking behavior.

* flocking {boolean} default: false
* desiredSeparation {number} default: width * 2
* separateStrength {number} default: 0.3
* alignStrength {number} default: 0.2
* cohesionStrength {number} default: 0.1

In the example below, we create 20 Agents and set their target to the Walker. We also set 'flocking' to true to enable the flocking behavior.

        Flora.System.start(function() {
          var i, walker = new Flora.Walker();
          for (i = 0; i < 20; i += 1) {
            new Flora.Agent({
              target: walker,
              flocking: true
            });
          }
        });

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

#### More to come

I'll post more examples soon. You can see the examples above in action at http://www.florajs.com/examples. You can also find full documentation at http://www.florajs.com/docs.

