import { useEffect, useState } from "react";
import cn from "classnames";
import style from "./tdInput.module.css";

function TdInput({ value, className, idTracker, title = false }) {
    const [valInput, setValInput] = useState(value);
    const [pointerEvent, setPointerEvent] = useState("");
    const [hasTitle, setHasTitle] = useState(false);
    let userRole = 1;

    useEffect(() => {
        if (title) setHasTitle(true);
        if (userRole !== 1) setPointerEvent("none");
    }, [userRole]);

    const changeValueInput = (newValue) => {
        setValInput(newValue);
    };

    const saveChangedValues = () => {
        console.log(idTracker);
        // Call api to save and show notification
    };

    return (
        <input
            type="text"
            className={cn(style.tdInput, className)}
            style={{ pointerEvents: `${pointerEvent}` }}
            value={valInput}
            title={hasTitle ? title : undefined}
            onChange={(e) => changeValueInput(e.target.value)}
            onBlur={saveChangedValues}
        />
    );
}

export default TdInput;
