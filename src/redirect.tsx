import {
    h,
    Component,
} from "react-import";

import {
    insertParams,
    rest,
    defer,
} from "./lib/utils";

import {
    Location,
} from "./location";

function RedirectRequest(uri) {
    this.uri = uri;
}

export const isRedirect = (o) => o instanceof RedirectRequest;

export const redirectTo = (to) => {
    throw new RedirectRequest(to);
};

class RedirectImpl extends Component {
    public props: any;

    public state: any;
    public linkState: any;
    public context: any;
    public setState: any;
    public forceUpdate: any;
    // Support React < 16 with this hook
    public componentDidMount() {
        const { navigate, to, replace = true, state } = this.props;
        const props = rest(
            this.props,
            [
                "navigate",
                "to",
                "from",
                "replace",
                "state",
                "noThrow",
            ],
        );
        defer(() => {
            navigate(insertParams(to, props), { replace, state });
        });
    }

    public render() {
        const { navigate, to, from, replace, state, noThrow } = this.props;
        const props = rest(this.props, ["navigate", "to", "from", "replace", "state", "noThrow"]);
        if (!noThrow) {
            redirectTo(insertParams(to, props));
        }
        return null;
    }
}

export function Redirect(props) {
    return (
        <Location>
            {(locationContext) => <RedirectImpl {...locationContext} {...props} />}
        </Location>
    );
}
