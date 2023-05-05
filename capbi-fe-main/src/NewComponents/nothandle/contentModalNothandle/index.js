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

function ContentModalNothandle({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataHandle = useSelector((state) => state.vehicleHandle.dataHandle);
  const [readOnly, setReadOnly] = useState(true);

  const [dateOfViolation, setDateOfViolation] = useState(
    formatDate(String(dataHandle?.dateOfViolation)) || ""
  );
  const [violation, setViolation] = useState(dataHandle?.violation || "");
  const [locationViolation, setLocationViolation] = useState(
    dataHandle?.locationViolation || ""
  );
  const [lisencePlate, setLisencePlate] = useState(
    dataHandle?.lisencePlate || ""
  );
  const [nameViolator, setNameViolator] = useState(
    dataHandle?.nameViolator || ""
  );

  const [nameBailsman, setNameBailsman] = useState(
    dataHandle?.nameBailsman || ""
  );
  const [solCommander, setSolCommander] = useState(
    dataHandle?.solCommander || ""
  );
  const [staffReceive, setStaffReceive] = useState(
    dataHandle?.staffReceive || ""
  );

  const inputRef = useRef()

  useEffect(() => {
    if (dataHandle && dataHandle.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus()
  }, []);

  const resetInputsModal = () => {
    setDateOfViolation("");
    setViolation("");
    setLocationViolation("");
    setLisencePlate("");
    setNameViolator("");
    setNameBailsman("");
    setSolCommander("");
    setStaffReceive("");

    setTextPlaceholder("textPlaceholder");
  };

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formatedDateOfViolation = checkFormatDateBeforeSubmit(dateOfViolation);

    let dataCreateTracker = {
      dateOfViolation: formatedDateOfViolation,
      violation,
      locationViolation,
      lisencePlate,
      nameViolator,
      nameBailsman,
      solCommander,
      staffReceive,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!dateOfViolation) {
        const dateOfViolation = document.getElementById("dateOfViolation");
        dateOfViolation.style.border = Text.error.border;
      }
      if (violation === "") {
        const violation = document.getElementById("violation");
        violation.style.border = Text.error.border;
      }
      if (locationViolation === "") {
        const locationViolation = document.getElementById("locationViolation");
        locationViolation.style.border = Text.error.border;
      }

      if (lisencePlate === "") {
        const lisencePlate = document.getElementById("lisencePlate");
        lisencePlate.style.border = Text.error.border;
      }

      if (nameViolator === "") {
        const nameViolator = document.getElementById("nameViolator");
        nameViolator.style.border = Text.error.border;
      }
      if (nameBailsman === "") {
        const nameBailsman = document.getElementById("nameBailsman");
        nameBailsman.style.border = Text.error.border;
      }

      if (solCommander === "") {
        const solCommander = document.getElementById("solCommander");
        solCommander.style.border = Text.error.border;
      }

      if (staffReceive === "") {
        const staffReceive = document.getElementById("staffReceive");
        staffReceive.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.nothandle.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataHandle && dataHandle.id) {
        url = apiServer.nothandle.edit + dataHandle.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataHandle.id;
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
          <div id="dateOfViolation" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.dateOfViolation}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                ref={inputRef}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={dateOfViolation}
                onChange={(e) => {
                  const dateOfViolation =
                    document.getElementById("dateOfViolation");
                  dateOfViolation.style.borderColor = "var(--border-color)";
                  return setDateOfViolation(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(dateOfViolation))}
                onChange={(e) =>
                  setDateOfViolation(formatDate(String(e.target.value)))
                }
                readOnly
              />}
            </div>
          </div>
          <div id="lisencePlate" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.violation}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={lisencePlate}
              onChange={(e) => {
                const lisencePlate = document.getElementById("lisencePlate");
                lisencePlate.style.borderColor = "var(--border-color)";
                return setLisencePlate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="locationViolation" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.LocationOfViolation}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={locationViolation}
              onChange={(e) => {
                const locationViolation =
                  document.getElementById("locationViolation");
                locationViolation.style.borderColor = "var(--border-color)";
                return setLocationViolation(e.target.value);
              }}
            />
          </div>
          <div id="violation" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.errorViolation}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={violation}
              onChange={(e) => {
                const violation = document.getElementById("violation");
                violation.style.borderColor = "var(--border-color)";
                return setViolation(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="nameViolator" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.violatorName}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={nameViolator}
              onChange={(e) => {
                const nameViolator = document.getElementById("nameViolator");
                nameViolator.style.borderColor = "var(--border-color)";
                return setNameViolator(e.target.value);
              }}
            />
          </div>
          <div id="nameBailsman" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.applicantName}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={nameBailsman}
              onChange={(e) => {
                const nameBailsman = document.getElementById("nameBailsman");
                nameBailsman.style.borderColor = "var(--border-color)";
                return setNameBailsman(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("finedPersonInfo")}>
          <div id="solCommander" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.commandSettlement}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={solCommander}
              onChange={(e) => {
                const solCommander = document.getElementById("solCommander");
                solCommander.style.borderColor = "var(--border-color)";
                return setSolCommander(e.target.value);
              }}
            />
          </div>
          <div id="staffReceive" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.nothandle.OfficersReceiveStickers}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              value={staffReceive}
              onChange={(e) => {
                const staffReceive = document.getElementById("staffReceive");
                staffReceive.style.borderColor = "var(--border-color)";
                return setStaffReceive(e.target.value);
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

export default ContentModalNothandle;
