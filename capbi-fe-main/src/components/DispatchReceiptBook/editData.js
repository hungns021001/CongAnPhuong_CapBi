import React from "react";
import cn from "classnames";
import styles from "./style.module.css";
import {AiFillCloseCircle, AiFillCheckSquare } from "react-icons/ai";

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
          required="required"
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
          name="scv"
          value={editFormData.scv}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
        className={cn(styles.input)}
          type="date"
          required="required"
          placeholder="Enter a name..."
          name="nbh"
          value={editFormData.nbh}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
        className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="ty"
          value={editFormData.ty}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
        className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="cqbh"
          value={editFormData.cqbh}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)}>
        <input
        className={cn(styles.input)}
          type="text"
          required="required"
          placeholder="Enter a name..."
          name="nh"
          value={editFormData.nh}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td className={cn(styles.td)} >
       
      <button type="submit"style={{marginRight:10,background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'green'}}><AiFillCheckSquare/></button>
        <button type="button" style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'red'}} onClick={handleCancelClick}>
         <AiFillCloseCircle/>
        </button>
      </td>
    </tr>
  );
};
export default EditData;
