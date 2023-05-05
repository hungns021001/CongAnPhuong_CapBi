import styles from "./index.module.css";
import cn from "classnames";
import { useEffect, useRef } from "react";
import { Text, SuccessMessages, ErrorMessages } from "../../../constant";

function ModalConfirm({
  description,
  successBtn,
  deleteBtn,
  alertBtn,
  closeModal,
  backgroundColor,
  handleDeleteFollowTheText,
}) {
  //   const divRefs = useRef(null);
  //   useEffect(() => {
  //     function handleClickOutside(event) {
  //       if (divRefs.current && !divRefs.current.contains(event.target)) {
  //         closeModal();
  //       }
  //     }
  //     document.addEventListener("mousedown", handleClickOutside);

  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [divRefs]);

  return (
    <div
      style={{ backgroundColor: `${backgroundColor}` }}
      className={cn(styles.wrapper)}
    >
      <div className={cn(styles.boxConfirm)}>
        <p className={cn(styles.boxHeader)}>{description}</p>
        {deleteBtn && (
          <div className={cn(styles.groupBtn)}>
            <button onClick={closeModal} className={cn(styles.btnCancel)}>
              {Text.CRUD.cancel}
            </button>
            <button
              onClick={handleDeleteFollowTheText}
              className={cn(styles.btnDelete)}
            >
              {Text.CRUD.delete}
            </button>
          </div>
        )}
        {alertBtn && (
          <div className={cn(styles.groupBtn)}>
            <button onClick={closeModal} className={cn(styles.btnCancel)}>
              {Text.CRUD.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalConfirm;
