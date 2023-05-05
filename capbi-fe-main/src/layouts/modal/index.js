import cn from 'classnames'
import styles from './index.module.css'
import {AiOutlineCloseCircle} from 'react-icons/ai'


function ModalLayout({children,closeModal}) {
    return ( 
        <div className={cn(styles.wrapper)}>
            <AiOutlineCloseCircle onClick={closeModal} className={cn(styles.closeIcon)}/>
            {children}
        </div>
     );
}

export default ModalLayout;