import Item from './item';
import World from './world';
import Vector from '../vector2d-lib';
import Utils from '../drawing-utils-lib';
import FPSDisplay from '../fpsdisplay';
import { getRenderer } from '../../renderer/index';

/**
 * The System runs the animation loop: it creates, recycles, steps
 * and draws every Item in every World.
 */
const System = {
  name: 'System',

  /**
   * Holds additional classes that can be defined at runtime.
   */
  Classes: {
    'Item': Item
  } as { [name: string]: any },

  /** Holds a vector describing the system gravity. */
  gravity: new Vector(0, 1),

  /** Holds a vector describing the system wind. */
  wind: new Vector(),

  /** Stores references to all items in the system. */
  _records: [] as any[],

  /** Stores references to all items removed from the system. */
  _pool: [] as any[],

  /**
   * Holds the current and last mouse/touch positions relative
   * to the browser window. Also, holds the current mouse velocity.
   */
  mouse: {
    location: new Vector(),
    lastLocation: new Vector(),
    velocity: new Vector()
  },

  /** Increments with each simulation step. */
  clock: 0,

  /**
   * Duration of one simulation step in ms. The loop runs the
   * simulation at this fixed rate regardless of display refresh
   * rate, so sims behave identically on 60Hz and 240Hz screens.
   */
  stepMs: 1000 / 60,

  /** Accumulates unsimulated time between animation frames. */
  _accumulator: 0,

  /** Timestamp of the previous animation frame. */
  _lastFrameTime: null as number | null,

  /** True once loop() has started the animation-frame chain. */
  _running: false,

  /**
   * System.loop() calls this function. Use to execute
   * a function in the animation loop outside of any items.
   */
  frameFunction: null as (() => void) | null,

  /** The setup callback, saved so the system can reset itself. */
  setupFunc: undefined as (() => void) | undefined,

  /**
   * Call to execute any setup code before starting the animation loop.
   * @param opt_func A function to run before the function exits.
   */
  setup(opt_func?: () => void): void {
    var func = opt_func || function() {};

    // Worlds observe their own elements via ResizeObserver (see
    // World._observeResize), which covers orientation changes too.

    // save the current and last mouse position
    Utils.addEvent(document, 'mousemove', System._recordMouseLoc);

    // save the current and last touch position
    Utils.addEvent(window, 'touchstart', System._recordMouseLoc);
    Utils.addEvent(window, 'touchmove', System._recordMouseLoc);
    Utils.addEvent(window, 'touchend', System._recordMouseLoc);

    // listen for key up
    Utils.addEvent(window, 'keyup', System._keyup);

    // save the setup callback in case we need to reset the system.
    System.setupFunc = func;

    System.setupFunc.call(this);
  },

  /**
   * Call to execute any setup code before starting the animation loop.
   * Note: Deprecated in v3. Use setup().
   */
  init(opt_func?: () => void): void {
    System.setup(opt_func);
  },

  /**
   * Adds world to System records.
   * @param world An instance of World.
   */
  _addWorld(world: World): void {
    System._records.push(world);
  },

  /**
   * Adds instances of class to _records and calls init on them.
   * @param opt_klass The name of the class to add.
   * @param opt_options A map of initial properties.
   * @param opt_world An instance of World to contain the item.
   * @returns An instance of the added item.
   */
  add(opt_klass?: string, opt_options?: { [key: string]: any }, opt_world?: World): any {
    var klass = opt_klass || 'Item',
        options = opt_options || {},
        world = opt_world || System.firstWorld(),
        records = System._records,
        obj;

    // recycle object if one is available; obj must be an instance of the same class
    for (var i = 0, max = System._pool.length; i < max; i++) {
      if (System._pool[i].name === klass) {
        obj = System._cleanObj(System._pool.splice(i, 1)[0]);
        break;
      }
    }

    if (!obj) {
      if (klass.toLowerCase() === 'world') {
        obj = new World(options);
      } else if (System.Classes[klass]) {
        obj = new System.Classes[klass](options);
      } else {
        obj = new Item();
      }
    }

    options.name = klass;
    obj.init(world, options);
    records.push(obj);
    return obj;
  },

  /**
   * Removes all properties from the passed object.
   * @param obj An object.
   * @returns The passed object.
   */
  _cleanObj(obj: { [key: string]: any }): any {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        delete obj[prop];
      }
    }
    return obj;
  },

  /**
   * Removes an item from the system.
   * @param obj The item to remove.
   */
  remove(obj: any): void {
    var i, max, records = System._records;

    for (i = 0, max = records.length; i < max; i++) {
      if (records[i].id === obj.id) {
        if (records[i].el) {
          records[i].el.style.visibility = 'hidden'; // hide item
        }
        System._pool[System._pool.length] = records.splice(i, 1)[0]; // move record to pool array
        break;
      }
    }
  },

  /**
   * Removes an item from the system.
   * Note: Deprecated in v3. Use remove().
   */
  destroy(obj: any): void {
    System.remove(obj);
  },

  /**
   * Starts the animation loop: a fixed-timestep simulation (stepMs per
   * step, with an accumulator) drawn once per animation frame. Also
   * runs one immediate step + draw so items appear without waiting for
   * the first frame, matching the pre-fixed-timestep behavior of a
   * direct loop() call.
   * @param opt_function A function to run at the end of every frame.
   */
  loop(opt_function?: () => void): void {
    var frameFunction = opt_function || function() {};

    if (!System.frameFunction) {
      System.frameFunction = frameFunction;
    }

    System._step();
    System._draw();
    System.frameFunction.call(this);

    if (!System._running) {
      System._running = true;
      window.requestAnimationFrame((t) => System._frame(t));
    }
  },

  /**
   * One animation frame: simulate however many fixed steps the elapsed
   * time covers, then draw once.
   * @param now The rAF timestamp in ms.
   */
  _frame(now: number): void {
    window.requestAnimationFrame((t) => System._frame(t));

    if (System._lastFrameTime === null) {
      System._lastFrameTime = now;
      return;
    }

    var delta = now - System._lastFrameTime;
    System._lastFrameTime = now;

    // Cap the debt a background tab can build up: after a long pause,
    // resume smoothly instead of fast-forwarding hundreds of steps.
    if (delta > 250) {
      delta = 250;
    }

    System._accumulator += delta;

    while (System._accumulator >= System.stepMs) {
      System._step();
      System._accumulator -= System.stepMs;
    }

    System._draw();

    if (FPSDisplay.active) {
      FPSDisplay.update(System._records.length);
    }
    if (System.frameFunction) {
      System.frameFunction.call(this);
    }
  },

  /**
   * Per-step caches of the proximity items every Mover reacts to.
   * Without these, each of n movers scans all n records three times
   * per step (O(n^2)), which collapses at thousands of items. Null
   * outside a step; Mover.step falls back to live queries then (e.g.
   * direct step() calls in tests).
   */
  _attractors: null as any[] | null,
  _repellers: null as any[] | null,
  _draggers: null as any[] | null,

  /**
   * Advances the simulation one step.
   */
  _step(): void {
    var i, records = System._records,
        len = System._records.length;

    // Items removed mid-step stay in these lists for the remainder of
    // the step; at one step per 16.7ms the difference is invisible.
    System._attractors = System.getAllItemsByName('Attractor');
    System._repellers = System.getAllItemsByName('Repeller');
    System._draggers = System.getAllItemsByName('Dragger');

    for (i = len - 1; i >= 0; i -= 1) {
      if (records[i] && records[i].step && !records[i].world.pauseStep) {
        if (records[i].life < records[i].lifespan) {
          records[i].life += 1;
        } else if (records[i].lifespan !== -1) {
          System.remove(records[i]);
          continue;
        }
        records[i].step();
      }
    }

    System._attractors = null;
    System._repellers = null;
    System._draggers = null;

    System.clock++;
  },

  /**
   * Draws all records via the active renderer.
   */
  _draw(): void {
    getRenderer().drawFrame(System._records);
  },

  /**
   * Pauses the system and processes one step in records.
   */
  _stepForward(): void {
    var i, j, max, records = System._records,
        world, worlds = System.allWorlds();

    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      world.pauseStep = true;
      for (j = records.length - 1; j >= 0; j -= 1) {
        if (records[j].step) {
          records[j].step();
        }
      }
      for (j = records.length - 1; j >= 0; j -= 1) {
        if (records[j].draw) {
          records[j].draw();
        }
      }
    }
    System.clock++;
  },

  /**
   * Saves the mouse/touch location relative to the browser window.
   */
  _recordMouseLoc(e: any): void {
    var touch, world = System.firstWorld();

    System.mouse.lastLocation.x = System.mouse.location.x;
    System.mouse.lastLocation.y = System.mouse.location.y;

    if (e.changedTouches) {
      touch = e.changedTouches[0];
    }

    /**
     * Mapping window size to world size allows us to
     * lead an agent around a world that's not bound
     * to the window.
     */
    if (e.pageX && e.pageY) {
      System.mouse.location.x = Utils.map(e.pageX, 0, window.innerWidth, 0, world.width);
      System.mouse.location.y = Utils.map(e.pageY, 0, window.innerHeight, 0, world.height);
    } else if (e.clientX && e.clientY) {
      System.mouse.location.x = Utils.map(e.clientX, 0, window.innerWidth, 0, world.width);
      System.mouse.location.y = Utils.map(e.clientY, 0, window.innerHeight, 0, world.height);
    } else if (touch) {
      System.mouse.location.x = touch.pageX;
      System.mouse.location.y = touch.pageY;
    }

    System.mouse.velocity.x = System.mouse.lastLocation.x - System.mouse.location.x;
    System.mouse.velocity.y = System.mouse.lastLocation.y - System.mouse.location.y;
  },

  /**
   * Returns the first world in the system.
   */
  firstWorld(): any {
    return System._records.length ? System._records[0] : null;
  },

  /**
   * Returns all worlds.
   */
  allWorlds(): any[] {
    return System.getAllItemsByName('World');
  },

  /**
   * Returns an array of items created from the same constructor.
   * @param name The 'name' property.
   * @param opt_list An optional list of items.
   */
  getAllItemsByName(name: string, opt_list?: any[]): any[] {
    var i, max, arr = [],
        list = opt_list || System._records;

    for (i = 0, max = list.length; i < max; i++) {
      if (list[i].name === name) {
        arr[arr.length] = list[i];
      }
    }
    return arr;
  },

  /**
   * Returns an array of items with an attribute that matches the
   * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
   * @param attr The property to match.
   * @param opt_val The 'attr' parameter must equal this param.
   * @param opt_name The item's name property must equal this param.
   */
  getAllItemsByAttribute(attr: string, opt_val?: any, opt_name?: string): any[] {
    var i, max, arr = [], records = System._records,
        val = typeof opt_val !== 'undefined' ? opt_val : null,
        name = opt_name || false;

    for (i = 0, max = records.length; i < max; i++) {
      if (typeof records[i][attr] !== 'undefined') {
        if (val !== null && records[i][attr] !== val) {
          continue;
        }
        if (name && records[i].name !== name) {
          continue;
        }
        arr[arr.length] = records[i];
      }
    }
    return arr;
  },

  /**
   * Handles orientation events and forces the world to update its bounds.
   */
  updateOrientation(): void {
    var worlds = System.allWorlds(),
        i, l = worlds.length, size;
    for (i = 0; i < l; i++) {
      size = World.measureSize(worlds[i].el);
      worlds[i].width = size.width;
      worlds[i].height = size.height;
    }
  },

  /**
   * Handles keyup events.
   * @param e An event.
   */
  _keyup(e: any): void {
    var i, max, world, worlds = System.allWorlds();

    switch (e.keyCode) {
      case 39:
        System._stepForward();
        break;
      case 80: // p; pause/play
        for (i = 0, max = worlds.length; i < max; i++) {
          world = worlds[i];
          world.pauseStep = !world.pauseStep;
        }
        break;
      case 82: // r; reset
        System._resetSystem();
        break;
      case 83: // s; stats
        System._toggleFPS();
        break;
    }
  },

  /**
   * Resets the system.
   */
  _resetSystem(): void {
    var i, max, world, worlds = System.allWorlds();

    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      world.pauseStep = false;
      world.pauseDraw = false;

      if (world._resizeObserver) {
        world._resizeObserver.disconnect();
        world._resizeObserver = null;
      }

      while (world.el.firstChild) {
        world.el.removeChild(world.el.firstChild);
      }
    }

    System._records = [];
    System._pool = [];
    System.clock = 0;
    System._accumulator = 0;
    System.setup(System.setupFunc);
  },

  /**
   * Toggles stats display.
   */
  _toggleFPS(): void {
    if (!FPSDisplay.fps) {
      FPSDisplay.init();
    } else {
      FPSDisplay.active = !FPSDisplay.active;
    }

    if (!FPSDisplay.active) {
      FPSDisplay.hide();
    } else {
      FPSDisplay.show();
    }
  }
};

export default System;
