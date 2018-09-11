interface IHashLocation {
    pathname: string;
    search: string;
    hash: string;
}

function getHashPath(source: any): string {
    return source.location.hash.substr(1);
}

function pushHashPath(source: any, path: string) {
    return (source.location.hash = path);
}

function replaceHashPath(source: any, path: string) {
    const hashIndex = source.location.href.indexOf("#");
    source.location.replace(
        source.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + "#" + path,
    );
}

function getState(source: any, path?: string): IHashLocation {
    const href = path ? path : getHashPath(source);
    const urls = href.split("#");
    const [pathSearch = "/", hash = ""] = urls;
    const [pathname = "/", search = ""] = pathSearch.split("?");
    return {
        pathname,
        search: search === "" ? "" : "?" + search,
        hash: hash === "" ? "" : "#" + hash,
    };
}

function resolveInitialState(source, state) {
    if (state.pathname === "") {
        replaceHashPath(source, "/");
    }
}

export function createHashSource(source: any = window) {
    let pState = getState(source);
    resolveInitialState(source, pState);
    return {
        get location() {
            return {
                ...source.location,
                ...getState(source),
            };
        },
        addEventListener(name, fn) {
            source.addEventListener(name, fn);
        },
        removeEventListener(name, fn) {
            source.removeEventListener(name, fn);
        },
        history: {
            get state() {
                return pState;
            },
            pushState(stateObj, _, uri) {
                pState = getState(source, uri);
                pushHashPath(source, uri);
            },
            replaceState(stateObj, _, uri) {
                pState = getState(source, uri);
                replaceHashPath(source, uri);
            },
            go: source.history.go.bind(source.history),
        },
    };
}
