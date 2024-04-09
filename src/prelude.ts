import { CompositePredicate, FrozenState, MutableState, State, StateZip, States } from "./signal";
import { MutableStateList } from "./signal_list";

export namespace Sx {
    /** Creates a new `MutableState<T>`, which can be used to create derived states. */
    export function state<T>(initialValue: T): MutableState<T> {
        return new MutableState(initialValue)
    }

    export type MaybeState<T> = State<T> | T;
    export function flatWrap<T>(initialValue: MaybeState<T>): State<T> {
        return initialValue instanceof State ? initialValue : new FrozenState(initialValue)
    }

    /** Creates a new `MutableState<T>`, which can be used to create derived states. */
    export function zip<Ts extends any[], U>(states: States<Ts>, predicate: CompositePredicate<Ts, U>): StateZip<Ts, U> {
        return new StateZip(states, predicate)
    }

    export function stateList<T>( list?: T[] ): MutableStateList<T> {
        return new MutableStateList(list ?? []);
    }
}