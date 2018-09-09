declare module "react-import" {
    import {
        h,
        Component,
        PureComponent,
        findDOMNode,
        cloneElement,
        Children,
        createContext,
        forwardRef,
    } from "zreact";
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
