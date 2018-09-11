import {
    ServerLocation,
    Location,
} from "./location";

import {
    Redirect,
    isRedirect,
    redirectTo,
} from "./redirect";

import {
    Router,
} from "./router";

import {
    Route,
    DRouter,
} from "./route";

import {
    globalHistory,
    createHistory,
    createMemorySource,
} from "./lib/history";

import { Link } from "./link";
import { LocationProvider } from "./location-provider";
import { Match } from "./match";
import { createHashSource } from "./lib/hash-history";

export {
    Link,
    Location,
    LocationProvider,
    Match,
    Redirect,
    Router,
    ServerLocation,
    createHistory,
    createMemorySource,
    createHashSource,
    isRedirect,
    redirectTo,
    Route,
    DRouter,
    globalHistory,
};
