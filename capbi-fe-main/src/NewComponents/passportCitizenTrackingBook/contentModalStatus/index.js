import styles from "./index.module.css";
import { Text, apiServer, SuccessMessages, ErrorMessages } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import TextPassport from "../text";

const cx = classNames.bind(styles);

function ContentModal({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataPassport = useSelector(
    (state) => state.vehiclePassport.dataPassport
  );
  const [readOnly, setReadOnly] = useState(true);
  const [birthday, setBirthday] = useState(
    formatDate(String(dataPassport.birthday)) || ""
  );
  const [fullName, setFullName] = useState(dataPassport?.fullName || "");
  const [gender, setGender] = useState(dataPassport?.gender || "0");
  const [confirmationDate, setConfirmationDate] = useState(
    formatDate(String(dataPassport?.confirmationDate)) || ""
  );
  const [fullNamePolice, setFullNamePolice] = useState(
    dataPassport?.fullNamePolice || ""
  );
  const [leaderSign, setLeaderSign] = useState(dataPassport?.leaderSign || "");
  const [staying, setStaying] = useState(dataPassport?.staying || "");
  const inputRef = useRef()

  useEffect(() => {
    if (dataPassport && dataPassport.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setFullName("");
    setBirthday("");
    setGender("");
    setStaying("");
    setConfirmationDate("");
    setFullNamePolice("");
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
    let formatedBirthday = checkFormatDateBeforeSubmit(birthday);
    let formatedConfirmationDate =
      checkFormatDateBeforeSubmit(confirmationDate);
    let dataCreateTracker = {
      birthday: formatedBirthday,
      fullName,
      gender: gender,
      confirmationDate: formatedConfirmationDate,
      staying,
      leaderSign,
      fullNamePolice,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!birthday) {
        const birthday = document.getElementById("birthday");
        birthday.style.border = TextPassport.error.border;
      }
      if (gender === "") {
        const gender = document.getElementById("gender");
        gender.style.border = TextPassport.error.border;
      }
      if (staying === "") {
        const staying = document.getElementById("staying");
        staying.style.border = TextPassport.error.border;
      }
      if (!confirmationDate) {
        const confirmationDate = document.getElementById("confirmationDate");
        confirmationDate.style.border = TextPassport.error.border;
      }

      if (fullName === "") {
        const fullName = document.getElementById("fullName");
        fullName.style.border = TextPassport.error.border;
      }

      if (leaderSign === "") {
        const leaderSign = document.getElementById("leaderSign");
        leaderSign.style.border = TextPassport.error.border;
      }
      if (fullNamePolice === "") {
        const fullNamePolice = document.getElementById("fullNamePolice");
        fullNamePolice.style.border = TextPassport.error.border;
      }
    } else {
      let url = apiServer.passport.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataPassport && dataPassport.id) {
        url = apiServer.passport.edit + dataPassport.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataPassport.id;
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
          <div id="birthday" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {TextPassport.passport.birthday}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                ref={inputRef}
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
          </div>
          <div id="confirmationDate" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {TextPassport.passport.confirmationDate}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={confirmationDate}
                onChange={(e) => {
                  const confirmationDate = document.getElementById("birthday");
                  confirmationDate.style.borderColor = "var(--border-color)";
                  return setConfirmationDate(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(confirmationDate))}
                onChange={(e) =>
                  setConfirmationDate(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="fullName" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextPassport.passport.fullName}<span>* </span>
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
          <div id="gender" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextPassport.passport.gender}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              value={gender === "0" ? "Nữ" : "Nam"}
              onChange={(e) => {
                const gender = document.getElementById("gender");
                gender.style.borderColor = "var(--border-color)";
                return setGender(e.target.value);
              }}
            />
            <select
              className={cx("genderSelect")}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value={1}>Nam</option>
              <option value={0}>Nữ</option>
            </select>
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="staying" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextPassport.passport.staying}<span>* </span>
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
            />
          </div>
          <div id="fullNamePolice" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextPassport.passport.fullNamePolice}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={fullNamePolice}
              onChange={(e) => {
                const fullNamePolice =
                  document.getElementById("fullNamePolice");
                fullNamePolice.style.borderColor = "var(--border-color)";
                return setFullNamePolice(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="leaderSign" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextPassport.passport.leaderSign}<span>* </span>
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

export default ContentModal;
