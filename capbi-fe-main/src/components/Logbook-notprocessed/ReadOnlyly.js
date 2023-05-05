import React from "react";
import cn from "classnames";
import styles from "./style.module.css";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
const ReadOnlyly = ({ get, handleDeleteClick, handleEditClick, index }) => {
  return (
    <tr>
      <td className={cn(styles.td)}>{index + 1}</td>
      <td className={cn(styles.td)}>{get.DateOfViolation}</td>
      <td className={cn(styles.td)}>{get.Violation}</td>
      <td className={cn(styles.td)}>{get.AddressViolation}</td>
      <td className={cn(styles.td)}>{get.Note}</td>

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
          onClick={(event) => handleEditClick(event, get, index)}
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
          onClick={() => handleDeleteClick(get.Id)}
        >
          <AiFillDelete />
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyly;
