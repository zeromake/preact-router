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
import {
    IsArray,
} from "./lib/utils";

export function Location(props) {
    // const children = Children.only(props.children);
    const children = IsArray(props.children) ? props.children[0] : props.children;
    const child: any = (context: any) => {
        return context ? children(context) : (
            <LocationProvider>{children}</LocationProvider>
        );
    };
    return (
        h(LocationContext.Consumer as any, null, child)
    );
}

export function ServerLocation({ url, children }) {
    return (
        h(LocationContext.Provider as any,
            {
                value: {
                    location: { pathname: url },
                    navigate: () => {
                        throw new Error("You can't call navigate on the server.");
                    },
                },
            },
            children,
        )
    );
}
