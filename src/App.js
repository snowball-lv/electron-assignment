import React, {useState} from "react";

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
            <p>Count: {count}</p>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
        </div>
    );
}
