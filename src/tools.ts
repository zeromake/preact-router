import {
    findChildren,
    findProps,
    findNodeType,
} from "react-import";

import {
    validateRedirect,
    invariant,
} from "./lib/utils";

import {
    Redirect,
} from "./redirect";

const stripSlashes = (str: string) => str.replace(/(^\/+|\/+$)/g, "");

export function createRoute(basepath) {
    return (element) => {
        const props = findProps(element);
        const nodeType = findNodeType(element);
        invariant(
            props.path || props.default || nodeType === Redirect,
            `<Router>: Children of <Router> must have a \`path\` or \`default\` prop, or be a \`<Redirect>\`. None found on element type \`${
                nodeType
            }\``,
        );
        invariant(
            !(nodeType === Redirect && (!props.from || !props.to)),
            `<Redirect from="${props.from} to="${
                props.to
            }"/> requires both "from" and "to" props when inside a <Router>.`,
        );
        invariant(
            !(
                nodeType === Redirect &&
                !validateRedirect(props.from, props.to)
            ),
            `<Redirect from="${props.from} to="${
                props.to
            }"/> has mismatched dynamic segments, ensure both paths have the exact same dynamic segments.`,
        );

        if (props.default) {
            return { value: element, default: true };
        }

        const elementPath =
            nodeType === Redirect ? props.from : props.path;

        const path =
            elementPath === "/"
                ? basepath
                : `${stripSlashes(basepath)}/${stripSlashes(elementPath)}`;
        const children = findChildren(element);
        return {
            value: element,
            default: props.default,
            path: children ? `${stripSlashes(path)}/*` : path,
        };
    };
}
