import { state } from "src/signal";

function App() {
    const s = state(0)

    const other = s
        .map(x => `  Counter: ${x}  `)
        .map(String.prototype.toUpperCase)
        .map(String.prototype.trim)

    s.set(10);

    console.dir(other.value());
}

App();