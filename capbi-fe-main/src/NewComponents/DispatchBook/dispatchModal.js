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

function DispatchModal({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataMain = useSelector((state) => state.vehicleDispatch.dataMain);
  const [readOnly, setReadOnly] = useState(true);
  const [dateTime, setDatetime] = useState(
    formatDate(String(dataMain.dateTime)) || ""
  );
  const [dispatchID, setDispatchID] = useState(dataMain?.dispatchID || "");
  const [releaseDate, setReleaseDate] = useState(
    formatDate(String(dataMain.releaseDate)) || ""
  );
  const [subject, setSubject] = useState(dataMain?.subject || "");
  const [agencyissued, setAgencyIssued] = useState(dataMain.agencyissued || "");
  const [receiver, setReceiver] = useState(dataMain?.receiver || "");
  const inputRef = useRef()

  useEffect(() => {
    if (dataMain && dataMain.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setDatetime("");
    setDispatchID("");
    setReleaseDate("");
    setSubject("");
    setAgencyIssued("");
    setReceiver("");
    setTextPlaceholder("textPlaceholder");
  };

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formatedDatetime = checkFormatDateBeforeSubmit(dateTime);
    let formatedReleaseDate = checkFormatDateBeforeSubmit(releaseDate);
    let dataCreateTracker = {
      dateTime: formatedDatetime,
      dispatchID,
      releaseDate: formatedReleaseDate,
      subject,
      agencyissued,
      receiver,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!dateTime) {
        const dateTime = document.getElementById("dateTime");
        dateTime.style.border = Text.error.border;
      }
      if (dispatchID === "") {
        const dispatchID = document.getElementById("dispatchID");
        dispatchID.style.border = Text.error.border;
      }
      if (releaseDate === "") {
        const releaseDate = document.getElementById("releaseDate");
        releaseDate.style.border = Text.error.border;
      }
      if (subject === "") {
        const subject = document.getElementById("subject");
        subject.style.border = Text.error.border;
      }
      if (agencyissued === "") {
        const agencyissued = document.getElementById("agencyissued");
        agencyissued.style.border = Text.error.border;
      }
      if (receiver === "") {
        const receiver = document.getElementById("receiver");
        receiver.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.dispatch.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataMain && dataMain.id) {
        url = apiServer.dispatch.edit + dataMain.id;
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
          errorToast(errorMessage);
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
          <div id="dateTime" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titledispatch.dateTime}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                ref={inputRef}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={dateTime}
                onChange={(e) => {
                  const dateTime = document.getElementById("dateTime");
                  dateTime.style.borderColor = "var(--border-color)";
                  return setDatetime(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(dateTime))}
                onChange={(e) =>
                  setDatetime(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>
          <div id="releaseDate" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titledispatch.releaseDate}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}

                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={releaseDate}
                onChange={(e) => {
                  const releaseDate = document.getElementById("releaseDate");
                  releaseDate.style.borderColor = "var(--border-color)";
                  return setReleaseDate(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(releaseDate))}
                onChange={(e) =>
                  setReleaseDate(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="dispatchID" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titledispatch.dispatchID}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={dispatchID}
              onChange={(e) => {
                const dispatchID = document.getElementById("dispatchID");
                dispatchID.style.borderColor = "var(--border-color)";
                return setDispatchID(e.target.value);
              }}
            />
          </div>
          <div id="receiver" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titledispatch.receiver}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={receiver}
              onChange={(e) => {
                const receiver = document.getElementById("receiver");
                receiver.style.borderColor = "var(--border-color)";
                return setReceiver(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="subject" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titledispatch.subject}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}

                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="text"
                value={subject}
                onChange={(e) => {
                  const subject = document.getElementById("subject");
                  subject.style.borderColor = "var(--border-color)";
                  return setSubject(e.target.value);
                }}
              />
            </div>
          </div>
          <div id="agencyissued" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.titledispatch.agencyIssued}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={agencyissued}
              onChange={(e) => {
                const agencyissued = document.getElementById("agencyissued");
                agencyissued.style.borderColor = "var(--border-color)";
                return setAgencyIssued(e.target.value);
              }}
            ></input>
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

export default DispatchModal;
