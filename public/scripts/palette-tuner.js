/**
 * PaletteTuner: a small DOM overlay for live-editing a demo's
 * ColorPalette while the sim runs. Each row is a start -> end gradient
 * pair (the model ColorPalette.addColor uses); rows can be added and
 * removed, and every change fires onChange with the current pairs so
 * the page can rebuild its palette and re-color live items.
 *
 * Usage:
 *   PaletteTuner.init({
 *     colors: [{ start: [0, 60, 255], end: [80, 200, 255] }, ...],
 *     onChange: function(pairs) { ... }
 *   });
 */
(function() {

  function toHex(rgb) {
    return '#' + rgb.map(function(c) {
      return ('0' + Math.max(0, Math.min(255, Math.round(c))).toString(16)).slice(-2);
    }).join('');
  }

  function toRGB(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
  }

  var PaletteTuner = {

    _pairs: [],
    _onChange: null,
    _rowsEl: null,

    init: function(options) {
      this._pairs = options.colors.map(function(c) {
        return { start: c.start.slice(), end: c.end.slice() };
      });
      this._onChange = options.onChange || function() {};
      this._buildPanel();
      this._renderRows();
    },

    _buildPanel: function() {
      var panel = document.createElement('div');
      panel.id = 'paletteTuner';
      panel.style.cssText = 'position: fixed; top: 40px; right: 10px; z-index: 1001;' +
          'background: rgba(20, 20, 20, 0.85); color: #ddd; padding: 10px;' +
          'border: 1px solid #444; border-radius: 6px;' +
          'font-family: Helvetica, Arial, sans-serif; font-size: 12px;' +
          'user-select: none; width: 178px;';

      var header = document.createElement('div');
      header.style.cssText = 'display: flex; justify-content: space-between;' +
          'align-items: center; margin-bottom: 8px; cursor: pointer;';
      var title = document.createElement('span');
      title.textContent = 'palette';
      title.style.opacity = '0.7';
      var toggle = document.createElement('span');
      toggle.textContent = '−';
      toggle.style.cssText = 'cursor: pointer; padding: 0 4px; opacity: 0.7;';
      header.appendChild(title);
      header.appendChild(toggle);
      panel.appendChild(header);

      var body = document.createElement('div');
      panel.appendChild(body);

      header.addEventListener('click', function() {
        var hidden = body.style.display === 'none';
        body.style.display = hidden ? 'block' : 'none';
        toggle.textContent = hidden ? '−' : '+';
      });

      this._rowsEl = document.createElement('div');
      body.appendChild(this._rowsEl);

      var addBtn = this._button('+ add color', function() {
        var last = PaletteTuner._pairs[PaletteTuner._pairs.length - 1];
        PaletteTuner._pairs.push(last ?
            { start: last.start.slice(), end: last.end.slice() } :
            { start: [80, 80, 255], end: [200, 200, 255] });
        PaletteTuner._renderRows();
        PaletteTuner._changed();
      });
      body.appendChild(addBtn);

      var copyBtn = this._button('copy as code', function() {
        var code = PaletteTuner.toCode();
        var done = function() {
          copyBtn.textContent = 'copied!';
          setTimeout(function() { copyBtn.textContent = 'copy as code'; }, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(done, done);
        } else {
          done();
        }
      });
      body.appendChild(copyBtn);

      document.body.appendChild(panel);
    },

    _button: function(label, onClick) {
      var b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'display: block; width: 100%; margin-top: 6px;' +
          'background: #333; color: #ddd; border: 1px solid #555;' +
          'border-radius: 4px; padding: 4px; font-size: 11px; cursor: pointer;';
      b.addEventListener('click', onClick);
      return b;
    },

    _renderRows: function() {
      var self = this;
      this._rowsEl.innerHTML = '';

      this._pairs.forEach(function(pair, i) {
        var row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; gap: 4px; margin-bottom: 4px;';

        var start = document.createElement('input');
        start.type = 'color';
        start.value = toHex(pair.start);
        start.style.cssText = 'width: 56px; height: 24px; border: none; background: none; cursor: pointer;';
        start.addEventListener('input', function() {
          pair.start = toRGB(start.value);
          self._changed();
        });

        var arrow = document.createElement('span');
        arrow.textContent = '→';
        arrow.style.opacity = '0.5';

        var end = document.createElement('input');
        end.type = 'color';
        end.value = toHex(pair.end);
        end.style.cssText = start.style.cssText;
        end.addEventListener('input', function() {
          pair.end = toRGB(end.value);
          self._changed();
        });

        var remove = document.createElement('span');
        remove.textContent = '×';
        remove.title = 'remove';
        remove.style.cssText = 'cursor: pointer; opacity: 0.6; padding: 0 3px;';
        remove.addEventListener('click', function() {
          if (self._pairs.length > 1) { // keep at least one color
            self._pairs.splice(i, 1);
            self._renderRows();
            self._changed();
          }
        });

        row.appendChild(start);
        row.appendChild(arrow);
        row.appendChild(end);
        row.appendChild(remove);
        self._rowsEl.appendChild(row);
      });
    },

    _changed: function() {
      this._onChange(this._pairs.map(function(p) {
        return { start: p.start.slice(), end: p.end.slice() };
      }));
    },

    /**
     * The current palette as a ColorPalette building snippet, ready to
     * paste into a demo.
     */
    toCode: function() {
      return 'var palette = new Flora.ColorPalette();\npalette' +
          this._pairs.map(function(p) {
            return '.addColor({\n  min: 6,\n  max: 24,\n  startColor: [' +
                p.start.join(', ') + '],\n  endColor: [' + p.end.join(', ') + ']\n})';
          }).join('') + ';';
    }
  };

  window.PaletteTuner = PaletteTuner;
}());
