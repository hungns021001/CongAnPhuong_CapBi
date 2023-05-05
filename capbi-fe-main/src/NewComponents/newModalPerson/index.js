import cn from "classnames";
import styles from "./index.module.css";
import { useEffect, useRef } from "react";

function ModalPerson({ children, handleCloseModal }) {
    const divRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (divRef.current && !divRef.current.contains(event.target)) handleCloseModal();
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [divRef]);

    return (
        <div className={cn(styles.wrapper)}>
            <div className={cn(styles.boxContent)} ref={divRef}>
                <div className={cn(styles.bodyModal)}>{children}</div>
            </div>
        </div>
    );
}

export default ModalPerson;
