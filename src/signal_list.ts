import { State } from "./signal";

export interface StateList<T> extends State<T[]> {
    uget(index: number): T | undefined;
}

export class MutableStateList<T> extends State<T[]> implements StateList<T> {
    override value(): T[] {
        return this._value;
    }

    // Retrieves the value currently stored at this index in the statelist.
    uget(index: number): T | undefined {
        return this._value[index];
    }

    get(index: number): StateListAccess<T> {
        const access = new StateListAccess(this, index);
        this.dependents.push(access);
        return access;
    }
    
    // Sets a value in the state list, updating dependents.
    set(index: number, value: T): void {
        this._value[index] = value;
        this.pushNeedsRecomputationFlag();
    }

    // Splices a set into the current state list, updating dependents.
    splice(index: number, value: T): void {
        this._value.splice(index, 0, value);
    }
}

export class StateListAccess<T> extends State<T | undefined> {
    stateList: StateList<T>;
    index: number;

    constructor( stateList: StateList<T>, index: number ) {
        super(undefined as any);
        this.stateList = stateList;
        this.index = index;
        this.needsRecomputation = true;
    }

    override value(): T | undefined {
        if (this.needsRecomputation) {
            this._value = this.stateList.uget(this.index);
            this.needsRecomputation = false;
        }

        return this._value;
    }
}