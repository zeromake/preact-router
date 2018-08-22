import {
    createContext,
} from "react-import";

function createNamedContext(name: string, defaultValue?: any) {
    const Ctx = createContext(defaultValue);
    Ctx.Consumer.displayName = `${name}.Consumer`;
    Ctx.Provider.displayName = `${name}.Provider`;
    return Ctx;
}

export const LocationContext = createNamedContext("Location");

export const BaseContext = createNamedContext("Base", { baseuri: "/", basepath: "/" });

export const FocusContext = createNamedContext("Focus");
