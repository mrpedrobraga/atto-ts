export interface Functor<T> {
    /** Maps a predicate to the functor, returning a new modified functor. */
    map<U>( predicate: SinglePredicate<T, U> ): Functor<U>;
}

export class StateContext {
    states: State<unknown>[]

    constructor() {
        this.states = [];
    }
}

/** A container for a single value which might change. */
export abstract class State<T> implements Functor<T> {
    dependents: State<any>[] = [];
    protected needsRecomputation: boolean = false;
    protected _value: T;

    constructor(initialValue: T) {
        this._value = initialValue;
    }
    
    /** Returns the current value of the state. Only computed when changed. */
    abstract value(): T;

    /** Creates a new signal derived from this one. */
    map<U>( predicate: SinglePredicate<T, U> ): StateMap<T, U> {
        const newState = new StateMap<T, U>(this, predicate);
        this.dependents.push(newState);
        return newState;
    }

    pushNeedsRecomputationFlag(): void {
        for (const dep of this.dependents) {
            dep.needsRecomputation = true;
            dep.pushNeedsRecomputationFlag();
        }
    }
};

/** Creates a new `MutableState<T>`, which can be used to create derived states. */
export function state<T>(initialValue: T): MutableState<T> {
    return new MutableState(initialValue)
}

export class MutableState<T> extends State<T> {
    constructor(initialValue: T) {
        super(initialValue);
    }

    /** Updates the value of the state and pushes "changed" down the graph. */
    set( newValue: T ): void {
        this._value = newValue
        this.pushNeedsRecomputationFlag();
    }

    value(): T { return this._value; }
};

export type SinglePredicate<T, U> = (x: T) => U;

export class StateMap<T, U> extends State<U> {
    private source: State<T>;
    predicate: SinglePredicate<T, U>;

    constructor(source: State<T>, predicate: SinglePredicate<T, U>) {
        const sourceValue = source.value();
        super(predicate.call(sourceValue, sourceValue));
        this.source = source;
        this.predicate = predicate;
    }

    value(): U {
        if (this.needsRecomputation) {
            const sourceValue = this.source.value();
            this._value = this.predicate.call(sourceValue, sourceValue);
            this.needsRecomputation = false;
        }
        
        return this._value;
    }
};