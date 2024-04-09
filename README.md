# Femto TS

A simple library for creating reactive systems using functional-ish programming.

```ts
import { Sx } from "src/signal";

function App() {
    let count = Sx.state(0);
    let countText = count.map(x => `Counter: ${x}`);
    let countTextUpper = countText.map(String.prototype.toUpperCase);

    count.set(10);
    console.dir(countTextUpper.value()); // Should be 'COUNTER: 10'
}

App();
```
> [!INFO] 
> Check out index.ts!

It is similar to the [Current proposal for ECMAScript signals](https://github.com/proposal-signals/proposal-signals), but it doubles down on functional concepts. Basically, "States" are [functors](https://javascript.plainenglish.io/the-definite-guide-to-functors-in-js-6f5e82bd1dac). A functor in FP, is a "conceptual wrapper" -- you can put something in it to get extra functionality. Functors have an avaiable implementation of a "map" function (although not always called that) which creates a derived functor.

Javascript already has a few functor-likes, with a `map` implementation:

```ts
// Promise<number> is "number but later."
let p: Promise<number> = new Promise((rs, rj) => rs(1000));
let pstring: Promise<string> = p.then(x => `Value: ${x}`);

// Array<number> is "number but many."
let q = [ 1, 2, 3 ];
let qstring = q.map(x => `Value: ${x}`);

// MutableState<number> is "number but reactive."
let r = new MutableSignal(0);
let rstring = r.map(x => `Value: ${x}`);
```

This approach for the API allows highly-composable and easy-to-debug code, in a way where you can design your code non-reactively and think of reactivity later.

### Implementation

This library isn't the most efficient implementation of this concept. You could implement this in a much more efficient way with the same API, but it is beyond the scope of this project. You might use this project for a simple apps, or to test the concept of functional-reactive signals.

### Install

```bash
npm install femto-ts
```
