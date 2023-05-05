import React from "react";
import cn from "classnames";
import styles from "./style.module.css";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
const ReadOnly = ({ contacts, handleEditClick, handleDelete, index }) => {
  return (
    <tr>
      <td className={cn(styles.td)}>{index + 1}</td>
      <td className={cn(styles.td)}>{contacts.DateTime}</td>
      <td className={cn(styles.td)}>{contacts.PersonOnDuty}</td>
      <td className={cn(styles.td)}>{contacts.Details}</td>
      <td className={cn(styles.td)}>{contacts.Handler}</td>
      <td className={cn(styles.td)}>{contacts.Note}</td>

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
          onClick={(event) => handleEditClick(event, contacts, index)}
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
          onClick={() => handleDelete(contacts.Id)}
        >
          <AiFillDelete />
        </button>
      </td>
    </tr>
  );
};

export default ReadOnly;
