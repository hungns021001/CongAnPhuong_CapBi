import React from "react";
import cn from "classnames";
import styles from "./style.module.css";
import { AiFillCloseCircle, AiFillCheckSquare } from "react-icons/ai";
const EditData = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  index

}) => {
  return (
    <tr>
      <td className={cn(styles.td)}>
        {index+1}
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="date"
          placeholder="Enter a name..."
          name="date"
          value={editFormData.date}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="name"
          value={editFormData.name}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="gt"
          value={editFormData.gt}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="date"
          placeholder="Enter a name..."
          name="ntns"
          value={editFormData.ntns}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="ndktt"
          value={editFormData.ndktt}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="ldc"
          value={editFormData.ldc}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="cskv"
          value={editFormData.cskv}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
          className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="ldk"
          value={editFormData.ldk}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <button type="submit"style={{marginRight:10,background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'green'}}><AiFillCheckSquare/></button>
        <button type="button" style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'red'}} onClick={handleCancelClick}>
          <AiFillCloseCircle/>
        </button>
      </td>
    </tr>
  );
};
export default EditData;
