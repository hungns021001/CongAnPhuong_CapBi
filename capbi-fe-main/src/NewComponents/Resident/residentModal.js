import styles from "./style.module.css";
import {
  Text,
  apiServer,
  SuccessMessages,
  ErrorMessages,
} from "../../constant";
import { checkIfEmptyValueExists } from "../../commonHandle";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

function ResidentModal({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataMain = useSelector((state) => state.vehicleResident.dataMain);
  const [readOnly, setReadOnly] = useState(true);
  const [date, setDate] = useState(formatDate(String(dataMain?.date)) || "");
  const [address, setAddress] = useState(dataMain?.address || "");
  const [host, setHost] = useState(dataMain?.host || "");
  const [fullName, setFullName] = useState(dataMain?.fullName || "");
  const [citizenNumber, setCitizenNumber] = useState(
    dataMain?.citizenNumber || ""
  );
  const [violationer, setViolationer] = useState(dataMain?.violationer || "");
  const [formProcessing, setFormProcessing] = useState(
    dataMain?.formProcessing || ""
  );
  const [policeCheck, setPoliceCheck] = useState(dataMain?.policeCheck || "");
  useEffect(() => {
    if (dataMain && dataMain.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setDate("");
    setAddress("");
    setHost("");
    setFullName("");
    setCitizenNumber("");
    setViolationer("");
    setFormProcessing("");
    setPoliceCheck("");
    setTextPlaceholder("textPlaceholder");
  };

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const inputRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault();
    let formateddate = checkFormatDateBeforeSubmit(date);
    let dataCreateTracker = {
      date: formateddate,
      address,
      host,
      fullName,
      citizenNumber,
      violationer,
      formProcessing,
      policeCheck,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!date) {
        const date = document.getElementById("date");
        date.style.border = Text.error.border;
      }
      if (address === "") {
        const address = document.getElementById("address");
        address.style.border = Text.error.border;
      }
      if (host === "") {
        const host = document.getElementById("host");
        host.style.border = Text.error.border;
      }
      if (!fullName) {
        const fullName = document.getElementById("fullName");
        fullName.style.border = Text.error.border;
      }
      if (citizenNumber === "") {
        const citizenNumber = document.getElementById("citizenNumber");
        citizenNumber.style.border = Text.error.border;
      }
      if (violationer === "") {
        const violationer = document.getElementById("violationer");
        violationer.style.border = Text.error.border;
      }
      if (formProcessing === "") {
        const formProcessing = document.getElementById("formProcessing");
        formProcessing.style.border = Text.error.border;
      }
      if (policeCheck === "") {
        const policeCheck = document.getElementById("policeCheck");
        policeCheck.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.resident.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataMain && dataMain.Id) {
        url = apiServer.resident.edit + dataMain.Id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
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
          <div id="date" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.date}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                ref={inputRef}
                onKeyDown={(e) => handleSubmitKeyDown(e)}
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
          <div id="address" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.address}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={address}
              onChange={(e) => {
                const address = document.getElementById("address");
                address.style.borderColor = "var(--border-color)";
                return setAddress(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="host" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.host}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="text"
                value={host}
                onChange={(e) => {
                  const host = document.getElementById("host");
                  host.style.borderColor = "var(--border-color)";
                  return setHost(e.target.value);
                }}
              />
            </div>
          </div>
          <div id="fullName" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.fullName}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField", "date")}
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
        </div>
        <div className={cx("text_1")}>
          <div id="citizenNumber" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.citizenNumber}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={citizenNumber}
              onChange={(e) => {
                const citizenNumber = document.getElementById("citizenNumber");
                citizenNumber.style.borderColor = "var(--border-color)";
                return setCitizenNumber(e.target.value);
              }}
            ></input>
          </div>
          <div id="violationer" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.violationer}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={violationer}
              onChange={(e) => {
                const violationer = document.getElementById("violationer");
                violationer.style.borderColor = "var(--border-color)";
                return setViolationer(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("text_1")}>
          <div id="formProcessing" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.formProcessing}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={formProcessing}
              onChange={(e) => {
                const formProcessing =
                  document.getElementById("formProcessing");
                formProcessing.style.borderColor = "var(--border-color)";
                return setFormProcessing(e.target.value);
              }}
            ></input>
          </div>
          <div id="policeCheck" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.residentbook.policeCheck}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={policeCheck}
              onChange={(e) => {
                const policeCheck = document.getElementById("policeCheck");
                policeCheck.style.borderColor = "var(--border-color)";
                return setPoliceCheck(e.target.value);
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

export default ResidentModal;
