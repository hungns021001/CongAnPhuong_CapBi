import styles from "./index.module.css";
import { Text, apiServer, SuccessMessages, ErrorMessages } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";
import { useEffect, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

function ContentModalCalendar({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataCalendar = useSelector(
    (state) => state.vehicleCalendar.dataCalendar
  );
  const [readOnly, setReadOnly] = useState(true);

  const [date, setDate] = useState(
    formatDate(String(dataCalendar?.date)) || ""
  );
  const [location, setLocation] = useState(dataCalendar?.location || "");

  const [force, setForce] = useState(dataCalendar?.force || "");

  const [mission, setMission] = useState(dataCalendar?.mission || "");

  const [note, setNote] = useState(dataCalendar?.note || "");

  useEffect(() => {
    if (dataCalendar && dataCalendar.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
  }, []);

  const resetInputsModal = () => {
    setDate("");
    setLocation("");
    setForce("");
    setMission("");
    setNote("");

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

    let dataCreateTracker = {
      date: formatedDate,
      location,
      force,
      mission,
      note,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!date) {
        const date = document.getElementById("date");
        date.style.border = Text.error.border;
      }
      if (location === "") {
        const location = document.getElementById("location");
        location.style.border = Text.error.border;
      }
      if (force === "") {
        const force = document.getElementById("force");
        force.style.border = Text.error.border;
      }
      if (mission === "") {
        const mission = document.getElementById("mission");
        mission.style.border = Text.error.border;
      }
      if (note === "") {
        const note = document.getElementById("note");
        note.style.border = Text.error.border;
      }

      // if (result === "") {
      //   const result = document.getElementById("result");
      //   result.style.border = Text.error.border;
      // }
    } else {
      let url = apiServer.calendar.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataCalendar && dataCalendar.id) {
        url = apiServer.calendar.edit + dataCalendar.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataCalendar.id;
      }
      BaseAxios({
        method: "POST",
        url: url,
        data: dataCreateTracker,
      })
        .then(() => {
          handleCloseModal();
          toggleIsUpdateSuccess();
          successToast(successMessage);
          resetInputsModal();
        })
        .catch(() => {
          handleCloseModal();
          errorToast(errorMessage);
        });
    }
  };

  const handleSubmitKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
  const handleAddrTypeChange = (e) => {
    setResult(e.target.value);
  };
  return (
    <form
      className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}
    >
      <div className={cx("inputArea")}>
        <div className={cx("groupDays")}>
          <div id="date" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.eventBook.date}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
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
          <div id="location" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.eventBook.location}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={location}
              onChange={(e) => {
                const location = document.getElementById("location");
                location.style.borderColor = "var(--border-color)";
                return setLocation(e.target.value);
              }}
            />
          </div>
        </div>

        <div className={cx("finedPersonInfo")}>
          <div id="force" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.eventBook.force}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={force}
              onChange={(e) => {
                const force = document.getElementById("force");
                force.style.borderColor = "var(--border-color)";
                return setForce(e.target.value);
              }}
            />
          </div>

          <div id="mission" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.eventBook.mission}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={mission}
              onChange={(e) => {
                const mission = document.getElementById("mission");
                mission.style.borderColor = "var(--border-color)";
                return setMission(e.target.value);
              }}
            />
          </div>
        </div>

        <div className={cx("finedPersonInfo")}>
          <div id="note" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.eventBook.note}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={note}
              onChange={(e) => {
                const note = document.getElementById("note");
                note.style.borderColor = "var(--border-color)";
                return setNote(e.target.value);
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

export default ContentModalCalendar;
