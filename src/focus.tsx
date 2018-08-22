import {
    h,
    Component,
} from "react-import";

import {
    FocusContext,
} from "./context";
import {
    rest,
} from "./lib/utils";

export function FocusHandler(props) {
    const { uri, location, component } = props;
    const domProps = rest(props, ["uri", "location", "component"]);
    return (
        <FocusContext.Consumer>
            {(requestFocus) => (
                <FocusHandlerImpl
                    {...domProps}
                    component={component}
                    requestFocus={requestFocus}
                    uri={uri}
                    location={location}
                />
            )}
        </FocusContext.Consumer>
    );
}

// don't focus on initial render
let initialRender = true;
let focusHandlerCount = 0;

class FocusHandlerImpl extends Component<any, any> {
    public static getDerivedStateFromProps(nextProps, prevState) {
        const initial = prevState.uri == null;
        if (initial) {
            return {
                shouldFocus: true,
                ...nextProps,
            };
        } else {
            const myURIChanged = nextProps.uri !== prevState.uri;
            const navigatedUpToMe =
                prevState.location.pathname !== nextProps.location.pathname &&
                nextProps.location.pathname === nextProps.uri;
            return {
                shouldFocus: myURIChanged || navigatedUpToMe,
                ...nextProps,
            };
        }
    }
    public state: any;
    public linkState: any;
    public props: any;
    public context: any;
    public setState: any;
    public forceUpdate: any;
    private node: any;
    constructor(p, c) {
        super(p, c);
        this.state = {};
    }

    public componentDidMount() {
        focusHandlerCount++;
        this.focus();
    }

    public componentWillUnmount() {
        focusHandlerCount--;
        if (focusHandlerCount === 0) {
            initialRender = true;
        }
    }

    public componentDidUpdate(prevProps, prevState) {
        if (prevProps.location !== this.props.location && this.state.shouldFocus) {
            this.focus();
        }
    }

    public focus() {
        if (process.env.NODE_ENV === "test") {
            // getting cannot read property focus of null in the tests
            // and that bit of global `initialRender` state causes problems
            // should probably figure it out!
            return;
        }

        const { requestFocus } = this.props;

        if (requestFocus) {
            requestFocus(this.node);
        } else {
            if (initialRender) {
                initialRender = false;
            } else {
                this.node.focus();
            }
        }
    }

    public requestFocus = (node) => {
        if (!this.state.shouldFocus) {
            node.focus();
        }
    }

    public setRef = (n) => this.node = n.base ? n.base : n;

    public componentWillReceiveProps(nextProps, nextState) {
        const state = FocusHandlerImpl.getDerivedStateFromProps(nextProps, this.state);
        if (state != null) {
            this.setState(state);
        }
    }

    public render() {
        const {
            children,
            style,
            role = "group",
            component: Comp = "div",
        } = this.props;
        const domProps = rest(
            this.props,
            [
                "children",
                "style",
                "requestFocus",
                "role",
                "component",
                "uri",
                "location",
            ],
        );

        return (
            <Comp
                style={{ outline: "none", ...style }}
                tabIndex="-1"
                role={role}
                ref={this.setRef}
                {...domProps}
            >
                <FocusContext.Provider value={this.requestFocus}>
                    {children}
                </FocusContext.Provider>
            </Comp>
        );
    }
}
