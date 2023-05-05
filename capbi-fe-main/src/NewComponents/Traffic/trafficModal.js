import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { checkIfEmptyValueExists } from "../../commonHandle";
import { ErrorMessages, SuccessMessages, apiServer } from "../../constant";
import styles from "./style.module.css";
import TextTraffic from "./textTraffic";
const cx = classNames.bind(styles);
function TrafficModal({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextTrafficPlaceholder] =
    useState("textPlaceholder");
  const dataMain = useSelector((state) => state.vehicleTraffic.dataMain);

  const [readOnly, setReadOnly] = useState(true);
  const [days    , setDays] = useState(dataMain?.days || "");
  const [date, setDate] = useState(dataMain?.date || "");
  const [trafficIntersection, setTrafficIntersection] = useState(
    dataMain?.trafficIntersection || []
  );
  const [morning, setMorning] = useState(dataMain?.morning || []);
  const [afternoon, setAfternoon] = useState(dataMain?.afternoon || []);
  const [note, setNote] = useState(dataMain?.note || "");
  useEffect(() => {
    if (dataMain && dataMain.id) setTextTrafficPlaceholder("dateTextTraffic");
    if (addEvent) setReadOnly(false);
  }, []);
  const resetInputsModal = () => {
    setDays("");
    setDate("");
    setTrafficIntersection("");
    setMorning("");
    setAfternoon("");
    setNote("");
    setTextTrafficPlaceholder("textPlaceholder");
  };
  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let formateddate = checkFormatDateBeforeSubmit(date);
    let dataCreateTracker = {
      days,
      date: formateddate,
      trafficIntersection: trafficIntersection.filter((ele) => ele != ""),
      morning,
      afternoon,
      note,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (days=="") {
        const days = document.getElementById("days");
        days.style.border = TextTraffic.error.borderErr;
      }
      if (date == "") {
        const date = document.getElementById("date");
        date.style.border = TextTraffic.error.borderErr;
      }
      if (trafficIntersection == "") {
        const trafficIntersection = document.getElementById(
          "trafficIntersection"
        );
        trafficIntersection.style.border = TextTraffic.error.borderErr;
      }
      if (morning=="") {
        const morning = document.getElementById("morning");
        morning.style.border = TextTraffic.error.borderErr;
      }
      if (afternoon == "") {
        const afternoon = document.getElementById("afternoon");
        afternoon.style.border = TextTraffic.error.borderErr;
      }
      if (note == "") {
        const note = document.getElementById("note");
        note.style.border = TextTraffic.error.borderErr;
      }
    } else {
      let url = apiServer.trafficLock.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataMain && dataMain.id) {
        url = apiServer.trafficLock.edit + dataMain.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataMain.id;
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
  const changeTrafficIntersection = (index, text) => {
    const trafficIntersection = document.getElementById("trafficIntersection");
    trafficIntersection.style.borderColor = "var(--border-color)";
    setTrafficIntersection((pre) => {
      const next = [...pre];
      next[index] = text;
      return next;
    });
  };
  const changeMorning = (index, text) => {
    const morning = document.getElementById("morning");
    morning.style.borderColor = "var(--border-color)";
    setMorning((pre) => {
      const next = [...pre];
      next[index] = text;
      return next;
    });
  };
  const changeAfternoon = (index, text) => {
    const afternoon = document.getElementById("afternoon");
    afternoon.style.borderColor = "var(--border-color)";
    setAfternoon((pre) => {
      const next = [...pre];
      next[index] = text;
      return next;
    });
  };
  return (
    <form
      className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}
    >
      <div className={cx("inputArea")}>
        <div className={cx("groupDays")}>
          <div id="days" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {TextTraffic.Traffic.Days}<span>*</span>
            </label>
            <div className={cx("groupDate")}>
              <input
                readOnly={readOnly}
                className={cx("inputFieldDays")}
                required
                type="text"
                // placeholder={TextTraffic.placeHolder.traffic.days}
                value={days}
                onChange={(e) => {
                  const days = document.getElementById("days");
                  days.style.borderColor = "var(--border-color)";
                  return setDays(e.target.value);
                }}
              />
            </div>
          </div>

          <div id="date" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {TextTraffic.Traffic.Date}<span>*</span>
            </label>
            <div className={cx("groupDate")}>
              <input
                readOnly={readOnly}
                className={cx("inputDate", "date")}
                required
                type="date"
                value={date}
                onChange={(e) => {
                  const date = document.getElementById("date");
                  date.style.borderColor = "var(--border-color)";
                  return setDate(e.target.value);
                }}
              />
              
            </div>
          </div>
          
        </div>
        <div className={cx("finedPersonInfo")}>
          <div
            id="trafficIntersection"
            className={cx(styles.trafficIntersectionGroup)}
          >
            <label className={cx("labelField")} htmlFor="">
              {TextTraffic.Traffic.TrafficIntersection}<span>*</span>
            </label>
            <div>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                // placeholder={TextTraffic.placeHolder.traffic.trafficIntersection}
                value={trafficIntersection[0] || ""}
                onChange={(e) => changeTrafficIntersection(0, e.target.value)}
              />
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                disabled={!trafficIntersection[0]}
                // placeholder={TextTraffic.placeHolder.traffic.trafficIntersection}
                value={trafficIntersection[1] || ""}
                onChange={(e) => changeTrafficIntersection(1, e.target.value)}
              />
            </div>
          </div>
          <div
            id="note"
            className={cx("formFieldNote")}
          >
            <label className={cx("labelField")} htmlFor="">
              {TextTraffic.Traffic.Note}<span>*</span>
            </label>
            <textarea
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputNote")}
              
              type="text"
              // placeholder={TextTraffic.placeHolder.traffic.note}
              value={note}
              onChange={(e) => {
                const note = document.getElementById("note");
                note.style.borderColor = "var(--border-color)";
                return setNote(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx(styles.text_1)}>
          <div id="morning" className={cx(styles.morningGroup)}>
            <label className={cx("labelField")} htmlFor="">
              {TextTraffic.Traffic.Morning}<span>*</span>
            </label>
            <div className={cx()}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                // required
                type="text"
                // placeholder={TextTraffic.placeHolder.traffic.morning}
                value={morning[0] || ""}
                onChange={(e) => changeMorning(0, e.target.value)}
              ></input>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                // required
                type="text"
                // placeholder={TextTraffic.placeHolder.traffic.morning}
                disabled={!morning[0]}
                value={morning[1] || ""}
                onChange={(e) => changeMorning(1, e.target.value)}
              ></input>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                // required
                type="text"
                // placeholder={TextTraffic.placeHolder.traffic.morning}
                disabled={!morning[1]}
                value={morning[2] || ""}
                onChange={(e) => changeMorning(2, e.target.value)}
              ></input>
            </div>
          </div>
          <div id="afternoon" className={cx(styles.afternoonGroup)}>
            <label className={cx("labelField")} htmlFor="">
              {TextTraffic.Traffic.Afternoon}<span>*</span>
            </label>
            <div className={cx()}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                // required
                type="text"
                // placeholder={TextTraffic.placeHolder.traffic.afternoon}
                value={afternoon[0] || ""}
                onChange={(e) => changeAfternoon(0, e.target.value)}
              ></input>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                // required
                type="text"
                // placeholder={TextTraffic.placeHolder.traffic.afternoon}
                disabled={!afternoon[0]}
                value={afternoon[1] || ""}
                onChange={(e) => changeAfternoon(1, e.target.value)}
              ></input>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                // required
                type="text"
                // placeholder={TextTraffic.placeHolder.traffic.afternoon}
                disabled={!afternoon[1]}
                value={afternoon[2] || ""}
                onChange={(e) => changeAfternoon(2, e.target.value)}
              ></input>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("group")}>
        <span className={cx("validatorTextTraffic")}>
          {TextTraffic.inputRequired}
        </span>
      </div>
      <div className={cx("groupBtn")}>
        <button onClick={handleCloseModal} className={cx("btnCancel")}>
          {TextTraffic.CRUD.cancel}
        </button>
        {!readOnly && (
          <button
            type="submit"
            className={cx("btnSubmit")}
            onClick={handleSubmit}
          >
            {TextTraffic.CRUD.end}
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
    </form>
  );
}

export default TrafficModal;
