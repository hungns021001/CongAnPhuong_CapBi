import styles from './index.module.css'
import cn from 'classnames'
import { memo } from 'react';

function CheckAuth() {
    return (
        <div className={cn(styles.wrapper)}>
            <div className={cn(styles.ldsEllipsis)}>
                <div></div>
                <div></div>
                <div></div>
            </div>

        </div>
    );
}

export default memo(CheckAuth);