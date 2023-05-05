import { Text } from "@/constant";
import cn from "classnames";
import styles from "./styles.module.css";

function NoData(col) {
    return (
        <tr>
            <td className={cn(styles.td)} colSpan={col.col}>
                {Text.noDataInTable}
            </td>
        </tr>
    );
}

export default NoData;
