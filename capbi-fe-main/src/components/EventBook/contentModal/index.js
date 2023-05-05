import styles from "./index.module.css";
import {
  Text,
  apiServer,
  SuccessMessages,
  ErrorMessages,
  toggleIsUpdateSuccess,
} from "../../../constant";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import {
  _updateFollowTheTextServices,
  _createFollowTheTextServices,
} from "../services";
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
  addEvent,
  setAddEvent
}) {
  const [readOnly, setReadOnly] = useState(true);
  const [isDate, setIsDate] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [isForce, setIsForce] = useState(false);
  const [isMission, setIsMission] = useState(false);
  const [isNote, setIsNote] = useState(false);
  const inputRef = useRef()
  useEffect(() => {
    if (addEvent) {
      setAddEvent(false)
      setReadOnly(false)
    }
    inputRef.current.focus()
  }, [])
  const handleError = () => {
    if (!form.date) setIsDate(true);
    if (!form.location) setIsLocation(true);
    if (!form.force) setIsForce(true);
    if (!form.mission) setIsMission(true);
    if (!form.note) setIsNote(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.date && form.location && form.force && form.mission && form.note) {
      descTitle === Text.CRUD.insert
        ? _updateFollowTheText(id)
        : _handleCreateFollowTheText();
    } else {
      handleError();
    }
  };
  const handleSubmitKeyDown = (e) => {
    if (e.keyCode === Text.keyEnter) {
      handleSubmit(e);
    }
  };
  const _handleCreateFollowTheText = async () => {
    try {
      const res = await _createFollowTheTextServices({
        ...form,
        date: formatDate(form.date),
      });
      if (res && res.status === Text.statusTrue) {
        handleCloseModal();
        toggleIsUpdateSuccess();
        successToast(SuccessMessages.create);
        setForm({
          ...form,
          date: "",
          location: "",
          force: "",
          mission: "",
          note: "",
        });
      } else {
        if (
          err.response.data.data ===
          "Currently you do not have permission to edit"
        ) {
          notifyError("Hiện tại bạn không có quyền chỉnh sửa");
          handleCloseModal();
        }
        errorToast(ErrorMessages.create);
        handleCloseModal();
      }
    } catch (error) {
      errorToast(ErrorMessages.create);
      handleCloseModal();
    }
  };
  const _updateFollowTheText = async (id) => {
    try {
      const res = await _updateFollowTheTextServices(id, {
        ...form,
        date: formatDate(form.date),
      });
      if (res && res.status === Text.statusTrue) {
        handleCloseModal();
        toggleIsUpdateSuccess();
        successToast(SuccessMessages.edit);
        setForm({
          ...form,
          date: "",
          location: "",
          force: "",
          mission: "",
          note: "",
        });
        setId("");
      } else {
        errorToast(ErrorMessages.edit);
        handleCloseModal();
      }
    } catch (error) {
      errorToast(ErrorMessages.edit);
      handleCloseModal();
    }
  };
  return (
    <form
      className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}
    >
      <div className={cx("inputArea")}>
        {/* row 1 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")} style={{ border: isDate && Text.error.border }}>
            <label className={cx("labelField")}>
              {Text.eventBook.date}<span>*</span>
            </label>
            <div className={cx("groupDate")}>
              <input
                ref={inputRef}
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={form.date}

                onChange={(e) => {
                  setForm({ ...form, date: e.target.value });
                  setIsDate(false);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", "textPlaceholder")}
                required
                type="text"

                value={form.date}
                onChange={(e) => {
                  setForm({
                    ...form,
                    date: e.target.value,
                  });
                  setIsDate(false);
                }}
                readOnly
              />}
            </div>
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.eventBook.location}<span>*</span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isLocation && Text.error.border }}
              type="text"
              value={form.location}
              onChange={(e) => {
                setForm({ ...form, location: e.target.value });
                setIsLocation(false);
              }}
            />
          </div>
        </div>
        {/* row 2 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.eventBook.force}<span>*</span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="number"
              style={{ border: isForce && Text.error.border }}
              value={form.force}
              onChange={(e) => {
                setForm({ ...form, force: e.target.value });
                setIsForce(false);
              }}
            />
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.eventBook.note}<span>*</span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isNote && Text.error.border }}
              value={form.note}
              onChange={(e) => {
                setForm({ ...form, note: e.target.value });
                setIsNote(false);
              }}
            />
          </div>
        </div>
        {/* row 3 */}
        <div className={cx("violation")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.eventBook.mission}<span>*</span>
            </label>
            <textarea
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isMission && Text.error.border }}
              value={form.mission}
              onChange={(e) => {
                setForm({ ...form, mission: e.target.value });
                setIsMission(false);
              }}
            ></textarea>
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
