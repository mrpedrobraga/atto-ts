import { Sx } from "src/signal";

function App() {
    let count = Sx.state(0);
    let countText = count.map(x => `Counter: ${x}`);
    let countTextUpper = countText.map(String.prototype.toUpperCase);

    count.set(10);
    console.dir(countTextUpper.value()); // Should be 'COUNTER: 10'
}

App();