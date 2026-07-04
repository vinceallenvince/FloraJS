/**
 * Renders a bar at the top of the browser window that displays the
 * current frames per second and the total number of elements in the
 * system.
 */
const FPSDisplay = {
  name: 'FPSDisplay',

  /** Set to false to stop requesting animation frames. */
  active: false,

  /** Frames per second. */
  fps: 0,

  /** Total items. */
  totalItems: 0,

  /** The current time. */
  _time: Date.now(),

  /** The time the last second was sampled. */
  _timeLastSecond: Date.now(),

  /** Holds the total number of frames between seconds. */
  _frameCount: 0,

  /** A reference to the DOM element containing the display. */
  el: null as HTMLElement | null,

  totalElementsValue: null as Text | null,
  fpsValue: null as Text | null,

  /**
   * Initializes the FPSDisplay.
   */
  init(): void {
    if (this.el) { // should only create one instance of FPSDisplay.
      return;
    }

    this.active = true;

    this.el = document.createElement('div');
    this.el.id = 'FPSDisplay';
    this.el.className = 'fpsDisplay';
    this.el.style.backgroundColor = 'black';
    this.el.style.color = 'white';
    this.el.style.fontFamily = 'Helvetica';
    this.el.style.padding = '0.5em';
    this.el.style.opacity = '0.5';
    this.el.style.position = 'fixed';
    this.el.style.top = '0';
    this.el.style.right = '0';
    this.el.style.left = '0';
    this.el.style.zIndex = '1000';

    // create total elements label
    var labelContainer = document.createElement('span');
    labelContainer.className = 'fpsDisplayLabel';
    labelContainer.style.marginLeft = '0.5em';
    labelContainer.appendChild(document.createTextNode('total elements: '));
    this.el.appendChild(labelContainer);

    // create textNode for totalElements
    this.totalElementsValue = document.createTextNode('0');
    this.el.appendChild(this.totalElementsValue);

    // create fps label
    labelContainer = document.createElement('span');
    labelContainer.className = 'fpsDisplayLabel';
    labelContainer.style.marginLeft = '0.5em';
    labelContainer.appendChild(document.createTextNode('fps: '));
    this.el.appendChild(labelContainer);

    // create textNode for fps
    this.fpsValue = document.createTextNode('0');
    this.el.appendChild(this.fpsValue);

    document.body.appendChild(this.el);
  },

  /**
   * If 1000ms have elapsed since the last evaluated second,
   * fps is assigned the total number of frames rendered and
   * its corresponding textNode is updated. The total number of
   * elements is also updated.
   *
   * @param opt_totalItems The total items in the system.
   */
  update(opt_totalItems?: number): void {
    this.totalItems = opt_totalItems || 0;

    this._time = Date.now();
    this._frameCount++;

    // at least a second has passed
    if (this._time > this._timeLastSecond + 1000) {
      this.fps = this._frameCount;
      this._timeLastSecond = this._time;
      this._frameCount = 0;

      this.fpsValue!.nodeValue = String(this.fps);
      this.totalElementsValue!.nodeValue = String(this.totalItems);
    }
  },

  /**
   * Hides FPSDisplay from DOM.
   */
  hide(): void {
    this.el!.style.display = 'none';
    FPSDisplay.active = false;
  },

  /**
   * Shows FPSDisplay in DOM.
   */
  show(): void {
    this.el!.style.display = 'block';
    FPSDisplay.active = true;
  }
};

export default FPSDisplay;
