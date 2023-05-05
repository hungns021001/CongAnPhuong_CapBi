import React, { useState } from "react";
import cn from "classnames";
import styles from "./style.module.css";

import { AiFillCloseCircle, AiFillCheckSquare } from "react-icons/ai";
import { deepObjectEqual } from "@/commonHandle";
import BaseAxios from "@/store/setUpAxios";
import { apiServer, ErrorMessages, SuccessMessages } from "@/constant";
const Editableble = ({ index, updatedGet, handleCancelClick, get }) => {
  const [editedDateOfViolation, setEditedDateOfViolation] = useState(
    get.DateOfViolation
  );
  const [editedViolation, setEditedViolation] = useState(get.Violation);
  const [editedAddressViolation, setEditedAddressViolation] = useState(
    get.AddressViolation
  );
  const [editedNote, setEditedNote] = useState(get.Note);

  const submit = (e) => {
    e.preventDefault();
    const oldGet = {
      id: get.Id,
      dateOfViolation: get.DateOfViolation,
      violation: get.Violation,
      addressViolation: get.AddressViolation,
      note: get.Note,
    };
    const newGet = {
      id: get.Id,
      dateOfViolation: editedDateOfViolation,
      violation: editedViolation.trim(),
      addressViolation: editedAddressViolation.trim(),
      note: editedNote.trim(),
    };

    if (deepObjectEqual(oldGet, newGet) === true) {
      handleCancelClick();
    } else {
      BaseAxios({
        method: "POST",
        url: apiServer.nothandle.edit + get.Id,
        data: newGet,
      })
        .then(() => {
          alert(SuccessMessages.edit);
          handleCancelClick();
          updatedGet();
        })
        .catch(() => {
          alert(ErrorMessages.edit);
        });
    }
  };

  return (
    <tr>
      <th className={cn(styles.th)}>{index + 1}</th>

      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="date"
          required="required"
          value={editedDateOfViolation}
          onChange={(e) => setEditedDateOfViolation(e.target.value)}
        />
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Lỗi vi phạm..."
          value={editedViolation}
          onChange={(e) => setEditedViolation(e.target.value)}
        />
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Nơi vi phạm..."
          value={editedAddressViolation}
          onChange={(e) => setEditedAddressViolation(e.target.value)}
        ></input>
      </th>

      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Ghi chú..."
          value={editedNote}
          onChange={(e) => setEditedNote(e.target.value)}
        ></input>
      </th>

      <th className={cn(styles.th)}>
        <button
          type="submit"
          style={{
            marginRight: 10,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "green",
          }}
          onClick={submit}
        >
          <AiFillCheckSquare />
        </button>
        <button
          type="button"
          style={{
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "red",
          }}
          onClick={handleCancelClick}
        >
          <AiFillCloseCircle />
        </button>
      </th>
    </tr>
  );
};
export default Editableble; 
