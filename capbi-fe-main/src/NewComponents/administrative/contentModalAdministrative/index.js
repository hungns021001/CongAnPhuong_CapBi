import styles from "./index.module.css";
import { Text, apiServer, SuccessMessages, ErrorMessages } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

function ContentModalAdministrative({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataAdministrative = useSelector(
    (state) => state.vehicleAdministrative.dataAdministrative
  );
  const [readOnly, setReadOnly] = useState(true);

  const [date, setDate] = useState(
    formatDate(String(dataAdministrative?.date)) || ""
  );
  const [dispatchId, setDispatchId] = useState(
    dataAdministrative?.dispatchId || ""
  );
  const [releaseDate, setReleaseDate] = useState(
    formatDate(String(dataAdministrative?.releaseDate)) || ""
  );
  const [agencyIssued, setAgencyIssued] = useState(
    dataAdministrative?.agencyIssued || ""
  );
  const [fullName, setFullName] = useState(dataAdministrative?.fullName || "");
  const [settlementTime, setSettlementTime] = useState(
    formatDate(String(dataAdministrative?.settlementTime)) || ""
  );

  const [result, setResult] = useState(dataAdministrative?.result || "0");

  const inputRef = useRef()

  useEffect(() => {
    if (dataAdministrative && dataAdministrative.id)
      setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setDate("");
    setDispatchId("");
    setReleaseDate("");
    setAgencyIssued("");
    setFullName("");
    setSettlementTime("");
    setResult("");

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
    let formatedReleaseDate = checkFormatDateBeforeSubmit(releaseDate);
    let formatedSettlementTime = checkFormatDateBeforeSubmit(settlementTime);

    let dataCreateTracker = {
      date: formatedDate,
      dispatchId,
      releaseDate: formatedReleaseDate,
      agencyIssued,
      fullName,
      settlementTime: formatedSettlementTime,
      result: result,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!date) {
        const date = document.getElementById("date");
        date.style.border = Text.error.border;
      }
      if (dispatchId === "") {
        const dispatchId = document.getElementById("dispatchId");
        dispatchId.style.border = Text.error.border;
      }
      if (!releaseDate) {
        const releaseDate = document.getElementById("releaseDate");
        releaseDate.style.border = Text.error.border;
      }

      if (agencyIssued === "") {
        const agencyIssued = document.getElementById("agencyIssued");
        agencyIssued.style.border = Text.error.border;
      }

      if (fullName === "") {
        const fullName = document.getElementById("fullName");
        fullName.style.border = Text.error.border;
      }
      if (!settlementTime) {
        const settlementTime = document.getElementById("settlementTime");
        settlementTime.style.border = Text.error.border;
      }
      if (result === "") {
        const result = document.getElementById("result");
        result.style.border = Text.error.border;
      }

      // if (result === "") {
      //   const result = document.getElementById("result");
      //   result.style.border = Text.error.border;
      // }
    } else {
      let url = apiServer.administrative.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataAdministrative && dataAdministrative.id) {
        url = apiServer.administrative.edit + dataAdministrative.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataAdministrative.id;
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
              {Text.administrative.textReceiptDate}<span>* </span>
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
                onChange={(e) =>
                  setDateOfViolation(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>
          <div id="dispatchId" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.administrative.textNumber}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={dispatchId}
              onChange={(e) => {
                const dispatchId = document.getElementById("dispatchId");
                dispatchId.style.borderColor = "var(--border-color)";
                return setDispatchId(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="releaseDate" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.administrative.issuedDate}<span>* </span>
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
          <div id="agencyIssued" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.administrative.agencyIssued}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={agencyIssued}
              onChange={(e) => {
                const agencyIssued = document.getElementById("agencyIssued");
                agencyIssued.style.borderColor = "var(--border-color)";
                return setAgencyIssued(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="fullName" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.administrative.handlingOfficer}<span>* </span>
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
          <div id="settlementTime" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.administrative.timeLimitForSolving}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={settlementTime}
                onChange={(e) => {
                  const settlementTime =
                    document.getElementById("settlementTime");
                  settlementTime.style.borderColor = "var(--border-color)";
                  return setSettlementTime(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(settlementTime))}
                onChange={(e) =>
                  setSettlementTime(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="result" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.administrative.resultEvaluation}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              value={result === "0" ? "Chưa hoàn thành" : "Đã hoàn thành"}
              onChange={(e) => {
                const result = document.getElementById("result");
                result.style.borderColor = "var(--border-color)";
                return setResult(e.target.value);
              }}
            />
            <select
              className={cx("select_result")}
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              <option value={1}>Đã hoàn thành</option>
              <option value={0}>Chưa hoàn thành</option>
            </select>
          </div>
          {/* <div id="staffReceive" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.OfficersReceiveStickers} <span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              placeholder={Text.placeHolder.dataNothandle.staffReceive}
              value={staffReceive}
              onChange={(e) => {
                const staffReceive = document.getElementById("staffReceive");
                staffReceive.style.borderColor = "var(--border-color)";
                return setStaffReceive(e.target.value);
              }}
            />
          </div> */}
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

export default ContentModalAdministrative;
