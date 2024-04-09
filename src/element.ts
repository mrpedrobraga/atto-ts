import { State } from "./signal";

// An UI element, which can contain reactive children or properties;
export type UIElement = { tag: string, children: UIArgument[] };

// An argument when creating a UIElement, which might be reactive!
export type UIArgument = State<string> | string | State<UIElement> | UIElement | Record<string, State<any>> | Record<string, any>;

export namespace UI {
    export function el(tag: string, ...children: UIArgument[]) {
        return { tag, children }
    }

    export function group(...children: UIArgument[]) {
        return { tag: "group", children }
    }
}