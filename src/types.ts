import {
    Component,
} from "react-import";

export interface ILocationState extends IBaseObject {
    key?: string;
}

export interface INavigateOpt {
    state?: ILocationState;
    replace?: boolean;
}

export type navigateType = (to: string|number, optiosn?: INavigateOpt) => void;

type RefValue = Component<any, any>|Element|Node|null;

interface IObjectRef {
    current: RefValue;
}

type FunRef = (node: RefValue) => void;

export type RefType = IObjectRef|FunRef;

export interface IBaseObject {
    [name: string]: any;
}

export interface ILocationType extends Location {
    searchParams?: URLSearchParams;
    state: ILocationState;
    key: string;
}
