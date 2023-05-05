import React from "react";
import cn from "classnames";
import styles from "./style.module.css";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
const ReadOnlyRow = ({ index, tracker, handleEditClick, handleDeleteClick }) => {
    return (
        <tr>
            <td className={cn(styles.td)}>{index}</td>
            <td className={cn(styles.td)}>{tracker.DateSend}</td>
            <td className={cn(styles.td)}>{tracker.LicensePlates}</td>
            <td className={cn(styles.td)}>{tracker.Receiver}</td>
            <td className={cn(styles.td)}>{tracker.FinePaymentDate}</td>
            <td className={cn(styles.td)}>{tracker.Violation}</td>
            <td className={cn(styles.td)}>
                <button
                    type="button"
                    style={{
                        marginRight: 10,
                        background: "transparent",
                        border: "none",
                        fontSize: 18,
                        cursor: "pointer",
                        color: "red",
                    }}
                    onClick={(event) => handleEditClick(event, tracker)}
                >
                    <AiOutlineEdit />
                </button>
                <button
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: 18,
                        cursor: "pointer",
                        color: "violet",
                    }}
                    type="button"
                    onClick={() => handleDeleteClick(tracker.Id)}
                >
                    <AiFillDelete />
                </button>
            </td>
        </tr>
    );
};

export default ReadOnlyRow;
