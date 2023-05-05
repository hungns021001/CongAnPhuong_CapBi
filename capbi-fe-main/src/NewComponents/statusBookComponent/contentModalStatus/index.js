import styles from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import { Text, apiServer, ErrorMessages, SuccessMessages } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";
import TextStatusBook from "../text";
const cx = classNames.bind(styles);
function ContentModalStatus({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataStatusBook = useSelector(
    (state) => state.vehicleDataStatusBookSlice.dataStatusBook
  );
  const [readOnly, setReadOnly] = useState(true);
  const [dateTime, setDateTime] = useState(
    formatDate(String(dataStatusBook.dateTime)) || ""
  );
  const [personOnDuty, setPersonOnDuty] = useState(
    dataStatusBook?.personOnDuty || ""
  );
  const [details, setDetails] = useState(dataStatusBook?.details || "");

  const [handler, setHandler] = useState(dataStatusBook?.handler || "");
  const [note, setNote] = useState(dataStatusBook?.note || "");

  const inputRef = useRef()

  useEffect(() => {
    if (dataStatusBook && dataStatusBook.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setDateTime("");
    setPersonOnDuty("");
    setDetails("");
    setHandler("");
    setNote("");
  };

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formateDateTime = checkFormatDateBeforeSubmit(dateTime);

    let dataCreateTracker = {
      dateTime: formateDateTime,
      personOnDuty,
      details,
      handler,
      note,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!dateTime) {
        const dateTime = document.getElementById("dateTime");
        dateTime.style.border = TextStatusBook.error.border;
      }
      if (personOnDuty === "") {
        const personOnDuty = document.getElementById("personOnDuty");
        personOnDuty.style.border = TextStatusBook.error.border;
      }
      if (details === "") {
        const details = document.getElementById("details");
        details.style.border = TextStatusBook.error.border;
      }
      if (handler === "") {
        const handler = document.getElementById("handler");
        handler.style.border = TextStatusBook.error.border;
      }
      if (note === "") {
        const note = document.getElementById("note");
        note.style.border = TextStatusBook.error.border;
      }
    } else {
      let url = apiServer.statusBookRouter.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataStatusBook && dataStatusBook.id) {
        url = apiServer.statusBookRouter.edit + dataStatusBook.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataStatusBook.id;
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
          error(errorMessage);
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
        <div className={cx("dateTime")}>
          <div id="dateTime" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {TextStatusBook.statusBook.dateTime}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
                ref={inputRef}
                readOnly={readOnly}
                className={cx("input", "date")}
                required
                type="date"
                value={dateTime}
                onChange={(e) => {
                  const dateTime = document.getElementById("dateTime");
                  dateTime.style.borderColor = "var(--border-color)";
                  return setDateTime(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("input", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(dateTime))}
                onChange={(e) =>
                  setDateTime(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>
        </div>
        <br></br>
        <div className={cx("group")}>
          <div id="personOnDuty" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextStatusBook.statusBook.personOnDuty}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={personOnDuty}
              onChange={(e) => {
                const personOnDuty = document.getElementById("personOnDuty");
                personOnDuty.style.borderColor = "var(--border-color)";
                return setPersonOnDuty(e.target.value);
              }}
            />
          </div>
          <div id="handler" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextStatusBook.statusBook.handler}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={handler}
              onChange={(e) => {
                const handler = document.getElementById("handler");
                handler.style.borderColor = "var(--border-color)";
                return setHandler(e.target.value);
              }}
            />
          </div>
        </div>

        <div id="details" className={cx("details")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextStatusBook.statusBook.details}<span>* </span>
            </label>
            <textarea
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={details}
              onChange={(e) => {
                const details = document.getElementById("details");
                details.style.borderColor = "var(--border-color)";
                return setDetails(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
        <br></br>
        <div id="note" className={cx("note")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextStatusBook.statusBook.note}<span>* </span>
            </label>
            <textarea
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={note}
              onChange={(e) => {
                const note = document.getElementById("note");
                note.style.borderColor = "var(--border-color)";
                return setNote(e.target.value);
              }}
            ></textarea>
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

export default ContentModalStatus;
