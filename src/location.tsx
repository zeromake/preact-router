import {
    h,
    Children,
} from "react-import";

import {
    LocationProvider,
} from "./location-provider";

import {
    LocationContext,
} from "./context";

export function Location(props) {
    // const children = Children.only(props.children);
    const children = Array.isArray(props.children) ? props.children[0] : props.children;
    return (
        <LocationContext.Consumer>
            {(context: any) => {
                return context ? children(context) : (
                    <LocationProvider>{children}</LocationProvider>
                );
            }}
        </LocationContext.Consumer>
    );
}

export function ServerLocation({ url, children }) {
    return (
        <LocationContext.Provider
            value={{
                location: { pathname: url },
                navigate: () => {
                    throw new Error("You can't call navigate on the server.");
                },
            }}
        >
            {children}
        </LocationContext.Provider>
    );
}
