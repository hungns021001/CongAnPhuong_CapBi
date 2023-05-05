import cn from "classnames";
import { useEffect, useRef } from "react";
import styles from "./index.module.css";

function ModalForeignerTracking({ children, handleCloseModal }) {
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

export default ModalForeignerTracking;
