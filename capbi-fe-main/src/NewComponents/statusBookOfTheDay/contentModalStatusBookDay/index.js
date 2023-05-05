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

function ContentModalStatusBookDay({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataStatusBookDay = useSelector(
    (state) => state.vehicleWeeklyStatusBookDay.dataStatusBookDay
  );
  const [readOnly, setReadOnly] = useState(true);
  const [date, setDate] = useState(
    formatDate(String(dataStatusBookDay.date)) || ""
  );
  const [forceOnDuty, setForceOnDuty] = useState(
    dataStatusBookDay?.forceOnDuty || ""
  );
  const [caseName, setCaseName] = useState(dataStatusBookDay?.caseName || "");

  const [location, setLocation] = useState(dataStatusBookDay?.location || "");
  const [content, setContent] = useState(dataStatusBookDay?.content || "");
  const [receive, setReceive] = useState(dataStatusBookDay?.receive || "");
  const [custody, setCustody] = useState(dataStatusBookDay?.custody || "");
  const [returns, setReturns] = useState(dataStatusBookDay?.returns || "");
  const [handOver, setHandOver] = useState(dataStatusBookDay?.handOver || "");

  const inputRef = useRef()

  useEffect(() => {
    if (dataStatusBookDay && dataStatusBookDay.id)
      setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setDate("");
    setForceOnDuty("");
    setCaseName("");
    setLocation("");
    setContent("");
    setReceive("");
    setCustody("");
    setReturns("");
    setHandOver("");
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
      forceOnDuty,
      caseName,
      location,
      content,
      receive,
      custody,
      returns,
      handOver,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!date) {
        const date = document.getElementById("date");
        date.style.border = Text.error.border;
      }
      if (forceOnDuty === "") {
        const forceOnDuty = document.getElementById("forceOnDuty");
        forceOnDuty.style.border = Text.error.border;
      }
      if (caseName === "") {
        const caseName = document.getElementById("caseName");
        caseName.style.border = Text.error.border;
      }
      if (location === "") {
        const location = document.getElementById("location");
        location.style.border = Text.error.border;
      }
      if (content === "") {
        const content = document.getElementById("content");
        content.style.border = Text.error.border;
      }
      if (receive === "") {
        const receive = document.getElementById("receive");
        receive.style.border = Text.error.border;
      }
      if (custody === "") {
        const custody = document.getElementById("custody");
        custody.style.border = Text.error.border;
      }
      if (returns === "") {
        const returns = document.getElementById("returns");
        returns.style.border = Text.error.border;
      }
      if (handOver === "") {
        const handOver = document.getElementById("handOver");
        handOver.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.situation.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataStatusBookDay && dataStatusBookDay.id) {
        url = apiServer.situation.edit + dataStatusBookDay.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataStatusBookDay.id;
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
        .catch((err) => {
          console.log(err)
          if (err.response.data.data === "Currently you do not have permission to edit") {
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
              {Text.statusBookOfTheDay.date}<span>* </span>
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
          <div id="forceOnDuty" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.statusBookOfTheDay.forceOnDuty}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={forceOnDuty}
              onChange={(e) => {
                const forceOnDuty = document.getElementById("forceOnDuty");
                forceOnDuty.style.borderColor = "var(--border-color)";
                return setForceOnDuty(e.target.value);
              }}
            />
          </div>
        </div>

        <div className={cx("group")}>
          <div id="caseName" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.statusBookOfTheDay.caseName}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={caseName}
              onChange={(e) => {
                const caseName = document.getElementById("caseName");
                caseName.style.borderColor = "var(--border-color)";
                return setCaseName(e.target.value);
              }}
            />
          </div>
          <div id="location" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.statusBookOfTheDay.location}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
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
        <div className={cx("group")}>
          <div id="receive" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.statusBookOfTheDay.receive}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={receive}
              onChange={(e) => {
                const receive = document.getElementById("receive");
                receive.style.borderColor = "var(--border-color)";
                return setReceive(e.target.value);
              }}
            />
          </div>
          <div id="custody" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.statusBookOfTheDay.custody}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={custody}
              onChange={(e) => {
                const custody = document.getElementById("custody");
                custody.style.borderColor = "var(--border-color)";
                return setCustody(e.target.value);
              }}
            />
          </div>
        </div>
        <div
          id="content"
          style={{ width: "100%", height: "32rem" }}
          className={cx("formField")}
        >
          <label className={cx("labelField")} htmlFor="">
            {Text.statusBookOfTheDay.content}<span>* </span>
          </label>
          <input
            onKeyDown={(e) => handleSubmitKeyDown(e)}
            readOnly={readOnly}
            className={cx("input")}
            required
            style={{ padding: "1.7rem" }}
            type="text"
            value={content}
            onChange={(e) => {
              const content = document.getElementById("content");
              content.style.borderColor = "var(--border-color)";
              return setContent(e.target.value);
            }}
          />
        </div>

        <div className={cx("group")}>
          <div id="returns" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.statusBookOfTheDay.returns}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={returns}
              onChange={(e) => {
                const returns = document.getElementById("returns");
                returns.style.borderColor = "var(--border-color)";
                return setReturns(e.target.value);
              }}
            />
          </div>
          <div id="handOver" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.statusBookOfTheDay.handOver}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={handOver}
              onChange={(e) => {
                const handOver = document.getElementById("handOver");
                handOver.style.borderColor = "var(--border-color)";
                return setHandOver(e.target.value);
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

export default ContentModalStatusBookDay;
