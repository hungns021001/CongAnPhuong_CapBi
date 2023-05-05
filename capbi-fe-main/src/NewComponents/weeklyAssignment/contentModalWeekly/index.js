import styles from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import { Text, apiServer, ErrorMessages, SuccessMessages } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";
import { notifyError } from "@/notify";
const cx = classNames.bind(styles);
function ContentModalWeekly({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataWeeklyAssignment = useSelector(
    (state) => state.vehicleWeeklyAssignment.dataWeeklyAssignment
  );
  const [readOnly, setReadOnly] = useState(true);
  const [date, setDate] = useState(
    formatDate(String(dataWeeklyAssignment.date)) || ""
  );
  const [days, setDays] = useState(dataWeeklyAssignment?.days || "");

  const [captain, setCaptain] = useState(dataWeeklyAssignment?.captain || "");
  const [inHour, setInHour] = useState(dataWeeklyAssignment?.inHour || "");
  const [overTime, setOverTime] = useState(
    dataWeeklyAssignment?.overTime || ""
  );
  const [onDuty, setOnDuty] = useState(dataWeeklyAssignment?.onDuty || "");
  const [patrolShiftOne, setPatrolShiftOne] = useState(
    dataWeeklyAssignment?.patrolShiftOne || ""
  );
  const [patrolShiftTwo, setPatrolShiftTwo] = useState(
    dataWeeklyAssignment?.patrolShiftTwo || ""
  );

  const inputRef = useRef()

  useEffect(() => {
    if (dataWeeklyAssignment && dataWeeklyAssignment.id)
      setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);
  const resetInputsModal = () => {
    setDate("");
    setDays("");
    setCaptain("");
    setInHour("");
    setOverTime("");
    setOnDuty("");
    setPatrolShiftOne("");
    setPatrolShiftTwo("");
  };
  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let formateDate = checkFormatDateBeforeSubmit(date);
    let dataCreateTracker = {
      date: formateDate,
      days,
      captain,
      inHour,
      overTime,
      onDuty,
      patrolShiftOne,
      patrolShiftTwo,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!date) {
        const date = document.getElementById("date");
        date.style.border = Text.error.border;
      }
      if (days === "") {
        const days = document.getElementById("days");
        days.style.border = Text.error.border;
      }
      if (captain === "") {
        const captain = document.getElementById("captain");
        captain.style.border = Text.error.border;
      }
      if (inHour === "") {
        const inHour = document.getElementById("inHour");
        inHour.style.border = Text.error.border;
      }
      if (overTime === "") {
        const overTime = document.getElementById("overTime");
        overTime.style.border = Text.error.border;
      }

      if (onDuty === "") {
        const onDuty = document.getElementById("onDuty");
        onDuty.style.border = Text.error.border;
      }
      if (patrolShiftOne === "") {
        const patrolShiftOne = document.getElementById("patrolShiftOne");
        patrolShiftOne.style.border = Text.error.border;
      }
      if (patrolShiftTwo === "") {
        const patrolShiftTwo = document.getElementById("patrolShiftTwo");
        patrolShiftTwo.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.weeklyAssignment.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataWeeklyAssignment && dataWeeklyAssignment.id) {
        url = apiServer.weeklyAssignment.edit + dataWeeklyAssignment.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataWeeklyAssignment.id;
      }
      BaseAxios({
        method: "POST",
        url: url,
        data: dataCreateTracker,
      })
        .then((res) => {
          toggleIsUpdateSuccess();
          successToast(successMessage);
          resetInputsModal();
          handleCloseModal();
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
        <div className={cx("group")}>
          <div id="date" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.dataWeeklyAssignment.date}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                ref={inputRef}
                readOnly={readOnly}
                className={cx("input", "date")}
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
                className={cx("input", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(date))}
                onChange={(e) => setDate(formatDate(String(e.target.value)))}
                readOnly
              />}
            </div>
          </div>
          <div id="days" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.dataWeeklyAssignment.day}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={days}
              onChange={(e) => {
                const days = document.getElementById("days");
                days.style.borderColor = "var(--border-color)";
                return setDays(e.target.value);
              }}
            />
          </div>
        </div>

        <div className={cx("group")}>
          <div id="captain" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.dataWeeklyAssignment.captain}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={captain}
              onChange={(e) => {
                const captain = document.getElementById("captain");
                captain.style.borderColor = "var(--border-color)";
                return setCaptain(e.target.value);
              }}
            />
          </div>
          <div id="onDuty" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.dataWeeklyAssignment.onDuty}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={onDuty}
              onChange={(e) => {
                const onDuty = document.getElementById("onDuty");
                onDuty.style.borderColor = "var(--border-color)";
                return setOnDuty(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("group")}>
          <div id="inHour" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.placeHolder.dataWeeklyAssignment.inHour}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={inHour}
              onChange={(e) => {
                const inHour = document.getElementById("inHour");
                inHour.style.borderColor = "var(--border-color)";
                return setInHour(e.target.value);
              }}
            />
          </div>
          <div id="overTime" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.placeHolder.dataWeeklyAssignment.overTime}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={overTime}
              onChange={(e) => {
                const overTime = document.getElementById("overTime");
                overTime.style.borderColor = "var(--border-color)";
                return setOverTime(e.target.value);
              }}
            />
          </div>
        </div>

        <div className={cx("group")}>
          <div id="patrolShiftOne" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.placeHolder.dataWeeklyAssignment.patrolShiftOne}
              <span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={patrolShiftOne}
              onChange={(e) => {
                const patrolShiftOne =
                  document.getElementById("patrolShiftOne");
                patrolShiftOne.style.borderColor = "var(--border-color)";
                return setPatrolShiftOne(e.target.value);
              }}
            />
          </div>
          <div id="patrolShiftTwo" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.placeHolder.dataWeeklyAssignment.patrolShiftTwo}
              <span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={patrolShiftTwo}
              onChange={(e) => {
                const patrolShiftTwo =
                  document.getElementById("patrolShiftTwo");
                patrolShiftTwo.style.borderColor = "var(--border-color)";
                return setPatrolShiftTwo(e.target.value);
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

export default ContentModalWeekly;
