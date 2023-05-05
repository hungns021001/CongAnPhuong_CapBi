import React from "react";
import cn from "classnames";
import styles from "./index.module.css";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import formatDate from "@/formatTime";
const ReadOnly = ({ contact, handleEditClick, handleDeleteClick,index }) => {
  return (
    <tr>
      <td className={cn(styles.td)}>{index+1}</td>
      <td className={cn(styles.td)}>{contact.DecisionId}</td>
      <td className={cn(styles.td)}>{contact.FullName}</td>
      <td className={cn(styles.td)}>{contact.Birthday ? formatDate(String(contact.Birthday)) : ""}</td>
      <td className={cn(styles.td)}>{contact.Staying}</td>
      <td className={cn(styles.td)}>{contact.Nation}</td>
      <td className={cn(styles.td)}>{contact.Country}</td>
      <td className={cn(styles.td)}>{contact.Job}</td>
      <td className={cn(styles.td)}>{contact.Content}</td>
      <td className={cn(styles.td)}>{contact.Punisher}</td>
      <td className={cn(styles.td)}>{contact.ProcessingForm}</td>
      <td className={cn(styles.td)}>{contact.FullNamePolice}</td>
      <td className={cn(styles.td)}>
        <button
          type="button"
          style={{marginRight:10,background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'red'}}
          onClick={(event) => handleEditClick(event, contact,index)}
        >
          <AiOutlineEdit/>
        </button>
        <button 
        style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:'violet'}}
        type="button" onClick={() => handleDeleteClick(contact.id)}>
        <AiFillDelete/>
        </button>
      </td> 
    </tr>
  );
};

export default ReadOnly;
