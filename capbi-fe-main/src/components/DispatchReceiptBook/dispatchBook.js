import React, { useState, Fragment, useEffect } from "react";
import cn from "classnames";
import { nanoid } from "nanoid";
import styles from "./style.module.css";
import { GrPrevious, GrNext } from 'react-icons/gr'
import { AiOutlineFolderAdd, AiOutlineSearch } from 'react-icons/ai'
import ModalLayout from "@/layouts/modal";
import EditData from "./editData";
import ReadOnly from "./readOnly";
import BaseAxios from "@/store/setUpAxios";
import Loading from "../loadingComponent";
import NoData from "../noData/index";
import PaginatedItems from "../pagination";
function DispatchBook() {
  const [modalAdd, setModalAdd] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [checkUpdateApi, setCheckUpdateApi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paginate, setPaginate] = useState(1);
  const [addFormData, setAddFormData] = useState({
    date: "",
    scv: "",
    nbh: "",
    ty: "",
    cqbh: "",
    nh: "",
  });
  const [editFormData, setEditFormData] = useState({
    date: "",
    scv: "",
    nbh: "",
    ty: "",
    cqbh: "",
    nh: "",
  });

  const [editContactId, setEditContactId] = useState(null);
  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };
  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  };
  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    const formDataReq = {
      dateTime: addFormData.date,
      dispatchID: addFormData.scv,
      releaseDate: addFormData.nbh,
      subject: addFormData.ty,
      agencyissued: addFormData.cqbh,
      receiver: addFormData.nh,
    };

    BaseAxios({
      url: "api/dispatch/create-dispatch-handler",
      method: "POST",
      data: formDataReq,
    })
      .then(() => {
        setModalAdd(false);
        alert("Đã cập nhật thông tin");
        setCheckUpdateApi(!checkUpdateApi);
      })
      .catch(() => {
        alert("có lỗi xảy ra,vui lòng thử lại");
      });
  };
  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    let idData = editContactId;
    const editedContact = {
      dateTime: editFormData.date,
      dispatchID: editFormData.scv,
      releaseDate: editFormData.nbh,
      subject: editFormData.ty,
      agencyissued: editFormData.cqbh,
      receiver: editFormData.nh,
    };
    BaseAxios({
      url: `api/dispatch/update-dispatch/${idData}`,
      method: "POST",
      data: editedContact,
    })
      .then(() => {
        alert("Đã cập nhật thông tin");
        setCheckUpdateApi(!checkUpdateApi);
        setEditContactId(null);
      })
      .catch(() => {
        alert("Có lỗi xảy ra,vui lòng thử lại");
      });
  };
  const handleEditClick = (event, contact, index) => {
    event.preventDefault();
    setEditContactId(contact.id);
    const formValues = {
      date: contact.Datetime,
      scv: contact.DispatchID,
      nbh: contact.ReleaseDate,
      ty: contact.Subject,
      cqbh: contact.AgencyIssued,
      nh: contact.Receiver,
    };
    setEditFormData(formValues);
  };
  const handleCancelClick = () => {
    setEditContactId(null);
  };
  const handleDeleteClick = (contactId) => {
    console.log(contactId);
    BaseAxios({
      method: "POST",
      url: `api/dispatch/delete/${contactId}`,
    })
      .then(() => {
        alert("Đã xóa thành công");
        setCheckUpdateApi(!checkUpdateApi);
      })
      .catch(() => {
        alert("Có lỗi xảy ra,vui lòng thử lại");
      });
  };

  const handleSeachValue = () => {
    console.log("search");
  };

  const handleCloseModal = () => {
    setModalAdd(!modalAdd);
  };

  useEffect(() => {
    BaseAxios({
      url: "api/dispatch/get-dispatch",
      method: "POST",
    })
      .then((data) => {
        // console.log(data.data.data)
        // console.log(data)
        setLoading(false);
        setPaginate(data?.data?.data?.totalPage);
        setContacts(data.data.data.list_data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [checkUpdateApi]);

  return (
    <div className={cn(styles.container)}>
      {loading && <Loading />}
      <div className={cn(styles.dashboard)}>
        <div className={cn(styles.filter)}>
          <input placeholder="Tìm kiếm theo tên" type="text" />
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
          Sổ Tiếp Nhận Công Văn
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
          <form
            className={cn(styles.backGroundModal)}
            onSubmit={handleAddFormSubmit}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <div className={cn(styles.rowItem)}>
                <label htmlFor="date">Ngày tháng năm:</label>
                <input
                  type="date"
                  name="date"
                  required="required"
                  placeholder="Ngày tháng năm"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="scv">Số Công văn:</label>
                <input
                  type="text"
                  name="scv"
                  required="required"
                  placeholder="Số Công văn"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="nbh">Ngày tháng ban hành:</label>
                <input
                  type="date"
                  name="nbh"
                  required="required"
                  placeholder="Ngày tháng ban hành"
                  onChange={handleAddFormChange}
                ></input>
              </div>
            </div>
            <div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="ty">Trích yếu:</label>
                <input
                  type="text"
                  name="ty"
                  required="required"
                  placeholder="Trích yếu"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="cqbh">Cơ quan ban hành:</label>
                <input
                  type="text"
                  name="cqbh"
                  required="required"
                  placeholder="Cơ quan ban hành"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="nh">Người nhận:</label>
                <input
                  type="text"
                  name="nh"
                  required="required"
                  placeholder="Người nhận"
                  onChange={handleAddFormChange}
                ></input>
              </div>
            </div>
            <button className={cn(styles.addBtnModal)} type="sumbit">
              Thêm
            </button>
          </form>
        </ModalLayout>
      ) : null}
      <form onSubmit={handleEditFormSubmit} className={cn(styles.form)}>
        <table className={cn(styles.table)}>
          <thead className={cn(styles.thead)}>
            <tr className={cn(styles.tr)}>
              <th className={cn(styles.hearder, styles.stt)}>Stt</th>
              <th className={cn(styles.hearder)}>Ngày tháng năm</th>
              <th className={cn(styles.hearder)}>Số Công văn</th>
              <th className={cn(styles.hearder)}>Ngày tháng ban hành</th>
              <th className={cn(styles.hearder)}>Trích yếu</th>
              <th className={cn(styles.hearder)}>Cơ quan ban hành</th>
              <th className={cn(styles.hearder)}>Người nhận</th>
            </tr>
          </thead>

          <tbody>
            {contacts ? (
              contacts.map((contact, index) => (
                // eslint-disable-next-line react/jsx-key
                <Fragment key={index}>
                  {editContactId === contact.id ? (
                    <EditData
                      editFormData={editFormData}
                      contact={contact}
                      index={index}
                      handleEditFormChange={handleEditFormChange}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <ReadOnly
                      index={index}
                      contact={contact}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <NoData col="7 " />
            )}
          </tbody>
        </table>
      </form>
      <div className="btnPaginateContainer">
                    <PaginatedItems setPaginate={setPaginate} totalPage={paginate} />
                </div>
    </div>
  );
}
export default DispatchBook;
