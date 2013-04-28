# FloraJS: a JavaScript framework for rendering natural systems in a web browser.

In Flora, the 'world' is your web browser. DOM elements inhabit the world and behave according to rules meant to simulate a natural environment. You can find demos at http://www.florajs.com.

The formulas driving a large part of Flora are adapted from Daniel Shiffman's 'The Nature of Code' at http://natureofcode.com. Inspiration also came from the writings of Valentino Braitenberg and Gary Flake.

## Simple System

FloraJS has two major components, a set of classes for elements in a natural system, and a renderer called <a href='http://github.com/foldi/Burner'>Burner</a> to draw those elements to the DOM.

To setup a simple Flora system, reference the <a href='http://github.com/foldi/Burner/tree/master/build'>Burner</a> and <a href='http://github.com/foldi/FloraJS/tree/master/build'>Flora</a> .js files from script tags in the &lt;head&gt; of your document. Also, reference the flora.css and burner.css files in link tags.

In the body, add a &lt;script&gt; tag and create a new system. Pass the system a function that describes the elements in your world.

```html
<!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link rel="stylesheet" href="css/burner.min.css" type="text/css" charset="utf-8">
    <link rel="stylesheet" href="css/flora.min.css" type="text/css" charset="utf-8">
    <script src="js/burner.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      // start the system; pass initial instuctions
      Flora.Burner.System.create(function() {
        this.add('Agent');
      });
    </script>
  </body>
</html>
```

You should see a block fall and bounce off the bottom of your browser window.

http://www.florajs.com/examples/simple.html

#### The System and its Worlds

Every Flora system starts with one System and one World. While a System may have many Worlds, by default, Flora's system uses the &lt;body&gt; as the only World.

In the example above, immediately after the system starts, a Agent is created and appended to the World (or &lt;body&gt;).

Worlds carry two properties that directly affect their elements.

* gravity {Vector} default: new Vector(0, 1)
* c (coefficient of friction) {number} 0.01

We can change these defaults after the system starts via the World's update() method.

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(0, -1),
          c: 0.75
        });

        this.add('Agent');
      });

We've reversed the World's gravity and increased its friction. Now the block slowly drifts upwards.

http://www.florajs.com/examples/world_update.html

#### Agents

Agents are basic Flora elements that respond to forces like gravity, attraction, repulsion, etc. They can also chase after other Agents, organize with other Agents in a flocking behavior, and steer away from obstacles.

All other Flora elements like Walkers and Oscillators inherit properties from Agents.

Agents are highly configurable. For a complete list of options see the docs at http://www.florajs.com/docs/symbols/Agent.html

For an example of the Agent's seek behavior, set 'followMouse' to 'true' when creating the Agent.

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(),
          c: 0
        });

        this.add('Agent', {
          followMouse: true
        });
      });


http://www.florajs.com/examples/agent_follows_mouse.html

#### Walkers

Walkers are a step down on the evolutionary chain from Agents. They have no seeking, steering or directional behavior and just randomly explore their World. Use Walkers to create wandering objects or targets for Agents to seek.

Walkers carry two properties that directly affect how they 'walk'.

* isPerlin {boolean} default: true
* isRandom {boolean} default: false

By default, Walkers use an algorithm called Perlin Noise (http://en.wikipedia.org/wiki/Perlin_noise) to navigate their World. Below is an example.

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(),
          c: 0
        });

        this.add('Walker');
      });


http://www.florajs.com/examples/walker.html

#### Targets

In the Agent example above, the Agent targeted the mouse. By saving a reference to a new Walker and passing at as a 'seekTarget' for a new Agent, we can make the Agent seek the Walker.

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(),
          c: 0
        });

        this.add('Agent', {
          seekTarget: this.add('Walker')
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

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(),
          c: 0
        });

        var walker = this.add('Walker');

        for (var i = 0; i < 20; i++) {
          this.add('Agent', {
            seekTarget: walker,
            flocking: true
          });
        }
      });

http://www.florajs.com/examples/agents_flock_to_walker.html

In the example below, Agents flock to the mouse. We've also adjusted the 'width' and 'height' properties.

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(),
          c: 0
        });

        for (var i = 0; i < 10; i++) {
          this.add('Agent', {
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

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(),
          c: 0
        });

        this.add('Agent', {
          followMouse: true
        });

        this.add('Liquid', {
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

Sensors are tuned specifically to a Stimulant and can be configured to activate a specific behavior. The following behaviors are available:

* ACCELERATE
* DECELERATE
* AGGRESSIVE
* COWARD
* LIKES
* LOVES
* EXPLORER

In the example below, the Agent carries a Sensor that senses Heat. When activated, it triggers the 'COWARD' behavior.

      Flora.Burner.System.create(function() {

        Flora.Burner.World.update({
          gravity: new Flora.Vector(),
          c: 0
        });

        this.add('Heat', {
          draggable: true
        });

        this.add('Agent', {
          sensors: [
            this.add('Sensor', {
              type: 'heat',
              behavior: 'COWARD'
            })
          ],
          velocity: new Flora.Vector(1, 0.5),
          maxSpeed: 5,
          motorSpeed: 10
        });
      });

Notice, we've updated the World and removed any gravitational forces. We've also updated the 'motorSpeed' property to give the Agent a constant velocity. You should see the Agent navigate the World and avoid the Heat objects.

http://www.florajs.com/examples/sensor.html

#### A small World

Putting it all together, we can observe Agents navigate a World with multiple Stimuli and Proximity objects.

    Flora.Burner.System.create(function() {

      Flora.Burner.World.update({
        gravity: new Flora.Vector(),
        c: 0
      });

      this.add('Heat', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.25, this.world.bounds[2] * 0.15);
        }
      });

      this.add('Heat', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.85, this.world.bounds[2] * 0.15);
        }
      });

      this.add('Heat', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.85, this.world.bounds[2] * 0.85);
        }
      });

      this.add('Heat', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.15, this.world.bounds[2] * 0.75);
        }
      });

      this.add('Cold', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.5, this.world.bounds[2] * 0.5);
        }
      });

      this.add('Liquid', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.45, this.world.bounds[2] * 0.8);
        }
      });

      this.add('Liquid', {
        draggable: true,
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.65, this.world.bounds[2] * 0.2);
        }
      });

      this.add('Agent', {
        sensors: [
          this.add('Sensor', {
            type: 'heat',
            behavior: 'COWARD'
          }),
         this.add('Sensor', {
            type: 'cold',
            behavior: 'ACCELERATE'
          })
        ],
        velocity: new Flora.Vector(1, 0.5),
        minSpeed: 1,
        mass: 10,
        motorSpeed: 4
      });
    });


http://www.florajs.com/examples/sensor_stimuli.html

#### Camera

In the above example, we have a fixed, third-person perspective of our World. But Flora can also provide a first-person perspective from the point of view of an Agent. Setting 'controlCamera' to 'true' on an agent will force Flora's camera to track that agent. Of course, there can only be one agent controlling the World's Camera.

    Flora.Burner.System.create(function() {

      Flora.Burner.World.update({
        gravity: new Flora.Vector(),
        c: 0,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: [100, 100, 100]
      });

      this.add('Heat', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.25, this.world.bounds[2] * 0.15);
        }
      });

      this.add('Heat', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.85, this.world.bounds[2] * 0.15);
        }
      });

      this.add('Heat', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.85, this.world.bounds[2] * 0.85);
        }
      });

      this.add('Heat', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.15, this.world.bounds[2] * 0.75);
        }
      });

      this.add('Cold', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.5, this.world.bounds[2] * 0.5);
        }
      });

      this.add('Liquid', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.45, this.world.bounds[2] * 0.8);
        }
      });

      this.add('Liquid', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.65, this.world.bounds[2] * 0.2);
        }
      });

      for (var i = 0; i < 5; i += 1) {

        this.add('Agent', {
          sensors: [
            this.add('Sensor', {
              type: 'heat',
              behavior: 'COWARD'
            }),
           this.add('Sensor', {
              type: 'cold',
              behavior: 'ACCELERATE'
            })
          ],
          velocity: new Flora.Vector(Flora.Utils.getRandomNumber(-1, 1, true),
              Flora.Utils.getRandomNumber(-1, 1, true)),
          minSpeed: 1,
          mass: 10,
          motorSpeed: 4,
          wrapEdges: true,
          controlCamera: !i,
          color: !i ? [255, 100, 0] : [197, 177, 115]
        });
      }
    });

http://www.florajs.com/examples/camera.html

#### DOM Renderer

If you want to drop the Flora classes and use your own, use <a href='http://github.com/foldi/Burner'>Burner</a> to render your system.

#### Advanced exmaples

The following examples implement advanced functions of FloraJS.

* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle3c_VALUES.html'>Values</a>

* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle3b_EXPLORER.html'>Explorer</a>

* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle3a_LOVES.html'>Loves</a>

* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle2b_AGGRESSIVE.html'>Aggressive</a>

* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle2a_COWARD.html'>Coward</a>

* Braitenberg Vechicles - <a href='http://www.florajs.com/demos/braitenberg_vehicle1_ALIVE.html'>Alive</a>

* Flocking - <a href='http://www.florajs.com/demos/flap.html'>Flap</a>

* Flocking - <a href='http://www.florajs.com/demos/spin.html'>Spin</a>

* Flocking - <a href='http://www.florajs.com/demos/roll.html'>Roll</a>

#### More Code

You can find code for the examples above at:

* <a href='http://github.com/foldi/FloraJS-Examples'>Examples</a>

* <a href='http://github.com/foldi/FloraJS-Flocking'>Flocking</a>

* <a href='http://github.com/foldi/Braitenberg-Vehicles'>Braitenberg Vehicles</a>

