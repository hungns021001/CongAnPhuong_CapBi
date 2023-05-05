import styles from "./index.module.css";
import {
  Text,
  apiServer,
  SuccessMessages,
  ErrorMessages,
  toggleIsUpdateSuccess,
} from "../../../constant";
import { useEffect, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import {
  _updateFollowTheTextServices,
  _createFollowTheTextServices,
} from "../services";

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
}) {
  const [readOnly, setReadOnly] = useState(true);
  const [isLicensePlates, setIsLicensePlates] = useState(false);
  const [isViolationError, setIsViolationError] = useState(false);
  const [isSentDate, setIsSentDate] = useState(false);
  const [isDateOfPaymentFfFines, setIsDateOfPaymentFfFines] = useState(false);
  const [isReceiver, setIsReceiver] = useState(false);
  const [isViolatingImages, setViolatingImages] = useState(false);

  const handleError = () => {
    if (!form.licensePlates) setIsLicensePlates(true);
    if (!form.violationError) setIsViolationError(true);
    if (!form.sentDate) setIsSentDate(true);
    if (!form.dateOfPaymentFfFines) setIsDateOfPaymentFfFines(true);
    if (!form.receiver) setIsReceiver(true);
    if (!form.violatingImages) setViolatingImages(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.licensePlates &&
      form.violationError &&
      form.sentDate &&
      form.dateOfPaymentFfFines &&
      form.receiver &&
      form.violatingImages
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
          licensePlates: "",
          violationError: "",
          sentDate: "",
          dateOfPaymentFfFines: "",
          receiver: "",
          violatingImages: "",
        });
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
          licensePlates: "",
          violationError: "",
          sentDate: "",
          dateOfPaymentFfFines: "",
          receiver: "",
          violatingImages: "",
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
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.titleCell.inspectionDepositBook.licensePlates}{" "}
              <span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isLicensePlates && Text.error.border }}
              type="text"
              placeholder={Text.titleCell.inspectionDepositBook.licensePlates}
              value={form.licensePlates}
              onChange={(e) => {
                setForm({ ...form, licensePlates: e.target.value });
                setIsLicensePlates(false);
              }}
            />
          </div>
          <div className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")}>
              {Text.titleCell.inspectionDepositBook.sentDate} <span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={form.sentDate}
                onChange={(e) => {
                  setForm({ ...form, sentDate: formatDate(e.target.value) });
                  setIsSentDate(false);
                }}
              />
              <input
                className={cx("inputField", "date", "textPlaceholder")}
                required
                type="text"
                style={{ border: isSentDate && Text.error.border }}
                value={form.sentDate}
                placeholder={Text.titleCell.inspectionDepositBook.sentDate}
                onChange={(e) => {
                  setForm({
                    ...form,
                    sentDate: e.target.value,
                  });
                  setIsSentDate(false);
                }}
                readOnly
              />
            </div>
          </div>
        </div>
        {/* row 2 */}
        <div className={cx("violation")}>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.titleCell.inspectionDepositBook.violationError}{" "}
              <span>* </span>
            </label>
            <textarea
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              type="text"
              style={{ border: isViolationError && Text.error.border }}
              placeholder={Text.titleCell.inspectionDepositBook.violationError}
              value={form.violationError}
              onChange={(e) => {
                setForm({ ...form, violationError: e.target.value });
                setIsViolationError(false);
              }}
            ></textarea>
          </div>
        </div>
        {/* row 3 */}
        <div className={cx("finedPersonInfo")}>
          <div className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")}>
              {Text.titleCell.inspectionDepositBook.dateOfPaymentFfFines}{" "}
              <span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                readOnly={readOnly}
                className={cx("inputField", "date")}
                required
                type="date"
                value={form.dateOfPaymentFfFines}
                onChange={(e) => {
                  setForm({
                    ...form,
                    dateOfPaymentFfFines: formatDate(e.target.value),
                  });
                  setIsDateOfPaymentFfFines(false);
                }}
              />
              <input
                className={cx("inputField", "date", "textPlaceholder")}
                required
                type="text"
                style={{ border: isDateOfPaymentFfFines && Text.error.border }}
                value={form.dateOfPaymentFfFines}
                placeholder={
                  Text.titleCell.inspectionDepositBook.dateOfPaymentFfFines
                }
                onChange={(e) => {
                  setForm({
                    ...form,
                    dateOfPaymentFfFines: e.target.value,
                  });
                  setIsDateOfPaymentFfFines(false);
                }}
                readOnly
              />
            </div>
          </div>
          <div className={cx("formField")}>
            <label className={cx("labelField")}>
              {Text.titleCell.inspectionDepositBook.receiver} <span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("inputField")}
              required
              style={{ border: isReceiver && Text.error.border }}
              type="text"
              placeholder={Text.titleCell.inspectionDepositBook.receiver}
              value={form.receiver}
              onChange={(e) => {
                setForm({ ...form, receiver: e.target.value });
                setIsReceiver(false);
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
