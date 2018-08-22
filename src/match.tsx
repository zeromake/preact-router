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
} from "./lib/utils";

export function Match({ path, children }) {
    return (
        <BaseContext.Consumer>
            {({ baseuri }) => (
                <Location>
                    {({ navigate, location }) => {
                        const resolvedPath = resolve(path, baseuri);
                        const result = match(resolvedPath, location.pathname);
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
