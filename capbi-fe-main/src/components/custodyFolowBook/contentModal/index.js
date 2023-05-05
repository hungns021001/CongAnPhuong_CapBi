import styles from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import { apiServer, ErrorMessages, SuccessMessages, Text } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";

const cx = classNames.bind(styles);

function ContentModal({ handleCloseModal, toggleIsUpdateSuccess, descTitle, addEvent, successToast, errorToast }) {
    const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
    const dataMain = useSelector((state) => state.custodyFolowSlice.dataMain);
    console.log(dataMain)
    const [readOnly, setReadOnly] = useState(true);
    const [returned, setReturned] = useState(dataMain.returned || "");
    const [licensePlates, setLicensePlates] = useState(dataMain.licensePlates || "");
    const [dateOfViolation, setDateOfViolation] = useState(formatDate(String(dataMain.dateOfViolation)) || "");
    const [returnDate, setReturnDate] = useState(formatDate(String(dataMain.returnDate)) || "");
    const [fullName, setFullName] = useState(dataMain.fullName || "");
    const [onHold, setOnHold] = useState(dataMain.onHold || "");
    const [officerReturns, setOfficerReturns] = useState(dataMain.officerReturns || "");

    const inputRef = useRef()

    useEffect(() => {
        if (dataMain && dataMain.id) setTextPlaceholder("dateText");
        if (addEvent) setReadOnly(false);
        inputRef.current.focus()
    }, []);

    const resetInputsModal = () => {
        setReturned("");
        setLicensePlates("");
        setDateOfViolation("");
        setReturnDate("");
        setFullName("");
        setOnHold("")
        setOfficerReturns("")
        setTextPlaceholder("textPlaceholder");
    };

    const checkFormatDateBeforeSubmit = (date) => {
        if (String(date).slice(0, 3).includes("-") === false) date = formatDate(String(date));
        return date;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        let formatedDateOfViolation = checkFormatDateBeforeSubmit(dateOfViolation);
        let formatedReturnDate = checkFormatDateBeforeSubmit(returnDate);
        let dataCreateTracker = {
            dateOfViolation: formatedDateOfViolation,
            licensePlates,
            returnDate: formatedReturnDate,
            returned,
            fullname: fullName,
            onHold,
            officerReturns
        };
        let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
        console.log(typeof formatedDateOfViolation);
        console.log(typeof formatedReturnDate);
        if (isExitsEmptyData && (formatedReturnDate === "undefined" || formatedDateOfViolation === "undefined" || formatedDateOfViolation === "" || formatedReturnDate === "")) {
            if (formatedDateOfViolation === "undefined" || formatedDateOfViolation === "") {
                const dateOfViolationa = document.getElementById("dateOfViolation");
                dateOfViolationa.style.border = Text.error.border;
            }
            if (licensePlates === "") {
                const licensePlates = document.getElementById("licensePlates");
                licensePlates.style.border = Text.error.border;
            }
            if (returned === "") {
                const returned = document.getElementById("returned");
                returned.style.border = Text.error.border;
            }
            if (formatedReturnDate === "undefined" || formatedReturnDate === "") {
                const returnDatea = document.getElementById("returnDate");
                returnDatea.style.border = Text.error.border;
            }
            if (fullName === "") {
                const fullName = document.getElementById("fullName");
                fullName.style.border = Text.error.border;
            }
            if (onHold === "") {
                const onHold = document.getElementById("onHold");
                onHold.style.border = Text.error.border;
            }
            if (officerReturns === "") {
                const officerReturns = document.getElementById("officerReturns");
                officerReturns.style.border = Text.error.border;
            }
        } else {
            let url = 'api/impound/create-handle';
            let errorMessage = ErrorMessages.create;
            let successMessage = SuccessMessages.create;
            if (dataMain && dataMain.id) {
                url = 'api/impound/update-handle/' + dataMain.id;
                successMessage = SuccessMessages.edit;
                errorMessage = ErrorMessages.edit;
                dataCreateTracker.id = dataMain.id;
            }
            BaseAxios({
                method: "POST",
                url: url,
                data: dataCreateTracker,
            })
                .then(() => {
                    toggleIsUpdateSuccess();
                    successToast(successMessage);
                    resetInputsModal();
                    handleCloseModal();
                })
                .catch(() => {
                    handleCloseModal();
                    errorToast(errorMessage);
                }).catch((err) => {
                    if (err.response.data.data === "Currently you do not have permission to edit") {
                        notifyError("Hiện tại bạn không có quyền chỉnh sửa")
                        handleCloseModal();
                    }
                })
        }
    };

    const handleSubmitKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSubmit(e);
        }
    };

    return (
        <form className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}>
            <div className={cx("inputArea")}>
                <div className={cx("groupDays")}>
                    <div id="returnDate" className={cx("formField")}>
                        <label className={cx("labelField")} htmlFor="">
                            {Text.impoundbook.returnDate}<span>* </span>
                        </label>
                        <div className={cx("groupDate")}>
                            <input
                                onKeyDown={(e) => handleSubmitKeyDown(e)}
                                ref={inputRef}
                                readOnly={readOnly}
                                className={cx("inputField", "date")}
                                required
                                type="date"
                                value={returnDate}
                                onChange={(e) => {
                                    const returnDate = document.getElementById("returnDate");
                                    returnDate.style.borderColor = "var(--border-color)";
                                    return setReturnDate(e.target.value);
                                }}
                            />
                            {readOnly && <input
                                className={cx("inputField", "date", `${textPlaceholder}`)}
                                required
                                type="text"
                                value={formatDate(String(returnDate))}
                                onChange={(e) => setReturnDate(formatDate(String(e.target.value)))}
                                readOnly
                            />}
                        </div>
                    </div>
                    <div id="dateOfViolation" className={cx("formField")}>
                        <label className={cx("labelField")} htmlFor="">
                            {Text.impoundbook.dateOfViolation}<span>* </span>
                        </label>
                        <div className={cx("groupDate")}>
                            <input
                                onKeyDown={(e) => handleSubmitKeyDown(e)}
                                readOnly={readOnly}
                                className={cx("inputField", "date")}
                                required
                                type="date"
                                value={dateOfViolation}
                                onChange={(e) => {
                                    const dateOfViolation = document.getElementById("dateOfViolation");
                                    dateOfViolation.style.borderColor = "var(--border-color)";
                                    return setDateOfViolation(e.target.value);
                                }}
                            />
                            {readOnly && <input
                                className={cx("inputField", "date", `${textPlaceholder}`)}
                                required
                                type="text"
                                value={formatDate(String(dateOfViolation))}
                                onChange={(e) => setDateOfViolation(formatDate(String(e.target.value)))}
                                readOnly
                            />}
                        </div>
                    </div>
                </div>
                <div className={cx("finedPersonInfo")}>
                    <div id="licensePlates" className={cx("formField")}>
                        <label className={cx("labelField")} htmlFor="">
                            {Text.impoundbook.licensePlates}<span>* </span>
                        </label>
                        <input
                            onKeyDown={(e) => handleSubmitKeyDown(e)}
                            readOnly={readOnly}
                            className={cx("inputField")}
                            required
                            type="text"
                            value={licensePlates}
                            onChange={(e) => {
                                const licensePlates = document.getElementById("licensePlates");
                                licensePlates.style.borderColor = "var(--border-color)";
                                return setLicensePlates(e.target.value);
                            }}
                        />
                    </div>
                    <div id="returned" className={cx("formField")}>
                        <label className={cx("labelField")} htmlFor="">
                            {Text.impoundbook.returned}<span>* </span>
                        </label>
                        <input
                            onKeyDown={(e) => handleSubmitKeyDown(e)}
                            readOnly={readOnly}
                            className={cx("inputField")}
                            required
                            type="text"
                            value={returned}
                            onChange={(e) => {
                                const returned = document.getElementById("returned");
                                returned.style.borderColor = "var(--border-color)";
                                return setReturned(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={cx("finedPersonInfo")}>
                    <div id="officerReturns" className={cx("formField")}>
                        <label className={cx("labelField")} htmlFor="">
                            {Text.impoundbook.officerReturns}<span>* </span>
                        </label>
                        <input
                            onKeyDown={(e) => handleSubmitKeyDown(e)}
                            readOnly={readOnly}
                            className={cx("inputField")}
                            required
                            type="text"
                            value={officerReturns}
                            onChange={(e) => {
                                const officerReturns = document.getElementById("officerReturns");
                                officerReturns.style.borderColor = "var(--border-color)";
                                return setOfficerReturns(e.target.value);
                            }}
                        />
                    </div>
                    <div id="fullName" className={cx("formField")}>
                        <label className={cx("labelField")} htmlFor="">
                            {Text.impoundbook.fullname}<span>* </span>
                        </label>
                        <input
                            onKeyDown={(e) => handleSubmitKeyDown(e)}
                            readOnly={readOnly}
                            className={cx("inputField")}
                            required
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                                const fullName = document.getElementById("fullName");
                                fullName.style.borderColor = "var(--border-color)";
                                return setFullName(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div id="onHold" className={cx("violation")}>
                    <div className={cx("formField")}>
                        <label className={cx("labelField")} htmlFor="">
                            {Text.impoundbook.onHold}<span>* </span>
                        </label>
                        <textarea
                            onKeyDown={(e) => handleSubmitKeyDown(e)}
                            readOnly={readOnly}
                            className={cx("inputField")}
                            required
                            type="text"
                            value={onHold}
                            onChange={(e) => {
                                const onHold = document.getElementById("onHold");
                                onHold.style.borderColor = "var(--border-color)";
                                return setOnHold(e.target.value);
                            }}
                        ></textarea>
                    </div>
                </div>
            </div>
            <div className={cx("groupBtn")}>
                <span className={cx("validatorText")}>{Text.inputRequired}</span>
                <button onClick={handleCloseModal} className={cx("btnCancel")}>
                    {Text.CRUD.cancel}
                </button>
                {!readOnly && (
                    <button type="submit" className={cx("btnSubmit")} onClick={handleSubmit}>
                        Xong
                    </button>
                )}
                {readOnly && (
                    <button onClick={() => setReadOnly(false)} className={cx("btnSubmit")}>
                        {descTitle}
                    </button>
                )}
            </div>
        </form>
    );
}

export default ContentModal;
