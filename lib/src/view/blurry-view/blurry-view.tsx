import * as React from "react"
import vertexShader from './blurry-view.vert'
import fragmentShader from './blurry-view.frag'


export interface IBlurryViewProps {
    className?: string
    colors: Array<[number, number, number]>
    columns: number
}

// tslint:disable-next-line: no-empty-interface
interface IBlurryViewState { }

export default class BlurryView extends React.Component<IBlurryViewProps, IBlurryViewState> {
    private lastColors?: Array<[number, number, number]>
    private lastColumns?: number
    private readonly refCanvas = React.createRef<HTMLCanvasElement>()
    state: IBlurryViewState = {}

    componentDidMount() {
        const { colors, columns } = this.props
        this.lastColors = colors
        this.lastColumns = columns
        this.paint()
    }


    componentDidUpdate() {
        const { colors, columns } = this.props
        if (this.lastColors === colors && this.lastColumns === columns) return

        this.lastColors = colors
        this.lastColumns = columns
        this.paint()
    }


    private readonly paint = () => {
        const canvas = this.refCanvas.current
        if (!canvas) return

        const { colors, columns } = this.props
        paintCanvas(canvas, colors, columns)
    }


    render() {
        const classNames = ['custom', 'view-BlurryView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <canvas ref={this.refCanvas} className={classNames.join(" ")}>
        </canvas>
    }
}


function paintCanvas(canvas: HTMLCanvasElement, colors: Array<[number, number, number]>, cols: number) {
    try {
        const rows = Math.floor(colors.length / cols)
        // Resizing canvas.
        const rect = canvas.getBoundingClientRect()
        canvas.setAttribute("width", `${rect.width}`)
        canvas.setAttribute("height", `${rect.height}`)
        // Getting context.
        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: true,
            desynchronized: false,
            depth: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            strencil: false
        }) as WebGLRenderingContext | null
        if (!gl) return

        // Create the shader program
        const prg = gl.createProgram()
        if (!prg) return

        gl.attachShader(prg, loadVertexShader(gl, vertexShader))
        gl.attachShader(prg, loadFragmentShader(gl, fragmentShader))
        gl.linkProgram(prg)
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
            throw `Unable to link the shader program: ${gl.getProgramInfoLog(prg)}`
        }

        // Prepare attributes.
        const attXY = gl.getAttribLocation(prg, "attXY")
        const attColor = gl.getAttribLocation(prg, "attColor")
        // Creating elements.
        const elem = new Uint16Array(getElements(cols, rows))
        const buffElem = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffElem)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elem, gl.STATIC_DRAW)
        // Computing data.
        const data = new Float32Array([
            ...getCoords(cols, rows),
            ...getFlatArrayofColors(colors)
        ])
        // Creating buffer.
        const buff = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        // Mapping attributes.
        const VEC2_SIZE = 2
        gl.vertexAttribPointer(
            attXY,
            VEC2_SIZE,
            gl.FLOAT,
            false,
            0,
            0
        )
        const VEC3_SIZE = 3
        gl.vertexAttribPointer(
            attXY,
            VEC3_SIZE,
            gl.FLOAT,
            false,
            0,
            Float32Array.BYTES_PER_ELEMENT * (VEC2_SIZE * colors.length)
        )
        // Rendering the scene.
        gl.disable(gl.DEPTH_TEST)
        gl.useProgram(prg)
        gl.drawElements(
            gl.TRIANGLES,
            double((rows - 1) * (cols - 1)),
            gl.UNSIGNED_SHORT,
            0
        )
    } catch (ex) {
        console.error(ex)
    }
}


function loadVertexShader(gl: WebGLRenderingContext, code: string) {
    try {
        return loadShader(gl, code, gl.VERTEX_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile VERTEX shader: ${ex}`
    }
}

function loadFragmentShader(gl: WebGLRenderingContext, code: string) {
    try {
        return loadShader(gl, code, gl.FRAGMENT_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile FRAGMENT shader: ${ex}`
    }
}

function loadShader(gl: WebGLRenderingContext, code: string, type: number) {
    const shader = gl.createShader(type)
    if (!shader) throw `Invalid shader type: ${type}!`

    gl.shaderSource(shader, code)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw message
    }

    return shader
}


function getFlatArrayofColors(colors: Array<[number, number, number]>): number[] {
    const output: number[] = []
    for (const color of colors) {
        output.push(...color)
    }

    return output
}


function getCoords(cols: number, rows: number): number[] {
    const output: number[] = []
    const spaceWidth = 2
    const spaceHeight = 2
    const factorX = spaceWidth / (cols + 1)
    const factorY = spaceHeight / (rows + 1)
    for (let row = 0; row < rows; row++) {
        const y = (row * factorY) - 1
        for (let col = 0; col < cols; col++) {
            const x = (col * factorX) - 1
            output.push(x, y)
        }
    }

    return output
}


function getElements(cols: number, rows: number): number[] {
    const output: number[] = []
    for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols - 1; col++) {
            // We need two triangles to create a square.
            // A    A-B
            // |\    \|
            // C-D    D
            const A = row * cols + col
            const B = A + 1
            const C = A + cols
            const D = B + cols
            output.push(
                A, D, C,
                A, B, D
            )
        }
    }

    return output
}


function double(v: number): number {
    return v + v
}