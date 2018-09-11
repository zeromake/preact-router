import {
    h,
    Component,
    PureComponent,
    Children,
    findChildren,
    findProps,
    cloneElement,
} from "react-import";

import {
    createRoute,
} from "./tools";

import {
    BaseContext,
} from "./context";

import {
    pick,
    resolve,
} from "./lib/utils";

import {
    Location,
} from "./location";

import {
    FocusHandler,
} from "./focus";

import {
    ILocationType,
    navigateType,
} from "./types";

interface IRouterImplProps {
    location: ILocationType;
    navigate: navigateType;
    basepath: string;
    baseuri: string;
    component: string | Component<any, any>;
    primary?: boolean;
    children?: any;
    [name: string]: any;
}

class RouterImpl extends PureComponent<IRouterImplProps, any> {
    public static defaultProps = {
        primary: true,
        basepath: "/",
    };
    public state: any;
    public props: IRouterImplProps;
    public context: any;
    public linkState: any;
    public setState: any;
    public forceUpdate: any;
    public refs: any;
    public render() {
        const {
            location,
            navigate,
            primary,
            children,
            baseuri,
            component = "div",
            ...domProps } = this.props;
        // const domProps = rest(
        //     this.props,
        //     [
        //         "location",
        //         "navigate",
        //         "primary",
        //         "children",
        //         "baseuri",
        //         "component",
        //     ],
        // );
        let basepath = this.props.basepath;
        const routes = Children.map(children, createRoute(basepath));
        const pathname = location.pathname;
        const match = pick(routes, pathname);
        if (match) {
            const {
                params,
                uri,
                route,
            } = match;
            const element = route.value;
            basepath = route.default ? basepath : route.path.replace(/\*$/, "");
            const props = {
                params,
                uri,
                location,
                navigate: (to: number|string, options?: any) => {
                    if (typeof to === "number") {
                        return navigate(to, options);
                    }
                    return navigate(
                        resolve(to, uri),
                        options,
                    );
                },
            };
            const child = Children.toArray(findChildren(element));
            const clone = cloneElement(
                element,
                props,
                child.length > 0 ? (
                    <Router primary={primary}>{child}</Router>
                ) : null,
            );
            const FocusWrapper = primary ? FocusHandler : component;
            const wrapperProps = primary
                ? { uri, location, component, ...domProps }
                : domProps;
            return (
                <BaseContext.Provider value={{ baseuri: uri, basepath }}>
                    <FocusWrapper {...wrapperProps}>{clone}</FocusWrapper>
                </BaseContext.Provider>
            );
        }
        return null;
    }
}

export function Router(props) {
    return (
        <BaseContext.Consumer>
            {(baseContext) => (
                <Location>
                    {(locationContext) => (
                        <RouterImpl {...baseContext} {...locationContext} {...props} />
                    )}
                </Location>
            )}
        </BaseContext.Consumer>
    );
}
