import { connect } from 'react-redux'
import BlurryPreviewView, { IBlurryPreviewViewProps } from './blurry-preview-view'
import { IAppState, IAction } from '../../types'

function mapStateToProps(
    state: IAppState,
    props: Partial<IBlurryPreviewViewProps>
): IBlurryPreviewViewProps {
    return { ...props }
}

function mapDispatchToProps(
    dispatch: (action: IAction) => void,
    props: Partial<IBlurryPreviewViewProps>
) {
    // @see https://redux.js.org/basics/usage-with-react/#implementing-container-components
}

export default connect(mapStateToProps, mapDispatchToProps)(BlurryPreviewView)
