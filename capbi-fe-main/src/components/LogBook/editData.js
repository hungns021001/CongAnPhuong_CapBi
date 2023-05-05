import React from "react";
import cn from "classnames";
import styles from "./style.module.css";

import { AiFillCloseCircle, AiFillCheckSquare } from "react-icons/ai";
const EditData = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  contact,
}) => {

  console.log(editFormData)
  return (
    <tr>
      <th className={cn(styles.th)}>{contact.stt}</th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          name="sqd"
          value={editFormData.sqd}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Họ và tên"
          name="name"
          value={editFormData.name}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="date"
          required="required"
          name="ns"
          value={editFormData.ns}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Hộ khẩu thường trú"
          name="hktt"
          value={editFormData.hktt}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Dân tộc"
          name="dt"
          value={editFormData.dt}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Quốc tịch"
          name="qt"
          value={editFormData.qt}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Nghề nghiệp"
          name="nlv"
          value={editFormData.nlv}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Nội dung vi phạm"
          name="ndvp"
          value={editFormData.ndvp}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Người ra quyết định xử phạt"
          name="nrqdxp"
          value={editFormData.nrqdxp}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Hình thức xử lý"
          name="htxl"
          value={editFormData.htxl}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Cá bộ được phân"
          name="cbdp"
          value={editFormData.cbdp}
          onChange={handleEditFormChange}
        ></input>
      </th>
      <th className={cn(styles.th)}>
        <button type="submit"style={{marginRight:10,background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'green'}}><AiFillCheckSquare/></button>
        <button type="button" style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'red'}} onClick={handleCancelClick}>
         <AiFillCloseCircle/>
        </button>
      </th>
    </tr>
  );
};
export default EditData;
