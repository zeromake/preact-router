import * as React from "react-import";
import { h } from "react-import";
import {
    BaseContext,
} from "./context";
import {
    resolve,
    startsWith,
} from "./lib/utils";
import {
    Location,
} from "./location";
import {
    ILocationState,
    RefType,
    IBaseObject,
    ILocationType,
    navigateType,
} from "./types";

const forwardRef = React.forwardRef || ((C: any) => C);
const k = (opt?: IGetProps) => ({} as IBaseObject);
function shouldNavigate(event: MouseEvent): boolean {
    return !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

interface IGetProps {
    isCurrent: boolean;
    isPartiallyCurrent: boolean;
    href: string;
    location: ILocationType;
}
interface ILinkProps {
    to?: string;
    href?: string;
    state?: ILocationState;
    innerRef?: RefType;
    ref?: RefType;
    onClick?: (e: MouseEvent) => void;
    replace?: boolean;
    getProps?: (opt?: IGetProps) => IBaseObject;
}

function LinkRender(props: ILinkProps, ref) {
    // const deepProps = rest(props, ["innerRef"]);
    const { innerRef, ...deepProps } = props;
    return (
        <BaseContext.Consumer>
            {({ baseuri }) => (
                <Location>
                    {({ location, navigate }: {location: ILocationType, navigate: navigateType}) => {
                        const { to, href, state, replace, getProps = k, ...anchorProps } = deepProps;
                        const phref = resolve(to || href, baseuri);
                        const isCurrent = location.pathname === phref;
                        const isPartiallyCurrent = startsWith(location.pathname, phref);
                        const onClick = (event: MouseEvent) => {
                            if (anchorProps.onClick) {
                                anchorProps.onClick(event);
                            }
                            if (shouldNavigate(event)) {
                                event.preventDefault();
                                navigate(phref, { state, replace });
                            }
                        };

                        return (
                            <a
                                ref={ref || innerRef}
                                aria-current={isCurrent ? "page" : undefined}
                                {...anchorProps}
                                {...getProps({ isCurrent, isPartiallyCurrent, href: phref, location })}
                                href={phref}
                                onClick={onClick}
                            />
                        );
                    }}
                </Location>
            )}
        </BaseContext.Consumer>
    );
}

export const Link = forwardRef(LinkRender);
