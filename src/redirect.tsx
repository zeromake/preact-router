import {
    h,
    Component,
} from "react-import";

import {
    insertParams,
    defer,
} from "./lib/utils";

import {
    Location,
} from "./location";

import {
    navigateType,
    ILocationState,
    ILocationType,
} from "./types";

function RedirectRequest(uri) {
    this.uri = uri;
}

export const isRedirect = (o) => o instanceof RedirectRequest;

export const redirectTo = (to) => {
    throw new RedirectRequest(to);
};

interface IRedirectProps {
    key?: string;
    children?: any;
    className?: string;
    navigate: navigateType;
    from: string;
    to: string;
    replace?: boolean;
    noThrow?: boolean;
    state?: ILocationState;
    location: ILocationType;
    search?: boolean;
    hash?: boolean;
}

class RedirectImpl extends Component<IRedirectProps, any> {
    public static defaultProps = {
        search: true,
        hash: true,
    };
    public props: IRedirectProps;

    public state: any;
    public linkState: any;
    public context: any;
    public setState: any;
    public forceUpdate: any;
    public refs: any;
    // Support React < 16 with this hook
    public componentDidMount() {
        const { navigate, from, to, replace = true, state, noThrow, location, search, hash, ...props } = this.props;
        defer(() => {
            let href = insertParams(to, props);
            if (search && to.lastIndexOf("?") === -1 && location.search !== "") {
                href += location.search;
            }
            if (hash && to.lastIndexOf("#") === -1 && location.hash !== "") {
                href += "#" + location.hash;
            }
            navigate(href, { replace, state });
        });
    }

    public render() {
        const { navigate, to, from, replace, state, noThrow, location, search, hash, ...props } = this.props;
        // const props = rest(this.props, ["navigate", "to", "from", "replace", "state", "noThrow"]);
        if (!noThrow) {
            let href = insertParams(to, props);
            if (search && to.lastIndexOf("?") === -1 && location.search !== "") {
                href += location.search;
            }
            if (hash && to.lastIndexOf("#") === -1 && location.hash !== "") {
                href += "#" + location.hash;
            }
            redirectTo(href);
        }
        return null;
    }
}

export function Redirect(props) {
    return (
        <Location>
            {
                function RedirectLocation(locationContext) {
                    return <RedirectImpl {...locationContext} {...props} />;
                }
            }
        </Location>
    );
}
