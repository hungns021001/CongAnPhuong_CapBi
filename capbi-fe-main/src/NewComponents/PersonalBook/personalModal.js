import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { checkIfEmptyValueExists } from "../../commonHandle";
import {
  ErrorMessages,
  SuccessMessages,
  Text,
  apiServer,
} from "../../constant";
import styles from "./style.module.css";

const cx = classNames.bind(styles);

function PersonalModal({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataMain = useSelector((state) => state.vehicleConfirmation.dataMain);
  const [readOnly, setReadOnly] = useState(true);
  const [date, setDate] = useState(formatDate(String(dataMain.date)) || "");
  const [fullName, setFullName] = useState(dataMain?.fullName || "");
  const [birthday, setBirthday] = useState(
    formatDate(String(dataMain?.birthday)) || ""
  );
  const [staying, setStaying] = useState(dataMain?.staying || "");
  const [grantReason, setGrantReason] = useState(dataMain?.grantReason || "");
  const [verifier, setVerifier] = useState(dataMain?.verifier || "");
  const [leaderSign, setLeaderSign] = useState(dataMain.leaderSign || "");

  const inputRef = useRef()

  useEffect(() => {
    if (dataMain && dataMain.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setDate("");
    setFullName("");
    setBirthday("");
    setStaying("");
    setGrantReason("");
    setVerifier("");
    setLeaderSign("");
    setTextPlaceholder("textPlaceholder");
  };

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formatedDate = checkFormatDateBeforeSubmit(date);
    let formatedbirthday = checkFormatDateBeforeSubmit(birthday);
    let dataCreateTracker = {
      date: formatedDate,
      fullName,
      birthday: formatedbirthday,
      staying,
      // grantReason,
      verifier,
      // leaderSign,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!date) {
        const date = document.getElementById("date");
        date.style.border = Text.error.border;
      }
      if (fullName === "") {
        const fullName = document.getElementById("fullName");
        fullName.style.border = Text.error.border;
      }
      if (!birthday) {
        const birthday = document.getElementById("birthday");
        birthday.style.border = Text.error.border;
      }
      if (staying === "") {
        const staying = document.getElementById("staying");
        staying.style.border = Text.error.border;
      }
      if (verifier === "") {
        const verifier = document.getElementById("verifier");
        verifier.style.border = Text.error.border;
      }
    } else {

      let url = apiServer.confirmation.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataMain && dataMain.id) {
        url = apiServer.confirmation.edit + dataMain.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataMain.id;

      }
      BaseAxios({
        method: "POST",
        url: url,
        data: { ...dataCreateTracker, grantReason, leaderSign },
      })
        .then(() => {
          toggleIsUpdateSuccess();
          successToast(successMessage);
          resetInputsModal();
          handleCloseModal();
        })
        .catch(() => {
          errorToast(errorMessage);
        })
        .catch((err) => {
          if (
            err.response.data.data ===
            "Currently you do not have permission to edit"
          ) {
            notifyError("Hiện tại bạn không có quyền chỉnh sửa");
            handleCloseModal();
          }
        });
    }
  };

  const handleSubmitKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <form
      className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}
    >
      <div className={cx("inputArea")}>
        <div className={cx("groupDays")}>
          <div id="date" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titlepersonal.date}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                ref={inputRef}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={date}
                onChange={(e) => {
                  const date = document.getElementById("date");
                  date.style.borderColor = "var(--border-color)";
                  return setDate(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(date))}
                onChange={(e) => setDate(formatDate(String(e.target.value)))}
                readOnly
              />}
            </div>
          </div>
          <div id="fullName" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titlepersonal.fullName}<span>* </span>
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
        <div className={cx("finedPersonInfo")}>
          <div id="birthday" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titlepersonal.birthday}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={birthday}
                onChange={(e) => {
                  const birthday = document.getElementById("birthday");
                  birthday.style.borderColor = "var(--border-color)";
                  return setBirthday(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(birthday))}
                onChange={(e) =>
                  setBirthday(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>{" "}
          <div id="staying" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titlepersonal.staying}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={staying}
              onChange={(e) => {
                const staying = document.getElementById("staying");
                staying.style.borderColor = "var(--border-color)";
                return setStaying(e.target.value);
              }}
            ></input>
          </div>
        </div>
        <div className={cx("text_1")}>
          <div id="grantReason" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titlepersonal.grantReason}
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={grantReason}
              onChange={(e) => {
                const grantReason = document.getElementById("grantReason");
                grantReason.style.borderColor = "var(--border-color)";
                return setGrantReason(e.target.value);
              }}
            />
          </div>
          <div id="verifier" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titlepersonal.verifier}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={verifier}
              onChange={(e) => {
                const verifier = document.getElementById("verifier");
                verifier.style.borderColor = "var(--border-color)";
                return setVerifier(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("text_1")}>
          <div id="leaderSign" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titlepersonal.leaderSign}
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={leaderSign}
              onChange={(e) => {
                const leaderSign = document.getElementById("leaderSign");
                leaderSign.style.borderColor = "var(--border-color)";
                return setLeaderSign(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className={cx("groupBtn")}>
        <div className={cx("setText")}>
          <span className={cx("validatorText")}>{Text.inputRequired}</span>
        </div>
        <div className={cx("setButton")}>
          <button onClick={handleCloseModal} className={cx("btnCancel")}>
            {Text.CRUD.cancel}
          </button>
          {!readOnly && (
            <button
              type="submit"
              className={cx("btnSubmit")}
              onClick={handleSubmit}
            >
              Xong
            </button>
          )}
          {readOnly && (
            <button
              onClick={() => setReadOnly(false)}
              className={cx("btnSubmit")}
            >
              {descTitle}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default PersonalModal;
