import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { checkIfEmptyValueExists } from "../../commonHandle";
import { SuccessMessages, Text, apiServer } from "../../constant";
import formatDate from "../../formatTime";
import BaseAxios from "../../store/setUpAxios";
import styles from "./index.module.css";

export default function ForeignerTrackingBookModal({
  setIsShow,
  successToast,
  toggleIsUpdateSuccess,
  addEvent,
  setAdd,
}) {
  const dataMain = useSelector(
    (state) => state.foreignerTrackingBookSlice.dataMain
  );

  const inputRef = useRef()

  const [readOnly, setReadOnly] = useState(true);

  const [form, setForm] = useState({
    RegisterDate: formatDate(String(dataMain?.RegisterDate)) || "",
    FullName: dataMain?.FullName || "",
    BirthDay: formatDate(String(dataMain?.BirthDay)) || "",
    Country: dataMain?.Country || "",
    ResidentialAddress: dataMain?.ResidentialAddress || "",
    Passport: dataMain?.Passport || "",
    RecidencePermitNumber: dataMain?.RecidencePermitNumber || "",
    Job: dataMain?.Job || "",
    EntryDate: formatDate(String(dataMain?.EntryDate)) || "",
    GateEntry: dataMain?.GateEntry || "",
    EntryPurpose: dataMain?.EntryPurpose || "",
    SojournDateFrom: formatDate(String(dataMain?.SojournDateFrom)) || "",
    SojournDateTo: formatDate(String(dataMain?.SojournDateTo)) || "",
    GuarantorName: dataMain?.GuarantorName || "",
    FullNamePolice: dataMain?.FullNamePolice || "",
    PoliceLead: dataMain?.PoliceLead || "",
  });

  const handerInput = (e) => {
    let valueStyle = e.target.name;
    let name = e.target.name;
    let value = e.target.value;
    document.getElementById(valueStyle).style.borderColor = "#727272";

    console.log({ valueStyle, value, name });
    return setForm({
      ...form,
      [name]: value,
    });
  };

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  useEffect(() => {
    if (addEvent) {
      setReadOnly(false);
      setAdd(false);
    }
    inputRef.current.focus()
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    let RegisterDate = checkFormatDateBeforeSubmit(form.RegisterDate);
    let BirthDay = checkFormatDateBeforeSubmit(form.BirthDay);
    let EntryDate = checkFormatDateBeforeSubmit(form.EntryDate);
    let SojournDateFrom = checkFormatDateBeforeSubmit(form.SojournDateFrom);
    let SojournDateTo = checkFormatDateBeforeSubmit(form.SojournDateTo);

    let dataCreateTracker = {
      RegisterDate,
      FullName: form.FullName,
      BirthDay,
      Country: form.Country,
      ResidentialAddress: form.ResidentialAddress,
      Passport: form.Passport,
      RecidencePermitNumber: form.RecidencePermitNumber,
      Job: form.Job,
      EntryDate,
      GateEntry: form.GateEntry,
      EntryPurpose: form.EntryPurpose,
      SojournDateFrom,
      SojournDateTo,
      GuarantorName: form.GuarantorName,
      FullNamePolice: form.FullNamePolice,
      PoliceLead: form.PoliceLead,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (form.RegisterDate.trim() === "") {
        const registerDate = document.getElementById("RegisterDate");
        registerDate.style.border = Text.error.border;
      }
      if (form.FullName.trim() === "") {
        console.log("ok");
        const fullName = document.getElementById("FullName");
        fullName.style.border = Text.error.border;
      }
      if (form.BirthDay.trim() === "") {
        const birthDay = document.getElementById("BirthDay");
        birthDay.style.border = Text.error.border;
      }
      if (form.Country.trim() === "") {
        const country = document.getElementById("Country");
        country.style.border = Text.error.border;
      }
      if (form.ResidentialAddress.trim() === "") {
        const residentialAddress =
          document.getElementById("ResidentialAddress");
        residentialAddress.style.border = Text.error.border;
      }
      if (form.Passport.trim() === "") {
        const passport = document.getElementById("Passport");
        passport.style.border = Text.error.border;
      }
      if (form.Job.trim() === "") {
        const fullName = document.getElementById("Job");
        fullName.style.border = Text.error.border;
      }
      if (form.RecidencePermitNumber.trim() === "") {
        const recidencePermitNumber = document.getElementById(
          "RecidencePermitNumber"
        );
        recidencePermitNumber.style.border = Text.error.border;
      }
      if (form.EntryDate.trim() === "") {
        const entryDate = document.getElementById("EntryDate");
        entryDate.style.border = Text.error.border;
      }
      if (form.GateEntry.trim() === "") {
        const gateEntry = document.getElementById("GateEntry");
        gateEntry.style.border = Text.error.border;
      }
      if (form.EntryPurpose.trim() === "") {
        const entryPurpose = document.getElementById("EntryPurpose");
        entryPurpose.style.border = Text.error.border;
      }
      if (form.SojournDateFrom.trim() === "") {
        const sojournDateFrom = document.getElementById("SojournDateFrom");
        sojournDateFrom.style.border = Text.error.border;
      }
      if (form.SojournDateTo.trim() === "") {
        const sojournDateTo = document.getElementById("SojournDateTo");
        sojournDateTo.style.border = Text.error.border;
      }
      if (form.GuarantorName.trim() === "") {
        const guarantorName = document.getElementById("GuarantorName");
        guarantorName.style.border = Text.error.border;
      }
      if (form.FullNamePolice.trim() === "") {
        const fullNamePolice = document.getElementById("FullNamePolice");
        fullNamePolice.style.border = Text.error.border;
      }
      if (form.PoliceLead.trim() === "") {
        const policeLead = document.getElementById("PoliceLead");
        policeLead.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.foreignerTracking.create;
      let successMessage = SuccessMessages.create;

      if (dataMain.Id > 0) {
        url = apiServer.foreignerTracking.edit + dataMain.Id;
        successMessage = SuccessMessages.edit;
      }

      await BaseAxios({
        method: "POST",
        url: url,
        data: dataCreateTracker,
      }).then((res) => {
        toggleIsUpdateSuccess();
        successToast(successMessage);
        setIsShow(false);
        console.log(
          "res data create: ",
          res,
          "dataCreateTracker: ",
          dataCreateTracker
        );
      });
    }
  };

  const handleSubmitKeyDown = (e) => {
    if (e.keyCode === Text.keyEnter) {
      handleSubmitForm(e);
    }
  };

  return (
    <form className={cn(styles.bodyForm, {[styles.readOnlyStyle]: readOnly})}>
      <div className={cn(styles.wrapperInput)}>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="RegisterDate">
            <label className={cn(styles.labelField)} htmlFor="name">
              {Text.titleForeignerTrackingBook.registerDate}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              ref={inputRef}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              required
              type="date"
              // placeholder="15-01-2002"
              name="RegisterDate"
              value={form.RegisterDate}
              onChange={handerInput}
            />
            {readOnly && <input
              className={cn(styles.textInputField)}
              readOnly
              required
              type="text"
              // placeholder="dd-mm-yyyy"
              name="RegisterDate"
              value={formatDate(String(form.RegisterDate))}
              onChange={handerInput}
            />}
          </div>
          <div className={cn(styles.rowItem)} id="FullName">
            <label className={cn("labelField")} htmlFor="name">
              {Text.titleForeignerTrackingBook.fullName}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              type="text"
              name="FullName"
              // placeholder="Họ và tên"
              value={form.FullName}
              onChange={handerInput}
            />
          </div>
        </div>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="BirthDay">
            <label htmlFor="date" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.birthDay}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              type="date"
              name="BirthDay"
              value={form.BirthDay}
              onChange={handerInput}
            />
            {readOnly && <input
              className={cn(styles.textInputField)}
              type="text"
              readOnly
              name="BirthDay"
              // placeholder="dd-mm-yyyy"
              value={formatDate(String(form.BirthDay))}
              onChange={handerInput}
            />}
          </div>
          <div className={cn(styles.rowItem)} id="Country">
            <label htmlFor="gt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.country}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              type="text"
              name="Country"
              // placeholder="Quốc tịch"
              value={form.Country}
              onChange={handerInput}
            />
          </div>
        </div>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="ResidentialAddress">
            <label htmlFor="gt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.residentialAddress}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              type="text"
              name="ResidentialAddress"
              // placeholder="Địa Chỉ Cư Trú"
              value={form.ResidentialAddress}
              onChange={handerInput}
            />
          </div>
          <div className={cn(styles.rowItem)} id="Passport">
            <label htmlFor="gt" className={cn(styles.textInputField)}>
              {Text.titleForeignerTrackingBook.passport}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              type="text"
              name="Passport"
              required="required"
              // placeholder="Sổ hộ chiếu"
              value={form.Passport}
              onChange={handerInput}
            />
          </div>
        </div>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="RecidencePermitNumber">
            <label htmlFor="gt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.recidencePermitNumber}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              type="text"
              name="RecidencePermitNumber"
              // placeholder="Số Giấy Tờ cho Cư Trú"
              value={form.RecidencePermitNumber}
              onChange={handerInput}
            />
          </div>
          <div className={cn(styles.rowItem)} id="Job">
            <label htmlFor="gt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.job}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              type="text"
              readOnly={readOnly}
              name="Job"
              // placeholder="Nghề Nghiệp"
              value={form.Job}
              onChange={handerInput}
            />
          </div>
        </div>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="EntryDate">
            <label htmlFor="gt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.entryDate}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              readOnly={readOnly}
              type="date"
              name="EntryDate"
              value={form.EntryDate}
              onChange={handerInput}
            />
            {readOnly && <input
              className={cn(styles.textInputField)}
              type="text"
              readOnly
              name="EntryDate"
              // placeholder="dd-mm-yyyy"
              value={formatDate(String(form.EntryDate))}
              onChange={handerInput}
            />}
          </div>
          <div className={cn(styles.rowItem)} id="GateEntry">
            <label htmlFor="gt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.gateEntry}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              type="text"
              readOnly={readOnly}
              name="GateEntry"
              // placeholder="Cửa Khẩu Nhập Cảnh"
              value={form.GateEntry}
              onChange={handerInput}
            />
          </div>
        </div>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="EntryPurpose">
            <label htmlFor="gt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.entryPurpose}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              className={cn(styles.inputField)}
              type="text"
              readOnly={readOnly}
              name="EntryPurpose"
              // placeholder="Mục Đích Nhập Cảnh"
              value={form.EntryPurpose}
              onChange={handerInput}
            />
          </div>
          <div className={cn(styles.rowItem)} id="SojournDateFrom">
            <label htmlFor="hktt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.sojournDateFrom}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              type="date"
              readOnly={readOnly}
              name="SojournDateFrom"
              value={form.SojournDateFrom}
              className={cn(styles.inputField)}
              onChange={handerInput}
            />
            {readOnly && <input
              type="text"
              readOnly
              name="SojournDateFrom"
              // placeholder="dd-mm-yyyy"
              value={formatDate(String(form.SojournDateFrom))}
              className={cn(styles.textInputField)}
              onChange={handerInput}
            />}
          </div>
        </div>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="SojournDateTo">
            <label htmlFor="hktt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.sojournDateTo}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              type="date"
              readOnly={readOnly}
              name="SojournDateTo"
              className={cn(styles.inputField)}
              value={form.SojournDateTo}
              onChange={handerInput}
            />
            {readOnly && <input
              type="text"
              readOnly
              name="SojournDateTo"
              // placeholder="dd-mm-yyyy"
              className={cn(styles.textInputField)}
              value={formatDate(String(form.SojournDateTo))}
              onChange={handerInput}
            />}
          </div>
          <div className={cn(styles.rowItem)} id="GuarantorName">
            <label htmlFor="hktt" className={cn(styles.textInputField)}>
              {Text.titleForeignerTrackingBook.guarantorName}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              type="text"
              readOnly={readOnly}
              name="GuarantorName"
              // placeholder="Họ Và Tên Chủ Nhà"
              className={cn(styles.inputField)}
              value={form.GuarantorName}
              onChange={handerInput}
            />
          </div>
        </div>
        <div className={cn(styles.inforPerson)}>
          <div className={cn(styles.rowItem)} id="FullNamePolice">
            <label htmlFor="hktt" className={cn(styles.textInputField)}>
              {Text.titleForeignerTrackingBook.fullNamePolice}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              type="text"
              readOnly={readOnly}
              name="FullNamePolice"
              // placeholder="Cán Bộ Đăng Ký"
              className={cn(styles.inputField)}
              value={form.FullNamePolice}
              onChange={handerInput}
            />
          </div>
          <div className={cn(styles.rowItem)} id="PoliceLead">
            <label htmlFor="hktt" className={cn("labelField")}>
              {Text.titleForeignerTrackingBook.PoliceLead}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              type="text"
              readOnly={readOnly}
              name="PoliceLead"
              // placeholder="Chỉ Huy Ký"
              className={cn(styles.inputField)}
              value={form.PoliceLead}
              onChange={handerInput}
            />
          </div>
        </div>
      </div>
      <div className={cn(styles.wrapperFooter)}>
        <div className={cn(styles.noteEnterAdd)}>
          <span className={cn("validatorText")}>{Text.inputRequired}</span>
        </div>
        <div className={cn(styles.btnModelAdd)}>
          <button
            onClick={() => setIsShow(false)}
            className={cn(styles.btnCancel)}
          >
            Hủy
          </button>
          {!readOnly && (
            <button
              className={cn(styles.btnSubmit)}
              onClick={handleSubmitForm}
            >
              Xong
            </button>
          )}
          {readOnly && (
            <button
              onClick={() => setReadOnly(false)}
              className={cn(styles.btnSubmit)}
            >
              Sửa
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
