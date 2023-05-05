import styles from "./index.module.css";
import { Text, SuccessMessages, ErrorMessages } from "../../../constant";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import { _updateDutyServices, _createDutyServices } from "../services";
import formatDate from "@/formatTime";

const cx = classNames.bind(styles);

function ContentModal({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  successToast,
  errorToast,
  form,
  setForm,
  id,
  setId,
  absenceNoReason,
  setAbsenceNoReason,
  readOnly,
  setReadOnly
}) {
  const [isHourOnDuty, setIsHourOnDuty] = useState(false);
  const [isFullName, setIsFullName] = useState(false);
  const [isTotal, setIsTotal] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const [isExcusedAbsence, setIsExcusedAbsence] = useState(false);
  const [isAbsenceNoReason, setIsAbsenceNoReason] = useState(false);
  const [isContentOfShift, setIsContentOfShift] = useState(false);
  const [isInformationOfShift, setIsInformationOfShift] = useState(false);
  const [isDirectiveInformation, setIsDirectiveInformation] = useState(false);
  const [isFullNameHandover, setIsFullNameHandover] = useState(false);
  const [isFullNameReceiver, setIsFullNameReceiver] = useState(false);
  const [isLeadShift, setIsLeadShift] = useState(false);

  const handleError = () => {
    if (!form.hourOnDuty) setIsHourOnDuty(true);
    if (!form.fullName) setIsFullName(true);
    if (!form.total) setIsTotal(true);
    if (!form.present) setIsPresent(true);
    if (!form.excusedAbsence) setIsExcusedAbsence(true);
    if (!form.absenceNoReason) setIsAbsenceNoReason(true);
    if (!form.contentOfShift) setIsContentOfShift(true);
    if (!form.informationOfShift) setIsInformationOfShift(true);
    if (!form.directiveInformation) setIsDirectiveInformation(true);
    if (!form.fullnameHandover) setIsFullNameHandover(true);
    if (!form.fullnameReceiver) setIsFullNameReceiver(true);
    if (!form.leadShift) setIsLeadShift(true);
  };

  const inputRef = useRef()

  useEffect(()=>{
    inputRef.current.focus()
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.date &&
      form.hourOnDuty &&
      form.fullName &&
      form.total &&
      form.excusedAbsence &&
      form.absenceNoReason &&
      form.present &&
      form.contentOfShift &&
      form.informationOfShift &&
      form.directiveInformation &&
      form.fullnameHandover &&
      form.fullnameReceiver &&
      form.leadShift
    ) {
      descTitle === Text.CRUD.insert
        ? _updateDutyBook(id)
        : _handleCreateDutyBook();
    } else {
      handleError();
    }
  };

  const handleSubmitKeyDown = (e) => {
    if (e.keyCode === Text.keyEnter) {
      handleSubmit(e);
    }
  };

  const _handleCreateDutyBook = async () => {
    try {
      const res = await _createDutyServices({
        ...form,
        date: formatDate(form.date),
        // AbsenceNoReason: absenceNoReason,
      });
      if (res && res.status === Text.statusTrue) {
        console.log(res);
        handleCloseModal();
        toggleIsUpdateSuccess();
        successToast(SuccessMessages.create);
        setForm({
          ...form,
          hourOnDuty: "",
          fullName: "",
          total: null,
          present: null,
          excusedAbsence: null,
          absenceNoReason:null,
          absenceNoReason:null,
          contentOfShift: "",
          informationOfShift: "",
          directiveInformation: "",
          fullnameHandover: "",
          fullnameReceiver: "",
          leadShift: "",
        });
        setAbsenceNoReason("");
      } else {
        if (err.response.data.data === "Currently you do not have permission to edit") {
          notifyError("Hiện tại bạn không có quyền chỉnh sửa")
          handleCloseModal();
        }
        errorToast(ErrorMessages.create);
        handleCloseModal();
      }
    } catch (error) {
      errorToast(ErrorMessages.create);
      handleCloseModal();
    }
    
  }

  const _updateDutyBook = async (id) => {
    try {
      const res = await _updateDutyServices(id, {
        ...form,
        date: formatDate(form.date),
      });
      if (res && res.status === Text.statusTrue) {
        handleCloseModal();
        toggleIsUpdateSuccess();
        successToast(SuccessMessages.edit);
        setForm({
          ...form,
          hourOnDuty: "",
          fullName: "",
          total: null,
          present: null,
          excusedAbsence: null,
          absenceNoReason:null,
          contentOfShift: "",
          informationOfShift: "",
          directiveInformation: "",
          fullnameHandover: "",
          fullnameReceiver: "",
          leadShift: "",
        });
        setId("");
        setAbsenceNoReason("");
      } else {
        errorToast(ErrorMessages.edit);
        handleCloseModal();
      }
    } catch (error) {
      errorToast(ErrorMessages.edit);
      handleCloseModal();
    }
  }

  return (
    <form
      className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}
    >
      <div className={cx("inputArea")}>
        {/* row 1 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.hourDuty}<span>* </span>
            </label>
            <input
              ref={inputRef}
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isHourOnDuty && Text.error.border }}
              type="text"
              
              value={form.hourOnDuty}
              onChange={(e) => {
                setForm({ ...form, hourOnDuty: e.target.value });
                setIsHourOnDuty(false);
              }}
            />
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.duty}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isFullName && Text.error.border }}
             
              value={form.fullName}
              onChange={(e) => {
                setForm({ ...form, fullName: e.target.value });
                setIsFullName(false);
              }}
            />
          </div>
        </div>
        {/* row 2 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.totalOfPeople}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="number"
              style={{ border: isTotal && Text.error.border }}
              
              value={form.total}
              onChange={(e) => {
                setForm({ ...form, total: e.target.value });
                setIsTotal(false);
              }}
            />
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.present}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="number"
              style={{ border: isPresent && Text.error.border }}
              
              value={form.present}
              onChange={(e) => {
                setForm({ ...form, present: e.target.value });
                setIsPresent(false);
              }}
            />
          </div>
        </div>
        {/* row 3 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.excusedAbsence}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="number"
              style={{ border: isExcusedAbsence && Text.error.border }}
              
              value={form.excusedAbsence}
              onChange={(e) => {
                setForm({ ...form, excusedAbsence: e.target.value });
                setIsAbsenceNoReason(false);
              }}
            />
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.absenceNoReason}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              style={{ border: isAbsenceNoReason && Text.error.border }}
              required
              type="number"
              value={form.absenceNoReason}
              onChange={(e) => {
                setForm({ ...form, absenceNoReason: e.target.value });
                setIsExcusedAbsence(false);
              }}
            />
          </div>
        </div>
        <div className={cx("violation")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.placeHolder.contentOfShift}<span>* </span>
            </label>
            <textarea
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isContentOfShift && Text.error.border }}
              
              value={form.contentOfShift}
              onChange={(e) => {
                setForm({ ...form, contentOfShift: e.target.value });
                setIsInformationOfShift(false);
              }}
            ></textarea>
          </div>
        </div>
        {/* row 4 */}
        <div className={cx("violation")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.informationOfShift}<span>* </span>
            </label>
            <textarea
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isInformationOfShift && Text.error.border }}
              
              value={form.informationOfShift}
              onChange={(e) => {
                setForm({ ...form, informationOfShift: e.target.value });
                setIsInformationOfShift(false);
              }}
            ></textarea>
          </div>
        </div>
        {/* row 5 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.directiveInformation}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isDirectiveInformation && Text.error.border }}
              
              value={form.directiveInformation}
              onChange={(e) => {
                setForm({
                  ...form,
                  directiveInformation: e.target.value,
                });
                setIsDirectiveInformation(false);
              }}
            />
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.fullNameReceiver}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isFullNameReceiver && Text.error.border }}
             
              value={form.fullnameReceiver}
              onChange={(e) => {
                setForm({ ...form, fullnameReceiver: e.target.value });
                setIsFullNameReceiver(false);
              }}
            />
          </div>
        </div>
        {/* row 6 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.fullNameHandover}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isFullNameHandover && Text.error.border }}
             
              value={form.fullnameHandover}
              onChange={(e) => {
                setForm({ ...form, fullnameHandover: e.target.value });
                setIsFullNameHandover(false);
              }}
            />
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.dutyBook.leadShift}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isLeadShift && Text.error.border }}
              
              value={form.leadShift}
              onChange={(e) => {
                setForm({ ...form, leadShift: e.target.value });
                setIsLeadShift(false);
              }}
            />
          </div>
        </div>
      </div>
      <div className={cx("groupBtn")}>
        <span className={cx("validatorText")}>{Text.inputRequired}</span>
        <button onClick={handleCloseModal} className={cx("btnCancel")}>
          {Text.CRUD.cancel}
        </button>
        {!readOnly && (
          <button
            type="submit"
            className={cx("btnSubmit")}
            onClick={handleSubmit}
          >
            {Text.CRUD.end}
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

export default ContentModal;
