import React, { useState, Fragment, useEffect } from "react";
import cn from "classnames";

import styles from "./style.module.css";
import ReadOnly from "./ReadOnly";
import Editable from "./Editable";
import { GrPrevious, GrNext } from "react-icons/gr";
import { AiOutlineFolderAdd, AiOutlineSearch } from "react-icons/ai";
import ModalLayout from "@/layouts/modal";
import BaseAxios from "@/store/setUpAxios";
import { apiServer, ErrorMessages, SuccessMessages } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";
import NoData from "../noData/index";
import PaginatedItems from "../pagination";
import Loading from "../loadingComponent";
function Tables() {
  const [modalAdd, setModalAdd] = useState(false);
  const [contact, setContact] = useState([]);
  const toggleIsUpdate = () => setIsUpdated(!isUpdated);
  const [isUpdated, setIsUpdated] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [personOnDuty, setPersonOnDuty] = useState("");
  const [details, setDetails] = useState("");
  const [handler, setHandler] = useState("");
  const [note, setNote] = useState("");
  const [paginate, setPaginate] = useState(1);
  const [loading, setLoading] = useState(true);
  const handleEditClick = (e, get) => setEditGetId(get.Id);
  const [searchValue,setSearchValue] = useState("")
  const [editGetId, setEditGetId] = useState(null);

  const handleCancelClick = () => {
    setEditGetId(null);
  };

  const handleSeachValue = () => {
    if(searchValue === "") {
      setIsUpdated(!isUpdated)
    } else {
      BaseAxios({
        method: "POST",
        url:`api/statusBookRouter/show/${searchValue}`
      }).then((contacts) => {
        setContact(contacts.data.data.list_data);
      }).catch(()=>{
        alert("Có lỗi xảy ra,vui lòng thử lại sau")
      })
    }
  };

  const handleCloseModal = () => {
    setModalAdd(!modalAdd);
  };

  const resetInputModal = () => {
    setDateTime("");
    setDetails("");
    setPersonOnDuty("");
    setHandler("");
    setNote("");
  };
  useEffect(() => {
    BaseAxios({
      method: "POST",
      url: apiServer.statusBookRouter.get,
    }).then((contacts) => {
      setPaginate(contacts?.data?.data?.totalPage);
      setContact(contacts.data.data.list_data);
      setLoading(false);
      
    })
    .catch(() => {
      setLoading(false);
    });
  }, [isUpdated]);

  const creatNewData = (e) => {
    e.preventDefault();
    let dataCreateData = {
      dateTime,
      personOnDuty,
      details,
      handler,
      note,
    };
    let isExitContact = checkIfEmptyValueExists(dataCreateData);
    if (isExitContact) {
      alert(ErrorMessages.inputData.empty);
    } else {
      BaseAxios({
        method: "POST",
        url: apiServer.statusBookRouter.create,
        data: dataCreateData,
      })
        .then(() => {
          handleCloseModal();
          alert(SuccessMessages.create);
          toggleIsUpdate();
          resetInputModal();
        })
        .catch(() => {
          alert(ErrorMessages.create);
        });
    }
  };

  const handleDelete = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.statusBookRouter.delete + id,
      data: params,
    })
      .then(() => {
        alert(SuccessMessages.delete);
        toggleIsUpdate();
      })
      .catch(() => {
        alert(ErrorMessages.delete);
      });
  };
  return (
    <div className={cn(styles.container)}>
      {loading && <Loading/>}
      <div className={cn(styles.dashboard)}>
        <div className={cn(styles.filter)}>
          <input placeholder="Tìm kiếm theo người trực" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} type="text" />
          <button onClick={handleSeachValue}>
            <AiOutlineSearch />
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontWeight: 600,
            margin: "30px 0px",
            fontSize: 18,
          }}
        >
          Sổ Tình Hình
        </p>
        <button
          onClick={() => setModalAdd(!modalAdd)}
          className={cn(styles.addBtn)}
        >
          Thêm
          <AiOutlineFolderAdd className={cn(styles.iconAdd)} />
        </button>
      </div>
      {modalAdd ? (
        <ModalLayout closeModal={handleCloseModal}>
          <form className={cn(styles.backGroundModal)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                flex: 1,
              }}
            >
              <div className={cn(styles.rowItem)}>
                <label>Ngày tháng:</label>
                <input
                  type="date"
                  value={dateTime}
                  required="required"
                  onChange={(e) => setDateTime(e.target.value)}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label>Người Trực:</label>
                <input
                  type="text"
                  value={personOnDuty}
                  required="required"
                  placeholder="Người trực..."
                  onChange={(e) => setPersonOnDuty(e.target.value)}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="ndth">Nội dung tình hình:</label>
                <input
                  type="text"
                  value={details}
                  required="required"
                  placeholder="Nội dung tình hình..."
                  onChange={(e) => setDetails(e.target.value)}
                ></input>
              </div>
            </div>
            <div>
              <div className={cn(styles.rowItem)}>
                <label>người xử lý:</label>
                <input
                  type="text"
                  value={handler}
                  required="required"
                  placeholder="Người xử lý..."
                  onChange={(e) => setHandler(e.target.value)}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label>Ghi chú:</label>
                <input
                  type="text"
                  value={note}
                  required="required"
                  placeholder="Ghi chú..."
                  onChange={(e) => setNote(e.target.value)}
                ></input>
              </div>
            </div>
            <button
              className={cn(styles.addBtnModal)}
              type="sumbit"
              onClick={creatNewData}
            >
              Thêm
            </button>
          </form>
        </ModalLayout>
      ) : null}
      <form className={cn(styles.form)}>
        <table className={cn(styles.table)}>
          <thead className={cn(styles.thead)}>
            <tr className={cn(styles.tr)}>
              <th className={cn(styles.hearder, styles.stt)}>Stt</th>
              <th className={cn(styles.hearder)}>Ngày tháng</th>
              <th className={cn(styles.hearder)}>Người trực</th>
              <th className={cn(styles.hearder)}>Nội dung tình hình</th>
              <th className={cn(styles.hearder)}>Người xử lý</th>
              <th className={cn(styles.hearder)}>Ghi chú </th>

              <th className={cn(styles.hearder, styles.actionGroup)}></th>
            </tr>
          </thead>
          <tbody>
          { contact.length > 0  ? (
            contact.map((contacts, index) => (
              // eslint-disable-next-line react/jsx-key
              <Fragment key={index}>
                {editGetId === contacts.Id ? (
                  <Editable
                    contacts={contacts}
                    index={index}
                    updatedContacts={toggleIsUpdate}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnly
                    index={index}
                    contacts={contacts}
                    handleEditClick={handleEditClick}
                    handleDelete={handleDelete}
                  />
                )}
              </Fragment>
            ))
          ): (
            <NoData col="7"/>
          )
          }
          </tbody>
        </table>
      </form>
    <div className="btnPaginateContainer">
                    <PaginatedItems setPaginate={setPaginate} totalPage={paginate} />
                </div>
    </div>
  );
}
export default Tables;
