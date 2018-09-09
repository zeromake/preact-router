import {
    h,
    Component,
    Children,
} from "react-import";

import * as React from "react-import";

import {
    globalHistory,
} from "./lib/history";

import {
    LocationContext,
} from "./context";

import {
    defer,
    IsArray,
} from "./lib/utils";

const deferredUpdatesName = "unstable_deferredUpdates";

const deferredUpdates = deferredUpdatesName in React ? React[deferredUpdatesName] : ((fn) => fn());

interface ILocationProviderProps {
    history?: any;
    children?: any;
}

export class LocationProvider extends Component<ILocationProviderProps> {
    public state: any;
    public props: ILocationProviderProps;
    public context: any;
    public setState: any;
    public linkState: any;
    public forceUpdate: any;
    public refs: any;
    public unmounted: boolean;

    public static defaultProps = {
        history: globalHistory,
    };

    constructor(p: ILocationProviderProps, c: any) {
        super(p, c);
        this.state = {
            context: this.getContext(),
            refs: { unlisten: null },
        };
    }

    public getContext() {
        const { history: { navigate, location } } = this.props;
        return { navigate, location };
    }

    public componentDidUpdate(prevProps: ILocationProviderProps, prevState) {
        if (prevState.context.location !== this.state.context.location) {
            this.props.history._onTransitionComplete();
        }
    }

    public componentDidMount() {
        const refs = this.state.refs;
        const history = this.props.history;
        const self = this;
        refs.unlisten = history.listen(function deep1() {
            defer(function deep2() {
                deferredUpdates(function deep3() {
                    if (!self.unmounted) {
                        self.setState({
                            context: self.getContext(),
                        });
                    }
                });
            });
        });
    }

    public componentWillUnmount() {
        const refs = this.state.refs;
        this.unmounted = true;
        refs.unlisten();
    }

    public render() {
        const context = this.state.context;
        const props = this.props;
        const children = IsArray(props.children) ? props.children[0] : props.children;
        return (
            <LocationContext.Provider value={context}>
                {typeof children === "function" ? children(context) : children || null}
            </LocationContext.Provider>
        );
    }
}
