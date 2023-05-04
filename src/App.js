import React, {useState} from "react";
import "./App.css"

export default function App() {
    const [count, setCount] = useState(0);
    const updateCounter = (newval) => {
        window.electronAPI.updateCounter(newval);
        setCount(newval);
    };
    const increment = () => updateCounter(count + 1);
    const decrement = () => updateCounter(count - 1);
    window.electronAPI.onSetCounter((e, v) => {
        setCount(v);
    });
    return (
        <div>
            <p class={"text"}>Count: {count}</p>
            <button onClick={decrement}>-1</button>
            <button onClick={increment}>+1</button>
        </div>
    );
}
