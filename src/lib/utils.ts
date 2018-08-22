export function rest(s: any, e: string[]): any {
    const t = {};
    for (const p_ in s) {
        if (Object.prototype.hasOwnProperty.call(s, p_) && e.indexOf(p_) < 0) {
            t[p_] = s[p_];
        }
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") {
        for (let i: number = 0, p_ = Object.getOwnPropertySymbols(s); i < p_.length; i++) {
            if (e.indexOf(p_[i] as any) < 0) {
                t[p_[i]] = s[p_[i]];
            }
        }
    }
    return t;
}

function segmentize(uri: string): string[] {
  return uri
    // strip starting/ending slashes
    .replace(/(^\/+|\/+$)/g, "")
    .split("/");
}

export function invariant(condition, format, a?, b?, c?, d?, e?, f?) {
    if (!condition) {
        let error;
        if (format === undefined) {
            error = new Error(
                "Minified exception occurred; use the non-minified dev environment " +
                "for the full error message and additional helpful warnings.",
            );
        } else {
            const args = [a, b, c, d, e, f];
            let argIndex = 0;
            error = new Error(
                format.replace(/%s/g, () => args[argIndex++]),
            );
            error.name = "Invariant Violation";
        }
        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
    }
}

const paramRe = /^:(.+)/;

function isDynamic(segment) {
    return paramRe.test(segment);
}

export function validateRedirect(from, to) {
    const filter = (segment) => isDynamic(segment);
    const fromString = segmentize(from)
      .filter(filter)
      .sort()
      .join("/");
    const toString = segmentize(to)
      .filter(filter)
      .sort()
      .join("/");
    return fromString === toString;
}

export function insertParams(path, params) {
    const segments = segmentize(path);
    return (
        "/" +
        segments
        .map((segment) => {
            const match = paramRe.exec(segment);
            return match ? params[match[1]] : segment;
        })
        .join("/")
    );
}

const reservedNames = ["uri", "path"];
const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

const isRootSegment = (segment) => segment === "";
const isSplat = (segment) => segment === "*";

function rankRoute(route, index) {
    const score = route.default
      ? 0
      : segmentize(route.path).reduce((pscore: number, segment: string) => {
            pscore += SEGMENT_POINTS;
            if (isRootSegment(segment)) {
                pscore += ROOT_POINTS;
            } else if (isDynamic(segment)) {
                pscore += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
                pscore -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
                pscore += STATIC_POINTS;
            }
            return pscore;
        }, 0);
    return { route, score, index };
}

function rankRoutes(routes) {
    return routes
    .map(rankRoute)
    .sort(
        (a, b) =>
        a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index,
    );
}

export function pick(routes, uri) {
    let match;
    let default_;

    const [uriPathname] = uri.split("?");
    const uriSegments = segmentize(uriPathname);
    const isRootUri = uriSegments[0] === "";
    const ranked = rankRoutes(routes);

    for (let i = 0, l = ranked.length; i < l; i++) {
        let missed = false;
        const route = ranked[i].route;

        if (route.default) {
            default_ = {
                route,
                params: {},
                uri,
            };
            continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
            const routeSegment = routeSegments[index];
            const uriSegment = uriSegments[index];

            // const isSplat = routeSegment === "*";
            if (isSplat(routeSegment)) {
                // Hit a splat, just grab the rest, and return a match
                // uri:   /files/documents/work
                // route: /files/*
                params["*"] = uriSegments
                .slice(index)
                .map(decodeURIComponent)
                .join("/");
                break;
            }

            if (uriSegment === undefined) {
                // URI is shorter than the route, no match
                // uri:   /users
                // route: /users/:userId
                missed = true;
                break;
            }

            const dynamicMatch = paramRe.exec(routeSegment);

            if (dynamicMatch && !isRootUri) {
                const matchIsNotReserved = reservedNames.indexOf(dynamicMatch[1]) === -1;
                invariant(
                    matchIsNotReserved,
                    `<Router> dynamic segment "${
                        dynamicMatch[1]
                    }" is a reserved name. Please use a different name in path "${
                        route.path
                    }".`,
                );
                const value = decodeURIComponent(uriSegment);
                params[dynamicMatch[1]] = value;
            } else if (routeSegment !== uriSegment) {
                // Current segments don't match, not dynamic, not splat, so no match
                // uri:   /users/123/settings
                // route: /users/:id/profile
                missed = true;
                break;
            }
        }

        if (!missed) {
            match = {
                route,
                params,
                uri: "/" + uriSegments.slice(0, index).join("/"),
            };
            break;
        }
    }
    return match || default_ || null;
}

export const isBrowser = typeof window !== "undefined";

export const global: any = (function _() {
    if (isBrowser) {
        return window;
    }
    let local;
    if (typeof global !== "undefined") {
        local = global;
    } else if (typeof self !== "undefined") {
        local = self;
    } else {
        try {
            local = Function("return this")();
        } catch (e) {
            throw new Error("global object is unavailable in this environment");
        }
    }
    return local;
})();

const canUsePromise = "Promise" in global;

function getPromiseDefer() {
    const promiseDefer = Promise.resolve();
    return (fn: () => void) => promiseDefer.then(fn);
}
/**
 * 异步调度方法，异步的执行传入的方法
 */
export const defer: (fn: () => void) => void = canUsePromise ? getPromiseDefer() : setTimeout;

/**
 * 判断一个字符串的开头子字符串
 * @param str
 * @param search
 */
export function startsWith(str: string, search: string): boolean {
    return str.substr(0, search.length) === search;
}

function addQuery(pathname: string, query: string): string {
    if (query && query !== "") {
        return `${pathname}?${query}`;
    }
    return pathname;
}

export function resolve(to: string, base: string): string {
    // /foo/bar, /baz/qux => /foo/bar
    if (startsWith(to, "/")) {
        return to;
    }

    const [toPathname, toQuery] = to.split("?");
    const [basePathname] = base.split("?");

    const toSegments = segmentize(toPathname);
    const baseSegments = segmentize(basePathname);

    // ?a=b, /users?b=c => /users?a=b
    if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
    }

    // profile, /users/789 => /users/789/profile
    if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");
        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    }

    // ./         /users/123  =>  /users/123
    // ../        /users/123  =>  /users
    // ../..      /users/123  =>  /
    // ../../one  /a/b/c/d    =>  /a/b/one
    // .././one   /a/b/c/d    =>  /a/b/c/one
    const allSegments = baseSegments.concat(toSegments);
    const segments = [];
    for (let i = 0, l = allSegments.length; i < l; i++) {
        const segment = allSegments[i];
        if (segment === "..") {
            segments.pop();
        } else if (segment !== ".") {
            segments.push(segment);
        }
    }

    return addQuery("/" + segments.join("/"), toQuery);
}

export function match(path, uri) {
    return pick([{ path }], uri);
}
