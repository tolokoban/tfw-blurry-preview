import * as React from "react"

import './blurry-preview-view.css'

export interface IBlurryPreviewViewProps {
    className?: string
    colors: Array<[number, number, number]>
    columns: number
}

// tslint:disable-next-line: no-empty-interface
interface IBlurryPreviewViewState {}

export default class BlurryPreviewView extends React.Component<IBlurryPreviewViewProps, IBlurryPreviewViewState> {
    private lastColors?: Array<[number, number, number]>
    private lastColumns?: number
    private refCanvas = React.createRef<HTMLCanvasElement>()
    state: IBlurryPreviewViewState = {}

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

        
    }


    render() {
        const classNames = ['custom', 'view-BlurryPreviewView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <canvas ref={this.refCanvas} className={classNames.join(" ")}>
        </canvas>
    }
}
