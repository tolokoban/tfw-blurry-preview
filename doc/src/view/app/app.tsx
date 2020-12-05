import React from "react"
import Font from 'tfw/font'
import Theme from 'tfw/theme'

import "./app.css"

interface IAppState {
}

Theme.register(
    "default-light", {
    colorP: "#002ca6",
    colorS: "#FFA000",
    color0: "#BBB",
    color1: "#DDD",
    color2: "#EEE",
    color3: "#FFF"
})

Theme.register(
    "default-dark", {
    colorP: "#002ca6",
    colorS: "#FFA000",
    color0: "#123",
    color3: "#345",
    colorE: "#f44"
})

Theme.apply("default-dark")


export default class App extends React.Component<{}, IAppState> {
    state: IAppState = {
    }

    async componentDidMount() {
        await Font.loadJosefin(true)
    }

    render() {
        const classes = ["view-App", "thm-bg0"]

        return (<div className={classes.join(" ")}>
        </div>)
    }
}
