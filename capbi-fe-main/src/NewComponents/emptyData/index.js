import styles from './index.module.css'
import cn from 'classnames'


function EmptyData({colSpan}) {
    return ( 
        <tbody>
            <tr>
                <td colSpan={colSpan} className={cn(styles.emptyData)}>
                    Không có thông tin 
                </td>
            </tr>
    </tbody>
        );
}

export default EmptyData;