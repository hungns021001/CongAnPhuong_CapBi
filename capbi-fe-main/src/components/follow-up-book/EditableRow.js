import React, { useState } from "react";
import cn from "classnames";
import styles from "./style.module.css";
import { AiFillCloseCircle, AiFillCheckSquare } from "react-icons/ai";
import { deepObjectEqual } from "../../commonHandle";
import { apiServer, SuccessMessages, ErrorMessages, Text } from "../../constant";
import BaseAxios from "@/store/setUpAxios";

const EditableRow = ({ index, passport, handleCancelClick, updated }) => {
    const [editFullName, setEditFullName] = useState(passport.FullName);
    const [editDateOfBirth, setEditDateOfBirth] = useState(passport.Birthday);
    const [editSex, setEditSex] = useState(
        passport.Gender === Text.gender.number.man ? Text.gender.number.man : Text.gender.number.woman
    );
    const [editPermanentResidence, setEditPermanentResidence] = useState(passport.Staying);
    const [editConfirmedDate, setEditConfirmedDate] = useState(passport.ConfirmationDate);
    const [editInspectionOfficer, setEditInspectionOfficer] = useState(passport.FullNamePolice);
    const [editLeaderSign, setEditLeaderSign] = useState(passport.LeaderSign);

    const submitEdit = () => {
        const oldPassport = {
            id: passport.Id,
            fullName: passport.FullName,
            birthday: passport.Birthday,
            gender: passport.Gender,
            staying: passport.Staying,
            confirmationDate: passport.ConfirmationDate,
            fullNamePolice: passport.FullNamePolice,
            leaderSign: passport.LeaderSign,
        };
        const newPassport = {
            id: passport.Id,
            fullName: editFullName,
            birthday: editDateOfBirth,
            gender: editSex,
            staying: editPermanentResidence,
            confirmationDate: editConfirmedDate,
            fullNamePolice: editInspectionOfficer,
            leaderSign: editLeaderSign,
        };

        if (deepObjectEqual(oldPassport, newPassport) === true) {
            handleCancelClick();
        } else {
            BaseAxios({
                method: "POST",
                url: apiServer.passport.edit + passport.Id,
                data: newPassport,
            })
                .then(() => {
                    alert(SuccessMessages.edit);
                    handleCancelClick();
                    updated();
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
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="date"
                    value={editDateOfBirth}
                    onChange={(e) => setEditDateOfBirth(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <select className={cn(styles.selectEdit)} value={editSex} onChange={(e) => setEditSex(e.target.value)}>
                    <option value={Text.gender.number.man}>{Text.gender.string.man}</option>
                    <option value={Text.gender.number.woman}>{Text.gender.string.woman}</option>
                </select>
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="text"
                    value={editPermanentResidence}
                    onChange={(e) => setEditPermanentResidence(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="date"
                    value={editConfirmedDate}
                    onChange={(e) => setEditConfirmedDate(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="text"
                    required="required"
                    placeholder="Cán bộ kiểm tra..."
                    name="cbkt"
                    value={editInspectionOfficer}
                    onChange={(e) => setEditInspectionOfficer(e.target.value)}
                />
            </th>
            <th className={cn(styles.th)}>
                <input
                    className={cn(styles.input)}
                    type="text"
                    value={editLeaderSign}
                    onChange={(e) => setEditLeaderSign(e.target.value)}
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
