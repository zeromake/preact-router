import {
    h,
} from "react-import";
import {
    BaseContext,
} from "./context";
import {
    Location,
} from "./location";

import {
    resolve,
    match,
    IsArray,
} from "./lib/utils";

import {
    navigateType,
    ILocationType,
} from "./types";

export function Match(
    { path, children }: {
        path: string,
        children: (opt: {
            navigate: navigateType,
            location: ILocationType,
            match: null|{
                [name: string]: any;
                uri: string,
                path: string,
            },
        }) => any,
    }) {
    return (
        <BaseContext.Consumer>
            {({ baseuri }: {baseuri: string, basepath: string}) => (
                <Location>
                    {({ navigate, location }: {navigate: navigateType, location: ILocationType}) => {
                        const resolvedPath = resolve(path, baseuri);
                        const result = match(resolvedPath, location.pathname);
                        children = IsArray(children) ? children[0] : children;
                        return children({
                            navigate,
                            location,
                            match: result
                                ? {
                                    ...result.params,
                                    uri: result.uri,
                                    path,
                                }
                                : null,
                        });
                    }}
                </Location>
            )}
        </BaseContext.Consumer>
    );
}
