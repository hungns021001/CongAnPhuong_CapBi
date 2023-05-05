import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ErrorMessages, SuccessMessages, Text } from "../../../constant";
import {
  _createFollowTheTextServices,
  _updateFollowTheTextServices,
} from "../services";
import styles from "./index.module.css";

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
  setAddEvent,
}) {
  const [readOnly, setReadOnly] = useState(true);
  // const [isDateTime, setIsDateTime] = useState(false);
  const [isDispatchID, setIsDispatchID] = useState(false);
  const [isRecipients, setIsRecipients] = useState(false);
  const [isReleaseDate, setIsReleaseDate] = useState(false);
  const [isSigner, setIsSigner] = useState(false);
  const [isSubject, setIsSubject] = useState(false);

  const handleError = () => {
    // if (!form.dateTime) setIsDateTime(true);
    if (!form.dispatchID) setIsDispatchID(true);
    if (!form.recipients) setIsRecipients(true);
    if (!form.releaseDate) setIsReleaseDate(true);
    // if (!form.signer) setIsSigner(true);
    if (!form.subject) setIsSubject(true);
  };

  const inputRef = useRef()

  useEffect(() => {
    if (addEvent) {
      setReadOnly(false);
      setAddEvent(false);
    }
    inputRef.current.focus()
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      // form.dateTime &&
      form.dispatchID &&
      form.recipients &&
      form.releaseDate &&
      // form.signer &&
      form.subject
    ) {
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
      const res = await _createFollowTheTextServices(form);
      if (res && res.status === Text.statusTrue) {
        handleCloseModal();
        toggleIsUpdateSuccess();
        successToast(SuccessMessages.create);
        setForm({
          ...form,
          // dateTime: "",
          dispatchID: "",
          recipients: "",
          releaseDate: "",
          signer: "",
          subject: "",
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
      const res = await _updateFollowTheTextServices(id, { ...form });
      if (res && res.status === Text.statusTrue) {
        handleCloseModal();
        toggleIsUpdateSuccess();
        successToast(SuccessMessages.edit);
        setForm({
          ...form,
          // dateTime: "",
          dispatchID: "",
          recipients: "",
          releaseDate: "",
          signer: "",
          subject: "",
        });
        setId("");
      } else {
        errorToast(ErrorMessages.edit);
        handleCloseModal();
      }
    } catch (error) {
      if (
        err.response.data.data ===
        "Currently you do not have permission to edit"
      ) {
        notifyError("Hiện tại bạn không có quyền chỉnh sửa");
        handleCloseModal();
      }
    }
  };

  return (
    <form
      className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}
    >
      <div className={cx("inputArea")}>
        {/* row 1 */}
        <div className={cx("personInfo")}>
          {/* <div
            className={cx("formField", "errorBorder")}
            style={{ border: isDateTime && Text.error.border }}
          >
            <label className={cx("labelField")}>
              {Text.followTheText.time}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                ref={inputRef}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={form.dateTime}
                onChange={(e) => {
                  setForm({ ...form, dateTime: formatDate(e.target.value) });
                  setIsDateTime(false);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", "textPlaceholder")}
                required
                type="text"
                value={form.dateTime}
                onChange={(e) => {
                  setForm({
                    ...form,
                    dateTime: e.target.value,
                  });
                  setIsDateTime(false);
                }}
                readOnly
              />}
            </div>
          </div> */}
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.followTheText.dispatchNumber}<span>* </span>
            </label>
            <input
              ref={inputRef}
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isDispatchID && Text.error.border }}
              type="text"
              value={form.dispatchID}
              onChange={(e) => {
                setForm({ ...form, dispatchID: e.target.value });
                setIsDispatchID(false);
              }}
            />
          </div>
        </div>
        {/* row 2 */}
        <div className={cx("finedPersonInfo")}>
          <div
            className={cx("formField", "errorBorder")}
            style={{ border: isReleaseDate && Text.error.border }}
          >
            <label className={cx("labelField")}>
              {Text.followTheText.releaseDate}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={form.releaseDate}
                onChange={(e) => {
                  setForm({
                    ...form,
                    releaseDate: formatDate(e.target.value),
                  });
                  setIsReleaseDate(false);
                }}
              />
              {readOnly && <input
                className={cx("inputField", "date", "textPlaceholder")}
                required
                type="text"
                value={form.releaseDate}
                onChange={(e) => {
                  setForm({
                    ...form,
                    releaseDate: e.target.value,
                  });
                  setIsReleaseDate(false);
                }}
                readOnly
              />}
            </div>
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.followTheText.abstract}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isSubject && Text.error.border }}
              type="text"
              value={form.subject}
              onChange={(e) => {
                setForm({ ...form, subject: e.target.value });
                setIsSubject(false);
              }}
            />
          </div>
        </div>
        {/* row 3 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.followTheText.signer}
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isSigner && Text.error.border }}
              type="text"
              value={form.signer}
              onChange={(e) => {
                setForm({ ...form, signer: e.target.value });
                setIsSigner(false);
              }}
            />
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.followTheText.recipients}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isRecipients && Text.error.border }}
              type="text"
              value={form.recipients}
              onChange={(e) => {
                setForm({ ...form, recipients: e.target.value });
                setIsRecipients(false);
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

export default ContentModal;
