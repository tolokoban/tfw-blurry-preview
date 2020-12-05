// To test a React component, you need to install few modules:
// yarn add --dev @types/jest @testing-library/react @testing-library/jest-dom jest ts-jest
// @see https://github.com/testing-library/react-testing-library
import React from 'react';
import { render, screen } from '@testing-library/react';
import BlurryPreviewView, { IBlurryPreviewViewProps } from './blurry-preview-view'

function view(partialProps: Partial<IBlurryPreviewViewProps>): EventBag {
    const bag = new EventBag()
    const props: IBlurryPreviewViewProps = {
        // @TODO Set default props.
        ...partialProps
    }
    render(<BlurryPreviewView
        {...props}
        onChange={bag.on("onChange")}
    />)
    return bag
}

describe('<BlurryPreviewView/> in view', () => {
    it('should render without crashing', () => {
        view({})
        // expect(screen.getByText(/Search:?/)).toBeInTheDocument()
        // screen.debug()
    })
})

/**
 * Use this class to keep track on events fireing.
 */
class EventBag {
    private mapFiredEvents = new Map<string, Array<any[]>>()

    on(eventName: string) {
        return (...args: any[]) => {
            const { mapFiredEvents } = this
            if (mapFiredEvents.has(eventName)) {
                const arr = mapFiredEvents.get(eventName)
                app.push(args)
            } else {
                mapFiredEvents.set(eventName, [args])
            }
        }
    }

    get(eventName: string): any[] {
        const { mapFiredEvents } = this
        if (mapFiredEvents.has(eventName)) {
            return mapFiredEvents.get(eventName)
        }
        return []
    }
}
