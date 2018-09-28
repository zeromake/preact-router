declare module "react-import" {
    import {
        createElement as h,
        Component,
        PureComponent,
        cloneElement,
        Children,
        createContext,
        forwardRef,
    } from "react";
    import {
        findDOMNode,
    } from "react-dom";
    const findProps: any;
    const findChildren: any;
    const findNodeType: any;
    const PolyfillLifecycle: (component: any) => void;
    export {
        h,
        Component,
        cloneElement,
        Children,
        findProps,
        findDOMNode,
        findChildren,
        createContext,
        PureComponent,
        findNodeType,
        forwardRef,
        PolyfillLifecycle,
    };
}
