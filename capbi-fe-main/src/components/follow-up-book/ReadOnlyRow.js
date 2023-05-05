import React from "react";
import cn from "classnames";
import styles from "./style.module.css";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import formatDate from "../../formatTime";
import { Text } from "@/constant";

const ReadOnlyRow = ({ passport, handleEditClick, handleDeleteClick, index }) => {
    return (
        <tr>
            <td className={cn(styles.td)}>{index + 1}</td>
            <td className={cn(styles.td)}>{passport.FullName}</td>
            <td className={cn(styles.td)}>{passport.Birthday && formatDate(passport.Birthday)}</td>
            <td className={cn(styles.td)}>
                {passport.Gender === Text.gender.number.man ? Text.gender.string.man : Text.gender.string.woman}
            </td>
            <td className={cn(styles.td)}>{passport.Staying}</td>
            <td className={cn(styles.td)}>{passport.ConfirmationDate && formatDate(passport.ConfirmationDate)}</td>
            <td className={cn(styles.td)}>{passport.FullNamePolice}</td>
            <td className={cn(styles.td)}>{passport.LeaderSign}</td>
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
                    onClick={(event) => handleEditClick(event, passport)}
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
                    onClick={() => handleDeleteClick(passport.Id)}
                >
                    <AiFillDelete />
                </button>
            </td>
        </tr>
    );
};

export default ReadOnlyRow;
