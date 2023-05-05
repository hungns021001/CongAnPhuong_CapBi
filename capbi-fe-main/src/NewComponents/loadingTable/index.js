import styles from './index.module.css'
import cn from 'classnames'

function LoadingTable() {
    return ( 
        <div className={cn(styles.ldsEllipsis)}><div></div><div></div><div></div><div></div></div>
     );
}

export default LoadingTable;