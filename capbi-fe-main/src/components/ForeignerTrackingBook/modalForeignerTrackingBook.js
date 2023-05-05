// import cn from "classnames";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { checkIfEmptyValueExists } from "../../commonHandle";
// import { SuccessMessages, Text, apiServer } from "../../constant";
// import formatDate from "../../formatTime";
// import BaseAxios from "../../store/setUpAxios";
// import styles from "./index.module.css";

// export default function ForeignerTrackingBookModal({ setIsShow, successToast, toggleIsUpdateSuccess, addEvent, setAdd }) {
//   const dataMain = useSelector((state) => state.foreignerTrackingBookSlice.dataMain);

//   const [readOnly, setReadOnly] = useState(true);

//   const [form, setForm] = useState({
//     RegisterDate: formatDate(String(dataMain?.RegisterDate)) || "",
//     FullName: dataMain?.FullName || "",
//     BirthDay: formatDate(String(dataMain?.BirthDay)) || "",
//     Country: dataMain?.Country || "",
//     ResidentialAddress: dataMain?.ResidentialAddress || "",
//     Passport: dataMain?.Passport || "",
//     RecidencePermitNumber: dataMain?.RecidencePermitNumber || "",
//     Job: dataMain?.Job || "",
//     EntryDate: formatDate(String(dataMain?.EntryDate)) || "",
//     GateEntry: dataMain?.GateEntry || "",
//     EntryPurpose: dataMain?.EntryPurpose || "",
//     SojournDateFrom: formatDate(String(dataMain?.SojournDateFrom)) || "",
//     SojournDateTo: formatDate(String(dataMain?.SojournDateTo)) || "",
//     GuarantorName: dataMain?.GuarantorName || "",
//     FullNamePolice: dataMain?.FullNamePolice || "",
//     PoliceLead: dataMain?.PoliceLead || "",
//   });

//   const handerInput = (e) => {
//     let valueStyle = e.target.name;
//     let name = e.target.name;
//     let value = e.target.value;
//     document.getElementById(valueStyle).style.borderColor = "#727272";

//     console.log({ valueStyle, value, name });
//     return (setForm({
//       ...form,
//       [name]: value
//     }))
//   }

//   const checkFormatDateBeforeSubmit = (date) => {
//     if (String(date).slice(0, 3).includes("-") === false)
//       date = formatDate(String(date));
//     return date;
//   };

//   useEffect(() => {
//     if (addEvent) {
//       setReadOnly(false);
//       setAdd(false)
//     };
//   }, []);

//   const handleSubmitForm = async (e) => {
//     e.preventDefault();

//     let RegisterDate = checkFormatDateBeforeSubmit(form.RegisterDate);
//     let BirthDay = checkFormatDateBeforeSubmit(form.BirthDay);
//     let EntryDate = checkFormatDateBeforeSubmit(form.EntryDate);
//     let SojournDateFrom = checkFormatDateBeforeSubmit(form.SojournDateFrom);
//     let SojournDateTo = checkFormatDateBeforeSubmit(form.SojournDateTo);

//     let dataCreateTracker = {
//       RegisterDate,
//       FullName: form.FullName,
//       BirthDay,
//       Country: form.Country,
//       ResidentialAddress: form.ResidentialAddress,
//       Passport: form.Passport,
//       RecidencePermitNumber: form.RecidencePermitNumber,
//       Job: form.Job,
//       EntryDate,
//       GateEntry: form.GateEntry,
//       EntryPurpose: form.EntryPurpose,
//       SojournDateFrom,
//       SojournDateTo,
//       GuarantorName: form.GuarantorName,
//       FullNamePolice: form.FullNamePolice,
//       PoliceLead: form.PoliceLead,
//     };

//     let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
//     if (isExitsEmptyData) {
//       if (form.RegisterDate.trim() === "") {
//         console.log("ko ok")
//         const registerDate = document.getElementById("RegisterDate");
//         registerDate.style.border = Text.error.border;
//       }
//       if (form.FullName.trim() === "") {
//         console.log("ok")
//         const fullName = document.getElementById("FullName");
//         fullName.style.border = Text.error.border;
//       }
//       if (form.BirthDay.trim() === "") {
//         const birthDay = document.getElementById("BirthDay");
//         birthDay.style.border = Text.error.border;
//       }
//       if (form.Country.trim() === "") {
//         const country = document.getElementById("Country");
//         country.style.border = Text.error.border;
//       }
//       if (form.ResidentialAddress.trim() === "") {
//         const residentialAddress = document.getElementById("ResidentialAddress");
//         residentialAddress.style.border = Text.error.border;
//       }
//       if (form.Passport.trim() === "") {
//         const passport = document.getElementById("Passport");
//         passport.style.border = Text.error.border;
//       }
//       if (form.Job.trim() === "") {
//         const fullName = document.getElementById("Job");
//         fullName.style.border = Text.error.border;
//       }
//       if (form.RecidencePermitNumber.trim() === "") {
//         const recidencePermitNumber = document.getElementById("RecidencePermitNumber");
//         recidencePermitNumber.style.border = Text.error.border;
//       }
//       if (form.EntryDate.trim() === "") {
//         const entryDate = document.getElementById("EntryDate");
//         entryDate.style.border = Text.error.border;
//       }
//       if (form.GateEntry.trim() === "") {
//         const gateEntry = document.getElementById("GateEntry");
//         gateEntry.style.border = Text.error.border;
//       }
//       if (form.EntryPurpose.trim() === "") {
//         const entryPurpose = document.getElementById("EntryPurpose");
//         entryPurpose.style.border = Text.error.border;
//       }
//       if (form.SojournDateFrom.trim() === "") {
//         const sojournDateFrom = document.getElementById("SojournDateFrom");
//         sojournDateFrom.style.border = Text.error.border;
//       }
//       if (form.SojournDateTo.trim() === "") {
//         const sojournDateTo = document.getElementById("SojournDateTo");
//         sojournDateTo.style.border = Text.error.border;
//       }
//       if (form.GuarantorName.trim() === "") {
//         const guarantorName = document.getElementById("GuarantorName");
//         guarantorName.style.border = Text.error.border;
//       }
//       if (form.FullNamePolice.trim() === "") {
//         const fullNamePolice = document.getElementById("FullNamePolice");
//         fullNamePolice.style.border = Text.error.border;
//       }
//       if (form.PoliceLead.trim() === "") {
//         const policeLead = document.getElementById("PoliceLead");
//         policeLead.style.border = Text.error.border;
//       }
//     }
//     else {
//       let url = apiServer.foreignerTracking.create;
//       let successMessage = SuccessMessages.create;

//       if (dataMain.Id > 0) {
//         url = apiServer.foreignerTracking.edit + dataMain.Id;
//         successMessage = SuccessMessages.edit;
//       }

//       await BaseAxios({
//         method: "POST",
//         url: url,
//         data: dataCreateTracker,
//       })
//         .then(res => {
//           toggleIsUpdateSuccess();
//           successToast(successMessage);
//           setIsShow(false)
//           console.log("res data create: ", res, "dataCreateTracker: ", dataCreateTracker)
//         })
//     }
//   }


//   return (
//     <div className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}>
//       <div className={cn(styles.inputArea)}>
//         <div className={cn(styles.group)} id="RegisterDate">
//           <label className={cn(styles.labelField)} htmlFor="name"> Ngày Đăng Ký *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             required
//             type="date"
//             // placeholder="15-01-2002"
//             name="RegisterDate"
//             value={form.RegisterDate}
//             onChange={handerInput}
//           />
//           <input
//             className={cn(styles.textInputField)}
//             readOnly
//             required
//             type="text"
//             placeholder="dd-mm-yyyy"
//             name="RegisterDate"
//             value={formatDate(String(form.RegisterDate))}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="FullName">
//           <label className={cn("labelField")} htmlFor="name">Họ và tên *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             type="text"
//             name="FullName"
//             placeholder="Họ và tên"
//             value={form.FullName}
//             onChange={handerInput}
//           />
//         </div>

//       </div>
//       <div className={cn(styles.inforPerson)}>
//         <div className={cn(styles.rowItem)} id="BirthDay">
//           <label htmlFor="date" className={cn("labelField")}>Ngày tháng năm sinh *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             type="date"
//             name="BirthDay"
//             value={form.BirthDay}
//             onChange={handerInput}
//           />
//           <input
//             className={cn(styles.textInputField)}
//             type="text"
//             readOnly
//             name="BirthDay"
//             placeholder="dd-mm-yyyy"
//             value={formatDate(String(form.BirthDay))}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="Country">
//           <label htmlFor="gt" className={cn("labelField")}>Quốc tịch *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             type="text"
//             name="Country"
//             placeholder="Quốc tịch"
//             value={form.Country}
//             onChange={handerInput}
//           />
//         </div>
//       </div>
//       <div className={cn(styles.inforPerson)}>
//         <div className={cn(styles.rowItem)} id="ResidentialAddress">
//           <label htmlFor="gt" className={cn("labelField")}>Địa Chỉ Cư Trú *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             type="text"
//             name="ResidentialAddress"
//             placeholder="Địa Chỉ Cư Trú"
//             value={form.ResidentialAddress}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="Passport">
//           <label htmlFor="gt" className={cn(styles.labelField)} >Sổ hộ chiếu *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             type="text"
//             name="Passport"
//             required="required"
//             placeholder="Sổ hộ chiếu"
//             value={form.Passport}
//             onChange={handerInput}
//           />
//         </div>
//       </div>
//       <div className={cn(styles.inforPerson)}>
//         <div className={cn(styles.rowItem)} id="RecidencePermitNumber">
//           <label htmlFor="gt" className={cn("labelField")}> Số Giấy Tờ Cho Cư Trú *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             type="text"
//             name="RecidencePermitNumber"
//             placeholder="Số Giấy Tờ cho Cư Trú"
//             value={form.RecidencePermitNumber}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="Job">
//           <label htmlFor="gt" className={cn("labelField")}> Nghề Nghiệp *</label>
//           <input
//             className={cn(styles.textInputField)}
//             type="text"
//             readOnly={readOnly}
//             name="Job"
//             placeholder="Nghề Nghiệp"
//             value={form.Job}
//             onChange={handerInput}
//           />
//         </div>

//       </div>
//       <div className={cn(styles.inforPerson)}>
//         <div className={cn(styles.rowItem)} id="EntryDate">
//           <label htmlFor="gt" className={cn("labelField")}>Ngày nhập cảnh *</label>
//           <input
//             className={cn(styles.textInputField)}
//             readOnly={readOnly}
//             type="date"
//             name="EntryDate"
//             value={form.EntryDate}
//             onChange={handerInput}
//           />
//           <input
//             className={cn(styles.textInputField)}
//             type="text"
//             readOnly
//             name="EntryDate"
//             placeholder="dd-mm-yyyy"
//             value={formatDate(String(form.EntryDate))}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="GateEntry">
//           <label htmlFor="gt" className={cn("labelField")}>Cửa Khẩu Nhập Cảnh *</label>
//           <input
//             className={cn(styles.textInputField)}
//             type="text"
//             readOnly={readOnly}
//             name="GateEntry"
//             placeholder="Cửa Khẩu Nhập Cảnh"
//             value={form.GateEntry}
//             onChange={handerInput}
//           />
//         </div>

//       </div>
//       <div className={cn(styles.inforPerson)}>
//         <div className={cn(styles.rowItem)} id="EntryPurpose">
//           <label htmlFor="gt" className={cn("labelField")}>Mục Đích Nhập Cảnh *</label>
//           <input
//             className={cn(styles.textInputField)}
//             type="text"
//             readOnly={readOnly}
//             name="EntryPurpose"
//             placeholder="Mục Đích Nhập Cảnh"
//             value={form.EntryPurpose}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="SojournDateFrom">
//           <label htmlFor="hktt" className={cn("labelField")}>Ngày Bắt Đầu Tạm Trú *</label>
//           <input
//             type="date"
//             readOnly={readOnly}
//             name="SojournDateFrom"
//             value={form.SojournDateFrom}
//             className={cn(styles.textInputField)}
//             onChange={handerInput}
//           />
//           <input
//             type="text"
//             readOnly
//             name="SojournDateFrom"
//             placeholder="dd-mm-yyyy"
//             value={formatDate(String(form.SojournDateFrom))}
//             className={cn(styles.textInputField)}
//             onChange={handerInput}
//           />
//         </div>
//       </div>
//       <div className={cn(styles.inforPerson)}>
//         <div className={cn(styles.rowItem)} id="SojournDateTo">
//           <label htmlFor="hktt" className={cn("labelField")}>Ngày Đi *</label>
//           <input
//             type="date"
//             readOnly={readOnly}
//             name="SojournDateTo"
//             className={cn(styles.textInputField)}
//             value={form.SojournDateTo}
//             onChange={handerInput}
//           />
//           <input
//             type="text"
//             readOnly
//             name="SojournDateTo"
//             placeholder="dd-mm-yyyy"
//             className={cn(styles.textInputField)}
//             value={formatDate(String(form.SojournDateTo))}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="GuarantorName">
//           <label htmlFor="hktt" className={cn(styles.textInputField)} >Họ Và Tên Chủ Nhà *</label>
//           <input
//             type="text"
//             readOnly={readOnly}
//             name="GuarantorName"
//             placeholder="Họ Và Tên Chủ Nhà"
//             className={cn(styles.textInputField)}
//             value={form.GuarantorName}
//             onChange={handerInput}
//           />
//         </div>

//       </div>
//       <div className={cn(styles.inforPerson)}>
//         <div className={cn(styles.rowItem)} id="FullNamePolice">
//           <label htmlFor="hktt" className={cn(styles.textInputField)} >Cán Bộ Đăng Ký *</label>
//           <input
//             type="text"
//             readOnly={readOnly}
//             name="FullNamePolice"
//             placeholder="Cán Bộ Đăng Ký"
//             className={cn(styles.textInputField)}
//             value={form.FullNamePolice}
//             onChange={handerInput}
//           />
//         </div>
//         <div className={cn(styles.rowItem)} id="PoliceLead">
//           <label htmlFor="hktt" className={cn("labelField")}>Chỉ Huy Ký *</label>
//           <input
//             type="text"
//             readOnly={readOnly}
//             name="PoliceLead"
//             placeholder="Chỉ Huy Ký"
//             className={cn(styles.textInputField)}
//             value={form.PoliceLead}
//             onChange={handerInput}
//           />
//         </div>
//       </div>
//       <div className={cx("groupBtn")}>
//         <div id="staffReceive" className={cx("noteModal")}>
//           <span>(*) là những trường bắt buộc phải nhập </span>
//         </div>

//         <div className={cx("setText")}>
//           <span className={cx("validatorText")}>{Text.inputRequired}</span>
//         </div>
//         <div className={cx("setButton")}>
//           <button onClick={handleCloseModal} className={cx("btnCancel")}>
//             {Text.CRUD.cancel}
//           </button>
//           {!readOnly && (
//             <button
//               type="submit"
//               className={cx("btnSubmit")}
//               onClick={handleSubmit}
//             >
//               Xong
//             </button>
//           )}
//           {readOnly && (
//             <button
//               onClick={() => setReadOnly(false)}
//               className={cx("btnSubmit")}
//             >
//               {descTitle}
//             </button>
//           )}
//         </div>
//       </div>
//     </div >

//   );
// }

