import React, { useState } from "react";
import cn from "classnames";
import styles from "./style.module.css";
import { AiFillCloseCircle, AiFillCheckSquare } from "react-icons/ai";
import { deepObjectEqual } from "../../commonHandle";
import { apiServer, SuccessMessages, ErrorMessages } from "../../constant";
import BaseAxios from "@/store/setUpAxios";

const EditableRow = ({ index, tracker, handleCancelClick, updatedTracker }) => {
    const [editedValueDateSend, setEditedValueDateSend] = useState(tracker.DateSend);
    const [editedValueLicensePlates, setEditedValueLicensePlates] = useState(tracker.LicensePlates);
    const [editedValueReceiver, setEditedValueReceiver] = useState(tracker.Receiver);
    const [editedValueFinePaymentDate, setEditedValueFinePaymentDate] = useState(tracker.FinePaymentDate);
    const [editedValueViolation, setEditedValueViolation] = useState(tracker.Violation);

    const submitEdit = () => {
        const oldTracker = {
            id: tracker.Id,
            dateSend: tracker.DateSend,
            licensePlates: tracker.LicensePlates,
            receiver: tracker.Receiver,
            finePaymentDate: tracker.FinePaymentDate,
            violation: tracker.Violation,
        };

        const newTracker = {
            id: tracker.Id,
            dateSend: editedValueDateSend,
            licensePlates: editedValueLicensePlates.trim(),
            receiver: editedValueReceiver.trim(),
            finePaymentDate: editedValueFinePaymentDate,
            violation: editedValueViolation.trim(),
        };

        if (deepObjectEqual(oldTracker, newTracker) === true) {
            handleCancelClick();
        } else {
            BaseAxios({
                method: "POST",
                url: apiServer.accreditation.edit + tracker.Id,
                data: newTracker,
            })
                .then(() => {
                    alert(SuccessMessages.edit);
                    handleCancelClick();
                    updatedTracker();
                })
                .catch(() => {
                    alert(ErrorMessages.edit);
                });
        }
    };

    return (
        <tr>
            <th className={cn(styles.th)}>{index}</th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="date"
                    required="required"
                    value={editedValueDateSend}
                    onChange={(e) => setEditedValueDateSend(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="text"
                    required="required"
                    value={editedValueLicensePlates}
                    onChange={(e) => setEditedValueLicensePlates(e.target.value)}
                />
            </th>

            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="text"
                    required="required"
                    value={editedValueReceiver}
                    onChange={(e) => setEditedValueReceiver(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="date"
                    required="required"
                    value={editedValueFinePaymentDate}
                    onChange={(e) => setEditedValueFinePaymentDate(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="text"
                    required="required"
                    value={editedValueViolation}
                    onChange={(e) => setEditedValueViolation(e.target.value)}
                />
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
                    onClick={submitEdit}
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
export default EditableRow;
