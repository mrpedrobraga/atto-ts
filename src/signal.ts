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
}

export class FrozenState<T> extends State<T> {
    override value(): T {
        return this._value;
    }
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

    override value(): T { return this._value; }
};

export type SinglePredicate<T, U> = (x: T) => U;

export class StateMap<T, U> extends State<U> {
    private source: State<T>;
    predicate: SinglePredicate<T, U>;

    constructor(source: State<T>, predicate: SinglePredicate<T, U>) {
        super(undefined as any);
        this.source = source;
        this.predicate = predicate;
        this.needsRecomputation = true;
    }

    override value(): U {
        if (this.needsRecomputation) {
            const sourceValue = this.source.value();
            this._value = this.predicate.call(sourceValue, sourceValue);
            this.needsRecomputation = false;
        }
        
        return this._value;
    }
};

export type CompositePredicate<TSources extends any[], U> = (...args: TSources) => U;
export type States<TSources extends any[]> = { [K in keyof TSources]: State<TSources[K]> };

export class StateZip<TSources extends any[], U> extends State<U> {
    sources: States<TSources>;
    predicate: CompositePredicate<TSources, U>;
    
    constructor(sources: States<TSources>, predicate: CompositePredicate<TSources, U>) {
        super(undefined as any);
        this.predicate = predicate;
        this.sources = sources;
        this.sources.forEach(s => s.dependents.push(this));
        this.needsRecomputation = true;
    }

    override value(): U {
        if (this.needsRecomputation) {
            const initialSourcesValues: TSources = this.sources.map(x => x.value()) as TSources;
            this._value = (this.predicate.call(initialSourcesValues, ...initialSourcesValues));
            this.needsRecomputation = false;
        }
        
        return this._value;
    }
};