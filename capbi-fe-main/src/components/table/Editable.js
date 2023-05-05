import React, {useState} from "react";
import cn from "classnames";
import styles from "./style.module.css";

import { AiFillCloseCircle, AiFillCheckSquare } from "react-icons/ai";
import { apiServer, ErrorMessages, SuccessMessages } from "@/constant";
import { deepObjectEqual } from "@/commonHandle";
import BaseAxios from "@/store/setUpAxios";
const Editable = ({
  index,
  updatedContacts,
  handleCancelClick,
  contacts,
}) => {
  const [editedDateTime, setEditedDateTime] = useState(contacts.DateTime);
  const [editedPersonOnDuty, setEditedPersonOnDuty] = useState(
    contacts.PersonOnDuty
  );
  const [editedDetails, setEditedDetails] = useState(contacts.Details);
  const [editedHandler, setEditedHandler] = useState(contacts.Handler);
  const [editedNote, setEditedNote] = useState(contacts.Note);

  const sumbit = (e) => {
    e.preventDefault();
    const oldContacts = {
      id: contacts.Id,
      dateTime: contacts.DateTime,
      personOnDuty: contacts.PersonOnDuty,
      details: contacts.Details,
      handler: contacts.Handler,
      note: contacts.Note,
    };
    const newContacts = {
      id: contacts.Id,
      dateTime: editedDateTime,
      personOnDuty: editedPersonOnDuty.trim(),
      details: editedDetails.trim(),
      handler: editedHandler.trim(),
      note: editedNote.trim(),
    };
    if (deepObjectEqual(oldContacts, newContacts) === true) {
      handleCancelClick();
    } else {
      BaseAxios({
        method: "POST",
        url: apiServer.statusBookRouter.edit + contacts.Id,
        data: newContacts,
      })
        .then(() => {
          alert(SuccessMessages.edit);
          handleCancelClick();
          updatedContacts();
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
          placeholder="Enter a name..."
          value={editedDateTime}
          onChange={(e) => setEditedDateTime(e.target.value)}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Người trực..."
          value={editedPersonOnDuty}
          onChange={(e) => setEditedPersonOnDuty(e.target.value)}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Nội dung tình hình..."
          value={editedDetails}
          onChange={(e) => setEditedDetails(e.target.value)}
        ></input>
      </th>

      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Người xử lý..."
          value={editedHandler}
          onChange={(e) => setEditedHandler(e.target.value)}
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
          onClick={sumbit}
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
export default Editable;
