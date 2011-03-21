/*
 * FlashCanvas
 *
 * Copyright (c) 2009      Tim Cameron Ryan
 * Copyright (c) 2009-2010 FlashCanvas Project
 * Released under the MIT/X License
 */

// Reference:
//   http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html
//   http://dev.w3.org/html5/spec/the-canvas-element.html

// If the browser is IE and does not support HTML5 Canvas
if (window["ActiveXObject"] && !window["CanvasRenderingContext2D"]) {

(function(window, document) {

/*
 * Constant
 */

var UNDEFINED;
var NULL                        = null;
var CANVAS                      = "canvas";
var CANVAS_RENDERING_CONTEXT_2D = "CanvasRenderingContext2D";
var CANVAS_GRADIENT             = "CanvasGradient";
var CANVAS_PATTERN              = "CanvasPattern";
var FLASH_CANVAS                = "FlashCanvas";
var G_VML_CANVAS_MANAGER        = "G_vmlCanvasManager";
var OBJECT_ID_PREFIX            = "external";
var ON_FOCUS                    = "onfocus";
var ON_PROPERTY_CHANGE          = "onpropertychange";
var ON_READY_STATE_CHANGE       = "onreadystatechange";
var ON_UNLOAD                   = "onunload";
var SWF_URL                     = getScriptUrl().replace(/[^\/]+$/, "flashcanvas.swf");

/**
 * @constructor
 */
function Lookup(array) {
    for (var i = 0, n = array.length; i < n; i++)
        this[array[i]] = i;
}

var properties = new Lookup([
    // Canvas element
    "toDataURL",

    // CanvasRenderingContext2D
    "save",
    "restore",
    "scale",
    "rotate",
    "translate",
    "transform",
    "setTransform",
    "globalAlpha",
    "globalCompositeOperation",
    "strokeStyle",
    "fillStyle",
    "createLinearGradient",
    "createRadialGradient",
    "createPattern",
    "lineWidth",
    "lineCap",
    "lineJoin",
    "miterLimit",
    "shadowOffsetX",
    "shadowOffsetY",
    "shadowBlur",
    "shadowColor",
    "clearRect",
    "fillRect",
    "strokeRect",
    "beginPath",
    "closePath",
    "moveTo",
    "lineTo",
    "quadraticCurveTo",
    "bezierCurveTo",
    "arcTo",
    "rect",
    "arc",
    "fill",
    "stroke",
    "clip",
    "isPointInPath",
    "font",
    "textAlign",
    "textBaseline",
    "fillText",
    "strokeText",
    "measureText",
    "drawImage",
    "createImageData",
    "getImageData",
    "putImageData",

    // CanvasGradient
    "addColorStop",

    // Internal use
    "resize"
]);

// Whether swf is ready for use
var isReady = {};

// Monitor the number of loading files
var lock = {};

// Canvas elements
var canvases = {};

// SPAN element embedded in the canvas
var spans = {};

function getStyleId(ctx) {
    var canvasId = ctx._canvasId;
    if (!arguments.callee[canvasId]) arguments.callee[canvasId] = 0;
    return arguments.callee[canvasId]++;
}

/**
 * 2D context
 * @constructor
 */
var CanvasRenderingContext2D = function(canvas, swf) {
    // back-reference to the canvas
    this.canvas = canvas;

    // back-reference to the swf
    this._swf = swf;

    // unique ID of canvas
    this._canvasId = canvas.uniqueID;

    // initialize drawing states
    this._initialize();
	
    // frame update interval
    /*
	var self = this;
    setInterval(function() {
        if (lock[self._canvasId] === 0) {
            self._postCommands();
        }
    }, 30);
	*/
};

CanvasRenderingContext2D.prototype = {
    /*
     * state
     */

    save: function() {
        // push state
        this._stateStack.push({
            globalAlpha: this.globalAlpha,
            globalCompositeOperation: this.globalCompositeOperation,
            strokeStyle: this.strokeStyle,
            fillStyle: this.fillStyle,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            lineJoin: this.lineJoin,
            miterLimit: this.miterLimit,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            shadowBlur: this.shadowBlur,
            shadowColor: this.shadowColor,
            font: this.font,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline
        });

        // write all properties
        this._setCompositing();
        this._setShadows();
        this._setStrokeStyle();
        this._setFillStyle();
        this._setLineStyles();
        this._setFontStyles();

        this._queue.push(properties.save);
    },

    restore: function() {
        // pop state
        if (this._stateStack.length > 0) {
            var state = this._stateStack.pop();
            this.globalAlpha = state.globalAlpha;
            this.globalCompositeOperation = state.globalCompositeOperation;
            this.strokeStyle = state.strokeStyle;
            this.fillStyle = state.fillStyle;
            this.lineWidth = state.lineWidth;
            this.lineCap = state.lineCap;
            this.lineJoin = state.lineJoin;
            this.miterLimit = state.miterLimit;
            this.shadowOffsetX = state.shadowOffsetX;
            this.shadowOffsetY = state.shadowOffsetY;
            this.shadowBlur = state.shadowBlur;
            this.shadowColor = state.shadowColor;
            this.font = state.font;
            this.textAlign = state.textAlign;
            this.textBaseline = state.textBaseline;
        }

        this._queue.push(properties.restore);
    },

    /*
     * transformations
     */

    scale: function(x, y) {
        this._queue.push(properties.scale, x, y);
    },

    rotate: function(angle) {
        this._queue.push(properties.rotate, angle);
    },

    translate: function(x, y) {
        this._queue.push(properties.translate, x, y);
    },

    transform: function(m11, m12, m21, m22, dx, dy) {
        this._queue.push(properties.transform, m11, m12, m21, m22, dx, dy);
    },

    setTransform: function(m11, m12, m21, m22, dx, dy) {
        this._queue.push(properties.setTransform, m11, m12, m21, m22, dx, dy);
    },

    /*
     * compositing
     */

    _setCompositing: function() {
        var queue = this._queue;
        if (this._globalAlpha !== this.globalAlpha) {
            this._globalAlpha = this.globalAlpha;
            queue.push(properties.globalAlpha, this._globalAlpha);
        }
        if (this._globalCompositeOperation !== this.globalCompositeOperation) {
            this._globalCompositeOperation = this.globalCompositeOperation;
            queue.push(properties.globalCompositeOperation, this._globalCompositeOperation);
        }
    },

    /*
     * colors and styles
     */

    _setStrokeStyle: function() {
        if (this._strokeStyle !== this.strokeStyle) {
            var style = this._strokeStyle = this.strokeStyle;
            this._queue.push(properties.strokeStyle, (typeof style === "object") ? style.id : style);
        }
    },

    _setFillStyle: function() {
        if (this._fillStyle !== this.fillStyle) {
            var style = this._fillStyle = this.fillStyle;
            this._queue.push(properties.fillStyle, (typeof style === "object") ? style.id : style);
        }
    },

    createLinearGradient: function(x0, y0, x1, y1) {
        this._queue.push(properties.createLinearGradient, x0, y0, x1, y1);
        return new CanvasGradient(this);
    },

    createRadialGradient: function(x0, y0, r0, x1, y1, r1) {
        this._queue.push(properties.createRadialGradient, x0, y0, r0, x1, y1, r1);
        return new CanvasGradient(this);
    },

    createPattern: function(image, repetition) {
        // The first argument is HTMLImageElement, HTMLCanvasElement or
        // HTMLVideoElement. For now, only HTMLImageElement is supported.
        if (image.tagName.toUpperCase() !== "IMG") return;

        var src = image.getAttribute("src", 2), canvasId = this._canvasId;
        this._queue.push(properties.createPattern, src, repetition);

        if (isReady[canvasId]) {
            this._postCommands();
            ++lock[canvasId];
        }

        return new CanvasPattern(this);
    },

    /*
     * line caps/joins
     */

    _setLineStyles: function() {
        var queue = this._queue;
        if (this._lineWidth !== this.lineWidth) {
            this._lineWidth = this.lineWidth;
            queue.push(properties.lineWidth, this._lineWidth);
        }
        if (this._lineCap !== this.lineCap) {
            this._lineCap = this.lineCap;
            queue.push(properties.lineCap, this._lineCap);
        }
        if (this._lineJoin !== this.lineJoin) {
            this._lineJoin = this.lineJoin;
            queue.push(properties.lineJoin, this._lineJoin);
        }
        if (this._miterLimit !== this.miterLimit) {
            this._miterLimit = this.miterLimit;
            queue.push(properties.miterLimit, this._miterLimit);
        }
    },

    /*
     * shadows
     */

    _setShadows: function() {
        var queue = this._queue;
        if (this._shadowOffsetX !== this.shadowOffsetX) {
            this._shadowOffsetX = this.shadowOffsetX;
            queue.push(properties.shadowOffsetX, this._shadowOffsetX);
        }
        if (this._shadowOffsetY !== this.shadowOffsetY) {
            this._shadowOffsetY = this.shadowOffsetY;
            queue.push(properties.shadowOffsetY, this._shadowOffsetY);
        }
        if (this._shadowBlur !== this.shadowBlur) {
            this._shadowBlur = this.shadowBlur;
            queue.push(properties.shadowBlur, this._shadowBlur);
        }
        if (this._shadowColor !== this.shadowColor) {
            this._shadowColor = this.shadowColor;
            queue.push(properties.shadowColor, this._shadowColor);
        }
    },

    /*
     * rects
     */

    clearRect: function(x, y, w, h) {
        this._queue.push(properties.clearRect, x, y, w, h);
    },

    fillRect: function(x, y, w, h) {
        this._setCompositing();
        this._setShadows();
        this._setFillStyle();
        this._queue.push(properties.fillRect, x, y, w, h);
    },

    strokeRect: function(x, y, w, h) {
        this._setCompositing();
        this._setShadows();
        this._setStrokeStyle();
        this._setLineStyles();
        this._queue.push(properties.strokeRect, x, y, w, h);
    },

    /*
     * path API
     */

    beginPath: function() {
        this._queue.push(properties.beginPath);
    },

    closePath: function() {
        this._queue.push(properties.closePath);
    },

    moveTo: function(x, y) {
        this._queue.push(properties.moveTo, x, y);
    },

    lineTo: function(x, y) {
        this._queue.push(properties.lineTo, x, y);
    },

    quadraticCurveTo: function(cpx, cpy, x, y) {
        this._queue.push(properties.quadraticCurveTo, cpx, cpy, x, y);
    },

    bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._queue.push(properties.bezierCurveTo, cp1x, cp1y, cp2x, cp2y, x, y);
    },

    arcTo: function(x1, y1, x2, y2, radius) {
        this._queue.push(properties.arcTo, x1, y1, x2, y2, radius);
    },

    rect: function(x, y, w, h) {
        this._queue.push(properties.rect, x, y, w, h);
    },

    arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
        this._queue.push(properties.arc, x, y, radius, startAngle, endAngle, anticlockwise ? 1 : 0);
    },

    fill: function() {
        this._setCompositing();
        this._setShadows();
        this._setFillStyle();
        this._queue.push(properties.fill);
    },

    stroke: function() {
        this._setCompositing();
        this._setShadows();
        this._setStrokeStyle();
        this._setLineStyles();
        this._queue.push(properties.stroke);
    },

    clip: function() {
        this._queue.push(properties.clip);
    },

    isPointInPath: function(x, y) {
        // TODO: Implement
    },

    /*
     * text
     */

    _setFontStyles: function() {
        var queue = this._queue;
        if (this._font !== this.font) {
            try {
                var span = spans[this._canvasId];
                span.style.font = this._font = this.font;

                var style = span.currentStyle;
                var fontSize = span.offsetHeight;
                var font = [style.fontStyle, style.fontWeight, fontSize, style.fontFamily].join(" ");
                queue.push(properties.font, font);
            } catch(e) {
                // If this.font cannot be parsed as a CSS font value, then it
                // must be ignored.
            }
        }
        if (this._textAlign !== this.textAlign) {
            this._textAlign = this.textAlign;
            queue.push(properties.textAlign, this._textAlign);
        }
        if (this._textBaseline !== this.textBaseline) {
            this._textBaseline = this.textBaseline;
            queue.push(properties.textBaseline, this._textBaseline);
        }
    },

    fillText: function(text, x, y, maxWidth) {
        this._setCompositing();
        this._setFillStyle();
        this._setShadows();
        this._setFontStyles();
        this._queue.push(properties.fillText, encode(text), x, y,
                         maxWidth === UNDEFINED ? Infinity : maxWidth);
    },

    strokeText: function(text, x, y, maxWidth) {
        this._setCompositing();
        this._setStrokeStyle();
        this._setShadows();
        this._setFontStyles();
        this._queue.push(properties.strokeText, encode(text), x, y,
                         maxWidth === UNDEFINED ? Infinity : maxWidth);
    },

    measureText: function(text) {
        var span = spans[this._canvasId];
        try {
            span.style.font = this.font;
        } catch(e) {
            // If this.font cannot be parsed as a CSS font value, then it must
            // be ignored.
        }

        // Replace space characters with tab characters because innerText
        // removes trailing white spaces.
        span.innerText = text.replace(/[ \n\f\r]/g, "\t");

        return new TextMetrics(span.offsetWidth);
    },

    /*
     * drawing images
     */

    drawImage: function(image, x1, y1, w1, h1, x2, y2, w2, h2) {
        // The first argument is HTMLImageElement, HTMLCanvasElement or
        // HTMLVideoElement. For now, only HTMLImageElement is supported.
        if (image.tagName.toUpperCase() !== "IMG") return;

        var argc = arguments.length, src = image.getAttribute("src", 2);
        var canvasId = this._canvasId;

        this._setCompositing();
        this._setShadows();

        if (argc === 3) {
            this._queue.push(properties.drawImage, argc, src, x1, y1);
        } else if (argc === 5) {
            this._queue.push(properties.drawImage, argc, src, x1, y1, w1, h1);
        } else if (argc === 9) {
            this._queue.push(properties.drawImage, argc, src, x1, y1, w1, h1, x2, y2, w2, h2);
        } else {
            return;
        }

        if (isReady[canvasId]) {
            this._postCommands();
            ++lock[canvasId];
        }
    },

    /*
     * pixel manipulation
     */

    // ImageData createImageData(in float sw, in float sh);
    // ImageData createImageData(in ImageData imagedata);
    createImageData: function() {
        // TODO: Implement
    },

    // ImageData getImageData(in float sx, in float sy, in float sw, in float sh);
    getImageData: function(sx, sy, sw, sh) {
        // TODO: Implement
    },

    // void putImageData(in ImageData imagedata, in float dx, in float dy, [Optional] in float dirtyX, in float dirtyY, in float dirtyWidth, in float dirtyHeight);
    putImageData: function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        // TODO: Implement
    },

    /*
     * private methods
     */

    _initialize: function() {
        // compositing
        this.globalAlpha = this._globalAlpha = 1.0;
        this.globalCompositeOperation = this._globalCompositeOperation = "source-over";

        // colors and styles
        this.strokeStyle = this._strokeStyle = "#000000";
        this.fillStyle   = this._fillStyle   = "#000000";

        // line caps/joins
        this.lineWidth  = this._lineWidth  = 1.0;
        this.lineCap    = this._lineCap    = "butt";
        this.lineJoin   = this._lineJoin   = "miter";
        this.miterLimit = this._miterLimit = 10.0;

        // shadows
        this.shadowOffsetX = this._shadowOffsetX = 0;
        this.shadowOffsetY = this._shadowOffsetY = 0;
        this.shadowBlur    = this._shadowBlur    = 0;
        this.shadowColor   = this._shadowColor   = "rgba(0,0,0,0)";

        // text
        this.font         = this._font         = "10px sans-serif";
        this.textAlign    = this._textAlign    = "start";
        this.textBaseline = this._textBaseline = "alphabetic";

        // command queue
        this._queue = [];
		this.ready = false;
        // stack of drawing states
        this._stateStack = [];
    },

    _flush: function() {
        var queue = this._queue;
        this._queue = [];
        return queue;
    },

	_postCommands: function() {
	},
	
    _myPostCommands: function() {
        // post commands
        var commands = this._flush();
        if (commands.length > 0) {
            return eval(this._swf.CallFunction(
                '<invoke name="postCommands" returntype="javascript"><arguments><string>'
                + commands.join("&#0;") + "</string></arguments></invoke>"
            ));
        }
    },

    _resize: function(width, height) {
        // Flush commands in the queue
        this._postCommands();

        // Clear back to the initial state
        this._initialize();

        // Execute a resize command at the start of the next frame
        this._queue.push(properties.resize, width, height);
    }
};

/**
 * CanvasGradient stub
 * @constructor
 */
var CanvasGradient = function(ctx) {
    this._ctx = ctx;
    this.id   = getStyleId(ctx);
};

CanvasGradient.prototype = {
    addColorStop: function(offset, color) {
        this._ctx._queue.push(properties.addColorStop, this.id, offset, color);
    }
};

/**
 * CanvasPattern stub
 * @constructor
 */
var CanvasPattern = function(ctx) {
    this.id = getStyleId(ctx);
};

/**
 * TextMetrics stub
 * @constructor
 */
var TextMetrics = function(width) {
    this.width = width;
};

/*
 * Event handlers
 */

function onReadyStateChange() {
    if (document.readyState === "complete") {
        document.detachEvent(ON_READY_STATE_CHANGE, onReadyStateChange);

        var canvases = document.getElementsByTagName(CANVAS);
        for (var i = 0, n = canvases.length; i < n; ++i) {
            FlashCanvas.initElement(canvases[i]);
        }
    }
}

function onFocus() {
    // forward the event to the parent
    var swf = event.srcElement, canvas = swf.parentNode;
    swf.blur();
    canvas.focus();
}

function onPropertyChange() {
    var prop = event.propertyName;
    if (prop === "width" || prop === "height") {
        var canvas = event.srcElement, ctx = canvas.getContext("2d");
        var value = parseInt(canvas[prop]);
        if (isNaN(value) || value < 0) {
            value = (prop === "width") ? 300 : 150;
        } else if (value === 0) {
            value = 1;
        }
        canvas.style[prop] = value + "px";
        ctx._resize(canvas.clientWidth, canvas.clientHeight);
    }
}

function onUnload() {
    window.detachEvent(ON_UNLOAD, onUnload);

    for (var canvasId in canvases) {
        var canvas = canvases[canvasId], swf = canvas.firstChild, prop;

        // clean up the references of swf.postCommands and swf.resize
        for (prop in swf) {
            if (typeof swf[prop] === "function") {
                swf[prop] = NULL;
            }
        }

        // clean up the references of canvas.getContext and canvas.toDataURL
        for (prop in canvas) {
            if (typeof canvas[prop] === "function") {
                canvas[prop] = NULL;
            }
        }

        // remove event listeners
        swf.detachEvent(ON_FOCUS, onFocus);
        canvas.detachEvent(ON_PROPERTY_CHANGE, onPropertyChange);
    }

    // delete exported symbols
    window[CANVAS_RENDERING_CONTEXT_2D] = NULL;
    window[CANVAS_GRADIENT]             = NULL;
    window[CANVAS_PATTERN]              = NULL;
    window[FLASH_CANVAS]                = NULL;
    window[G_VML_CANVAS_MANAGER]        = NULL;
}

/*
 * FlashCanvas API
 */

var FlashCanvas = {
    initElement: function(canvas) {
        // Check whether the initialization is required or not.
        if (canvas.getContext) {
            return canvas;
        }

        // get element explicit size
        var width  = parseInt(canvas.getAttribute("width")),
            height = parseInt(canvas.getAttribute("height"));

        if (isNaN(width) || width < 0) {
            width = 300;
        }
        if (isNaN(height) || height < 0) {
            height = 150;
        }
        canvas.style.width  = width  + "px";
        canvas.style.height = height + "px";

        // initialize lock
        var canvasId      = canvas.uniqueID;
        var objectId      = OBJECT_ID_PREFIX + canvasId;
        isReady[canvasId] = false;
        lock[canvasId]    = 1;

        // embed swf and SPAN element
        canvas.innerHTML =
            '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' +
            ' codebase="' + location.protocol + '//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' +
            ' width="100%" height="100%" id="' + objectId + '">' +
            '<param name="allowScriptAccess" value="always">' +
            '<param name="flashvars" value="id=' + objectId + '">' +
            '<param name="wmode" value="transparent">' +
            '</object>' +
            '<span style="margin:0;padding:0;border:0;display:inline-block;position:static;height:1em;overflow:visible;white-space:nowrap">' +
            '</span>';

        canvases[canvasId] = canvas;
        var swf            = canvas.firstChild;
        spans[canvasId]    = canvas.lastChild;

        // Check whether the canvas element is in the DOM tree
        var documentContains = document.body.contains;
        if (documentContains(canvas)) {
            // Load swf file immediately
            swf["movie"] = SWF_URL;
        } else {
            // Wait until the element is added to the DOM tree
            var intervalId = setInterval(function() {
                if (documentContains(canvas)) {
                    clearInterval(intervalId);
                    swf["movie"] = SWF_URL;
                }
            }, 0);
        }

        // If the browser is IE6 or in quirks mode
        if (document.compatMode === "BackCompat" || !window.XMLHttpRequest) {
            spans[canvasId].style.overflow = "hidden";
        }

        // initialize context
        var ctx = new CanvasRenderingContext2D(canvas, swf);

        // canvas API
        canvas.getContext = function(contextId) {
            return contextId === "2d" ? ctx : NULL;
        };

        canvas.toDataURL = function(type, quality) {
            type = type ? type.toLowerCase() : "image/png";

            if (type === "image/jpeg") {
                ctx._queue.push(properties.toDataURL, type, quality || 0.5);
            } else {
                ctx._queue.push(properties.toDataURL, type);
            }
            return ctx._postCommands();
        };

        // add event listener
        swf.attachEvent(ON_FOCUS, onFocus);

        return canvas;
    },

    setOptions: function(options) {
        // TODO: Implement
    },

    trigger: function(canvasId, type) {
        var canvas = canvases[canvasId];
        canvas.fireEvent("on" + type);
    },

    unlock: function(canvasId, ready) {
        if (lock[canvasId]) {
            --lock[canvasId];
        }
        if (ready) {
            var canvas = canvases[canvasId];
            var swf    = canvas.firstChild;

            // Add event listener
            canvas.attachEvent(ON_PROPERTY_CHANGE, onPropertyChange);

            // Adjust the size of Flash to be the same size as the canvas
            swf.resize(swf.clientWidth, swf.clientHeight);

            // ExternalInterface is now ready for use
            canvas.getContext("2d").ready = true
			isReady[canvasId] = true;
        }
    }
};

/*
 * Utility methods
 */

// Get the absolute URL of flashcanvas.js
function getScriptUrl() {
    var scripts = document.getElementsByTagName("script");
    var script  = scripts[scripts.length - 1];

    // @see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
    if (document.documentMode >= 8) {
        return script.src;
    } else {
        return script.getAttribute("src", 4);
    }
}

// Escape characters not permitted in XML.
function encode(str) {
    return ("" + str).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/*
 * initialization
 */

// IE HTML5 shiv
document["createElement"](CANVAS);

// setup default CSS
document.createStyleSheet().cssText =
    CANVAS + "{display:inline-block;overflow:hidden;width:300px;height:150px}";

// initialize canvas elements
document.attachEvent(ON_READY_STATE_CHANGE, onReadyStateChange);

// prevent IE6 memory leaks
window.attachEvent(ON_UNLOAD, onUnload);

// preload SWF file if it's in the same domain
if (SWF_URL.indexOf(location.protocol + "//" + location.host + "/") === 0) {
    var req = new ActiveXObject("Microsoft.XMLHTTP");
    req.open("GET", SWF_URL, false);
    req.send(NULL);
}

/*
 * public API
 */

window[CANVAS_RENDERING_CONTEXT_2D] = CanvasRenderingContext2D;
window[CANVAS_GRADIENT]             = CanvasGradient;
window[CANVAS_PATTERN]              = CanvasPattern;
window[FLASH_CANVAS]                = FlashCanvas;

// ExplorerCanvas-compatible APIs for convenience
window[G_VML_CANVAS_MANAGER] = {
    init:  function(){},
    init_: function(){},
    initElement: FlashCanvas.initElement
};

// Prevent Closure Compiler from removing the function.
keep = CanvasRenderingContext2D.measureText;

})(window, document);

}
