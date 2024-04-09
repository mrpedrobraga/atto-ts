import { Sx } from "src/prelude";

function App() {
    let todos = Sx.stateList([ 1, 2, 3 ]);
    let todosString = todos.map(x => x.concat(4, 5, 6));
}

App();