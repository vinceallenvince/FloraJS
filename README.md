# FloraJS: a JavaScript framework for rendering natural systems in a web browser.

In Flora, the 'world' is your web browser. DOM elements inhabit the world and behave according to rules meant to simulate a natural environment. You can find demos at http://vinceallenvince.github.io/FloraJS.

The formulas driving a large part of Flora are adapted from Daniel Shiffman's ['The Nature of Code'](http://natureofcode.com). Inspiration also came from the writings of Valentino Braitenberg and Gary Flake.

## Install

To include FloraJS as a component in your project, use the node module.

```
npm install florajs --save
```

You can also use the [standalone version](https://github.com/vinceallenvince/FloraJS/releases/latest) and reference both the css and js files from your document.

```
<html>
  <head>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  ...
```


#### Simple System

1. Pass Flora.System.setup() a function that describes the items in your world.
2. The first item must be a World. (eg. this.add('World'))
3. Call Flora.System.loop() to start the animation.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        this.add('World');
        this.add('Agent');
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

You should see a block fall and bounce off the bottom of your browser window.

http://vinceallenvince.github.io/FloraJS/Flora.Agent.html

#### The System and its Worlds

Every Flora system starts with one System and one World. While a System may have many Worlds, by default, Flora's system uses the &lt;body&gt; as the only World.

In the example above, immediately after the system starts, it creates an Agent and appends it to the World (or &lt;body&gt;).

Worlds carry two properties that directly affect their elements.

* gravity {Vector} default: new Vector(0, 1)
* c (coefficient of friction) {number} 0.01

We can change these defaults by passing options when we add the world.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        this.add('World', {
          gravity: new Flora.Vector(0, -1)
        });
        this.add('Agent');
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

We've reversed the World's gravity and increased its friction. Now the block slowly drifts upwards.

http://vinceallenvince.github.io/FloraJS/Flora.WorldProperties.html

#### Agents

Agents are basic Flora elements that respond to forces like gravity, attraction, repulsion, etc. They can also chase after other Agents, organize with other Agents in a flocking behavior, and steer away from obstacles.

Agents are highly configurable. For a complete list of options see the docs at http://vinceallenvince.github.io/FloraJS/docs/symbols/Agent.html

For an example of the Agent's seek behavior, set 'followMouse' to 'true' when creating the Agent.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        this.add('World', {
          gravity: new Flora.Vector(),
          c: 0
        });
        this.add('Agent', {
          followMouse: true
        });
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/Flora.Agent.FollowMouse.html

#### Walkers

Walkers are a step down on the evolutionary chain from Agents. They have no seeking, steering or directional behavior and just randomly explore their World. Use Walkers to create wandering objects or targets for Agents to seek.

Walkers carry two properties that directly affect how they 'walk'.

* isPerlin {boolean} default: true
* isRandom {boolean} default: false

By default, Walkers use an algorithm called Perlin Noise (http://en.wikipedia.org/wiki/Perlin_noise) to navigate their World. Below is an example.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        this.add('World', {
          gravity: new Flora.Vector(),
          c: 0
        });
        for (var i = 0; i < 60; i++) {
          this.add('Walker');
        }
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/Flora.Walker.Perlin.html

#### Targets

In the Agent example above, the Agent targeted the mouse. By saving a reference to a new Walker and passing at as a 'seekTarget' for a new Agent, we can make the Agent seek the Walker.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        this.add('World', {
          gravity: new Flora.Vector(),
          c: 0
        });

        var walker = this.add('Walker');

        this.add('Agent', {
          seekTarget: walker
        });
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/Flora.Agent.SeekWalker.html

#### Flocking

Agents can also organize in flocks. The following properties affect flocking behavior.

* flocking {boolean} default: false
* desiredSeparation {number} default: width * 2
* separateStrength {number} default: 0.3
* alignStrength {number} default: 0.2
* cohesionStrength {number} default: 0.1

In the example below, we create two groups of Agents and set their 'seekTarget' to Walkers. We also set 'flocking' to true to enable the flocking behavior.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      var i, totalGroupA = 10,
          totalGroupB = 5;

      Flora.System.setup(function() {
        this.add('World', {
          gravity: new Flora.Vector(),
          c: 0
        });

        var walkerGroupA = this.add('Walker');

        for (i = 0; i < totalGroupA; i ++) {
          this.add('Agent', {
            flocking: true,
            seekTarget: walkerGroupA
          });
        }

        var walkerGroupB = this.add('Walker');

        for (i = 0; i < totalGroupB; i ++) {
          this.add('Agent', {
            flocking: true,
            seekTarget: walkerGroupB
          });
        }
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/Flora.Agent.Flocking.html

In the example below, Agents flock to the mouse. We've also adjusted the 'width' and 'height' properties.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        var world = this.add('World', {
          gravity: new Flora.Vector()
        });

        for (var i = 0; i < 20; i++) {
          this.add('Agent', {
            followMouse: true,
            flocking: true
          });
        }
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/FlockToMouse.html

#### Proximity

FloraJS has some built in Proximity objects that exert a force on Agents that come in direct contact or land within the object's range of influence.

* Dragger
* Attractor
* Repeller

In the example below, we create a Dragger object and an Agent that follows the mouse. You can click and drag to place the Dragger anywhere in the World. Use your mouse to make the Agent pass through the Dragger.


```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        this.add('World');
        this.add('Agent', {
          location: new Flora.Vector(document.body.scrollWidth / 2, 20)
        });
        this.add('Dragger', {
          draggable: true
        });
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

You can replace 'Dragger' with 'Attractor' or 'Repeller' to view how the Proximity objects affect an Agent.

http://vinceallenvince.github.io/FloraJS/Flora.Dragger.html

#### Sensors and Stimuli

Agents can carry an unlimited amount of Sensors that react to Flora's Stimulus types. The following Stimulus types are available:

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

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        var world = this.add('World', {
          gravity: new Flora.Vector(),
          c: 0
        });

        this.add('Agent', {
          angle: 90,
          motorSpeed: 2,
          minSpeed: 1,
          maxSpeed: 10,
          width: 20,
          height: 20,
          location: new Flora.Vector(world.width * 0.49, 0),
          sensors: [
            this.add('Sensor', {
              type: 'heat',
              displayRange: true,
              displayConnector: true,
              behavior: 'COWARD'
            })
          ]
        }, world);

        this.add('Stimulus', {
          type: 'heat',
          draggable: true
        });
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

Notice, we've updated the World and removed any gravitational forces. We've also updated the 'motorSpeed' property to give the Agent a constant velocity. You should see the Agent navigate the World and avoid the Heat objects.

http://vinceallenvince.github.io/FloraJS/Flora.Sensor.Coward.html

#### A Small World

Putting it all together, we can observe Agents navigate a World with multiple Stimuli and Proximity objects.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      var rand = Flora.Utils.getRandomNumber;

      Flora.System.setup(function() {
        var world = this.add('World', {
          gravity: new Flora.Vector(),
          c: 0,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: [100, 100, 100]
        });

        this.add('Agent', {
          controlCamera: false,
          angle: rand(0, 360),
          motorSpeed: 2,
          minSpeed: 1,
          maxSpeed: 10,
          width: 20,
          height: 20,
          wrapWorldEdges: true,
          location: new Flora.Vector(world.width * 0.5, world.height * 0.5),
          sensors: [
            this.add('Sensor', {
              type: 'heat',
              displayRange: true,
              displayConnector: true,
              sensitivity: 100,
              behavior: 'EXPLORER'
            }),
            this.add('Sensor', {
              type: 'cold',
              displayRange: true,
              displayConnector: true,
              sensitivity: 150,
              behavior: 'CURIOUS',
              opacity: 0
            }),
            this.add('Sensor', {
              type: 'food',
              displayRange: true,
              displayConnector: true,
              sensitivity: 250,
              behavior: 'ACCELERATE',
              opacity: 0
            }),
            this.add('Sensor', {
              type: 'light',
              displayRange: true,
              displayConnector: true,
              sensitivity: 80,
              behavior: 'DECELERATE',
              opacity: 0
            }),
            this.add('Sensor', {
              type: 'oxygen',
              displayRange: true,
              displayConnector: true,
              sensitivity: 50,
              behavior: 'COWARD',
              opacity: 0
            })
          ]
        }, world);

        for (var i = 0; i < 3; i++) {
          this.add('Stimulus', {
            type: 'heat',
            location: new Flora.Vector(rand(0, world.width), rand(0, world.height))
          });
        }

        for (var i = 0; i < 3; i++) {
          this.add('Stimulus', {
            type: 'cold',
            location: new Flora.Vector(rand(0, world.width * 0.25), rand(0, world.height))
          });
        }

        for (var i = 0; i < 3; i++) {
          this.add('Stimulus', {
            type: 'food',
            location: new Flora.Vector(rand(world.width * 0.75, world.width), rand(0, world.height))
          });
        }

        for (var i = 0; i < 3; i++) {
          this.add('Stimulus', {
            type: 'light',
            location: new Flora.Vector(rand(0, world.width), rand(0, world.height * 0.25))
          });
        }

        for (var i = 0; i < 3; i++) {
          this.add('Stimulus', {
            type: 'oxygen',
            location: new Flora.Vector(rand(0, world.width), rand(world.height * 0.75, world.height))
          });
        }
      });
      Flora.System.loop();

    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/Flora.Sim.MultipleStimuli.html

#### Camera

In the above example, we have a fixed, third-person perspective of our World. But Flora can also provide a first-person perspective from the point of view of an Agent. Setting 'controlCamera' to 'true' on an agent will force Flora's camera to track that agent. Of course, there can only be one agent controlling the world's camera.

    ...
    this.add('Agent', {
      controlCamera: true,
    ...

http://vinceallenvince.github.io/FloraJS/

#### Your own worlds

Flora allows you to define worlds using any DOM element. This is useful if you want your world to live alongside other DOM elements or simply do not want the entire body defined as a world.

To define a world, just create the DOM element you want to represent the world and reference it when calling new Burner.World().

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>Flora</title>
    <link href="css/flora.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      Flora.System.setup(function() {
        this.add('World', {
          el: document.getElementById('world'),
          width: 800,
          height: 600,
          borderWidth: 1,
          borderStyle: 'dotted',
          borderColor: [100, 100, 100]
        });

        this.add('Agent');
      });
      Flora.System.loop();
    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/Flora.WorldDOM.html

#### Multiple worlds

Flora also supports multiple worlds... here's an example.

```html
<!DOCTYPE html>
<html>
  <head>
  <title>FloraJS | Simulate natural systems with JavaScript</title>
  <link rel="stylesheet" href="css/flora.min.css" type="text/css" charset="utf-8" />
  <script src="scripts/flora.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <div id='worldA'></div>
    <div id='worldB'></div>
    <div id='worldC'></div>
    <script type="text/javascript" charset="utf-8">

      Flora.System.init(function() {

        var worldA = this.add('World', {
          el: document.getElementById('worldA'),
          width: 320,
          height: 480,
          color: [60, 60, 60],
          gravity: new Flora.Vector(),
          c: 0,
          location: new Flora.Vector(160, 240)
        });

        var worldB = this.add('World', {
          el: document.getElementById('worldB'),
          width: 320,
          height: 480,
          color: [60, 60, 60],
          gravity: new Flora.Vector(),
          c: 0,
          location: new Flora.Vector(490, 240)
        });

        var worldC = this.add('World', {
          el: document.getElementById('worldC'),
          width: 320,
          height: 480,
          color: [60, 60, 60],
          gravity: new Flora.Vector(),
          c: 0,
          location: new Flora.Vector(820, 240)
        });

        this.add('ParticleSystem', {
          startColor: [255, 255, 255],
          particleOptions: {
            maxSpeed: 3
          }
        }, worldA);

        for (var i = 0; i < 10; i++) {
          this.add('Walker', null, worldB);
        }

        for (var i = 0; i < 10; i++) {
          var size = Flora.Utils.getRandomNumber(5, 30);
          this.add('Agent', {
            width: size,
            height: size,
            mass: size,
            followMouse: true,
            flocking: true
          }, worldC);
        }
      });
      Flora.System.loop();
    </script>
  </body>
</html>
```

http://vinceallenvince.github.io/FloraJS/Flora.WorldsMultiple.html

#### Advanced exmaples

The following examples implement advanced functions of FloraJS.

* [Sheep vs. Wolves](http://vinceallenvince.github.io/FloraJS/Flora.Sim.SheepvsWolves.html)
* [Fish Food](http://vinceallenvince.github.io/FloraJS/Flora.FishFood.html)


Building this project
------

This project uses [Grunt](http://gruntjs.com). To build the project first install the node modules.

```
npm install
```

Next, run grunt.

```
grunt
```

To run the tests, run 'npm test'.

```
npm test
```

To check test coverage run 'grunt coverage'.

```
grunt coverage
```

A pre-commit hook is defined in /pre-commit that runs jshint. To use the hook, run the following:

```
ln -s ../../pre-commit .git/hooks/pre-commit
```

A post-commit hook is defined in /post-commit that runs the Plato complexity analysis tools. To use the hook, run the following:

```
ln -s ../../post-commit .git/hooks/post-commit
```

