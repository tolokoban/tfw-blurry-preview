import * as React from "react";
export interface IBlurryViewProps {
    className?: string;
    colors: Array<[number, number, number]>;
    columns: number;
}
interface IBlurryViewState {
}
export default class BlurryView extends React.Component<IBlurryViewProps, IBlurryViewState> {
    private lastColors?;
    private lastColumns?;
    private readonly refCanvas;
    state: IBlurryViewState;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private readonly paint;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=blurry-view.d.ts.map