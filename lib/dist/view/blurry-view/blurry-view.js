"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var blurry_view_vert_1 = __importDefault(require("./blurry-view.vert"));
var blurry_view_frag_1 = __importDefault(require("./blurry-view.frag"));
var BlurryView = /** @class */ (function (_super) {
    __extends(BlurryView, _super);
    function BlurryView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.refCanvas = React.createRef();
        _this.state = {};
        _this.paint = function () {
            var canvas = _this.refCanvas.current;
            if (!canvas)
                return;
            var _a = _this.props, colors = _a.colors, columns = _a.columns;
            paintCanvas(canvas, colors, columns);
        };
        return _this;
    }
    BlurryView.prototype.componentDidMount = function () {
        var _a = this.props, colors = _a.colors, columns = _a.columns;
        this.lastColors = colors;
        this.lastColumns = columns;
        this.paint();
    };
    BlurryView.prototype.componentDidUpdate = function () {
        var _a = this.props, colors = _a.colors, columns = _a.columns;
        if (this.lastColors === colors && this.lastColumns === columns)
            return;
        this.lastColors = colors;
        this.lastColumns = columns;
        this.paint();
    };
    BlurryView.prototype.render = function () {
        var classNames = ['custom', 'view-BlurryView'];
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className);
        }
        return React.createElement("canvas", { ref: this.refCanvas, className: classNames.join(" ") });
    };
    return BlurryView;
}(React.Component));
exports.default = BlurryView;
function paintCanvas(canvas, colors, cols) {
    try {
        var rows = Math.floor(colors.length / cols);
        // Resizing canvas.
        var rect = canvas.getBoundingClientRect();
        canvas.setAttribute("width", "" + rect.width);
        canvas.setAttribute("height", "" + rect.height);
        // Getting context.
        var gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: true,
            desynchronized: false,
            depth: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            strencil: false
        });
        if (!gl)
            return;
        // Create the shader program
        var prg = gl.createProgram();
        if (!prg)
            return;
        gl.attachShader(prg, loadVertexShader(gl, blurry_view_vert_1.default));
        gl.attachShader(prg, loadFragmentShader(gl, blurry_view_frag_1.default));
        gl.linkProgram(prg);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
            throw "Unable to link the shader program: " + gl.getProgramInfoLog(prg);
        }
        // Prepare attributes.
        var attXY = gl.getAttribLocation(prg, "attXY");
        var attColor = gl.getAttribLocation(prg, "attColor");
        // Creating elements.
        var elem = new Uint16Array(getElements(cols, rows));
        var buffElem = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffElem);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elem, gl.STATIC_DRAW);
        // Computing data.
        var data = new Float32Array(__spread(getCoords(cols, rows), getFlatArrayofColors(colors)));
        // Creating buffer.
        var buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        // Mapping attributes.
        var VEC2_SIZE = 2;
        gl.vertexAttribPointer(attXY, VEC2_SIZE, gl.FLOAT, false, 0, 0);
        var VEC3_SIZE = 3;
        gl.vertexAttribPointer(attXY, VEC3_SIZE, gl.FLOAT, false, 0, Float32Array.BYTES_PER_ELEMENT * (VEC2_SIZE * colors.length));
        // Rendering the scene.
        gl.disable(gl.DEPTH_TEST);
        gl.useProgram(prg);
        gl.drawElements(gl.TRIANGLES, double((rows - 1) * (cols - 1)), gl.UNSIGNED_SHORT, 0);
    }
    catch (ex) {
        console.error(ex);
    }
}
function loadVertexShader(gl, code) {
    try {
        return loadShader(gl, code, gl.VERTEX_SHADER);
    }
    catch (ex) {
        console.info(code);
        throw "Unable to compile VERTEX shader: " + ex;
    }
}
function loadFragmentShader(gl, code) {
    try {
        return loadShader(gl, code, gl.FRAGMENT_SHADER);
    }
    catch (ex) {
        console.info(code);
        throw "Unable to compile FRAGMENT shader: " + ex;
    }
}
function loadShader(gl, code, type) {
    var shader = gl.createShader(type);
    if (!shader)
        throw "Invalid shader type: " + type + "!";
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw message;
    }
    return shader;
}
function getFlatArrayofColors(colors) {
    var e_1, _a;
    var output = [];
    try {
        for (var colors_1 = __values(colors), colors_1_1 = colors_1.next(); !colors_1_1.done; colors_1_1 = colors_1.next()) {
            var color = colors_1_1.value;
            output.push.apply(output, __spread(color));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (colors_1_1 && !colors_1_1.done && (_a = colors_1.return)) _a.call(colors_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return output;
}
function getCoords(cols, rows) {
    var output = [];
    var spaceWidth = 2;
    var spaceHeight = 2;
    var factorX = spaceWidth / (cols + 1);
    var factorY = spaceHeight / (rows + 1);
    for (var row = 0; row < rows; row++) {
        var y = (row * factorY) - 1;
        for (var col = 0; col < cols; col++) {
            var x = (col * factorX) - 1;
            output.push(x, y);
        }
    }
    return output;
}
function getElements(cols, rows) {
    var output = [];
    for (var row = 0; row < rows - 1; row++) {
        for (var col = 0; col < cols - 1; col++) {
            // We need two triangles to create a square.
            // A    A-B
            // |\    \|
            // C-D    D
            var A = row * cols + col;
            var B = A + 1;
            var C = A + cols;
            var D = B + cols;
            output.push(A, D, C, A, B, D);
        }
    }
    return output;
}
function double(v) {
    return v + v;
}
//# sourceMappingURL=blurry-view.js.map