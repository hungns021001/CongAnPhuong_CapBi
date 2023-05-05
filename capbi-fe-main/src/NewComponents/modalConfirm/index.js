import styles from "./index.module.css";
import cn from "classnames";
import { memo } from "react";
import Modal from 'react-modal'


const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        zIndex: 9999,
        padding: '0 0.8rem',
        background: 'rgba(3,3,3,0.1)',
        cursor: 'default',
    },
    content: {
        height: '18rem',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '360px',
        padding: '25px 0 12px',
        backgroundColor: 'var(--white-color)',
        borderRadius: '8px',
    }

};

function ModalConfirm({ description, deleteBtn, alertBtn, closeModal, backgroundColor, submitDelete }) {
    return (
        <Modal
            isOpen={true}
            onRequestClose={closeModal}
            style={customStyles}
        >
            <div>
                <p className={cn(styles.boxHeader)}>{description}</p>
                {deleteBtn && (
                    <div className={cn(styles.groupBtn)}>
                        <button onClick={closeModal} className={cn(styles.btnCancel)}>
                            Hủy
                        </button>
                        <button onClick={submitDelete} className={cn(styles.btnDelete)}>
                            Xóa
                        </button>
                    </div>
                )}
                {alertBtn && (
                    <div className={cn(styles.groupBtn)}>
                        <button onClick={closeModal} className={cn(styles.btnCancel)}>
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </Modal>

    );
}

export default memo(ModalConfirm);
