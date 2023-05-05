import React, { useState, Fragment, useEffect } from "react";
import cn from "classnames";
import styles from "./style.module.css";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import { GrPrevious, GrNext } from "react-icons/gr";
import { AiOutlineFolderAdd, AiOutlineSearch } from "react-icons/ai";
import ModalLayout from "@/layouts/modal";
import BaseAxios from "@/store/setUpAxios";
import Loading from "../loadingComponent";
import NoData from "../noData/index";
import PaginatedItems from "../pagination";
function PersonalBook() {
  const [modalAdd, setModalAdd] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [checkUpdateApi, setCheckUpdateApi] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleIsUpdate = () => setIsUpdated(!isUpdated);
  const [isUpdated, setIsUpdated] = useState(false);
  const [paginate, setPaginate] = useState(1);
  const [addFormData, setAddFormData] = useState({
    date: "",
    name: "",
    gt: "",
    ntns: "",
    ndktt: "",
    ldc: "",
    cskv: "",
    ldk: "",
  });
  const [editFormData, setEditFormData] = useState({
    date: "",
    name: "",
    gt: "",
    ntns: "",
    ndktt: "",
    ldc: "",
    cskv: "",
    ldk: "",
  });
  const [searchValue, setSearchValue] = useState("");

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
      date: addFormData.date,
      fullName: addFormData.name,
      gender: addFormData.gt,
      birthday: addFormData.ntns,
      staying: addFormData.ndktt,
      grantReason: addFormData.ldc,
      verifier: addFormData.cskv,
      leaderSign: addFormData.ldk,
    };
    BaseAxios({
      url: "api/confirmation/create-confirmation-handler",
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
      date: editFormData.date,
      fullName: editFormData.name,
      gender: editFormData.gt,
      birthday: editFormData.ntns,
      staying: editFormData.ndktt,
      grantReason: editFormData.ldc,
      verifier: editFormData.cskv,
      leaderSign: editFormData.ldk,
    };
    BaseAxios({
      url: `api/confirmation/update-confirmation/${idData}`,
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
      date: contact.Date,
      name: contact.FullName,
      gt: contact.Gender,
      ntns: contact.Birthday,
      ndktt: contact.Staying,
      ldc: contact.GrantReason,
      cskv: contact.Verifier,
      ldk: contact.LeaderSign,
    };
    setEditFormData(formValues);
  };
  const handleCancelClick = () => {
    setEditContactId(null);
  };
  const handleDeleteClick = (contactId) => {
    BaseAxios({
      method: "POST",
      url: `api/confirmation/delete/${contactId}`,
    })
      .then(() => {
        setCheckUpdateApi(!checkUpdateApi);
        alert("Đã xóa thành công");
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
      url: "api/confirmation/get-confirmation",
      method: "POST",
    })
      .then((data) => {
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
          <input
            placeholder="Tìm kiếm theo tên"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
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
          Sổ Theo Dõi Xác Nhận Nhân Thân
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
                <label htmlFor="date">Ngày tháng:</label>
                <input
                  type="date"
                  name="date"
                  required="required"
                  placeholder="Ngày tháng"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  required="required"
                  placeholder="Họ và tên"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="gt">Giới tính:</label>
                <input
                  type="text"
                  name="gt"
                  required="required"
                  placeholder="Giới tính"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="ntns">Ngày tháng năm sinh:</label>
                <input
                  type="date"
                  name="ntns"
                  required="required"
                  placeholder="Ngày tháng năm sinh"
                  onChange={handleAddFormChange}
                ></input>
              </div>
            </div>
            <div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="ndktt">Nơi đăng ký thường trú (tạm trú):</label>
                <input
                  type="text"
                  name="ndktt"
                  required="required"
                  placeholder="Nơi đăng ký thường trú (tạm trú)"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="ldc">Lý do cấp:</label>
                <input
                  type="text"
                  name="ldc"
                  required="required"
                  placeholder="Lý do cấp"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="cskv">CSKV xác nhận:</label>
                <input
                  type="text"
                  name="cskv"
                  required="required"
                  placeholder="CSKV xác nhận"
                  onChange={handleAddFormChange}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="ldk">Lãnh đạo ký:</label>
                <input
                  type="text"
                  name="ldk"
                  required="required"
                  placeholder="Lãnh đạo ký"
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
              <th className={cn(styles.hearder)}>Ngày tháng</th>
              <th className={cn(styles.hearder)}>Họ và tên</th>
              <th className={cn(styles.hearder)}>Giới tính</th>
              <th className={cn(styles.hearder)}>Ngày tháng năm sinh</th>
              <th className={cn(styles.hearder)}>
                Nơi đăng ký thường trú (tạm trú)
              </th>
              <th className={cn(styles.hearder)}>Lý do cấp</th>
              <th className={cn(styles.hearder)}>CSKV xác nhận</th>
              <th className={cn(styles.hearder)}>Lãnh đạo ký</th>
              <th className={cn(styles.hearder, styles.actionGroup)}></th>
            </tr>
          </thead>

          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                // eslint-disable-next-line react/jsx-key
                <Fragment key={index}>
                  {editContactId === contact.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      contact={contact}
                      index={index}
                      handleEditFormChange={handleEditFormChange}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <ReadOnlyRow
                      index={index}
                      contact={contact}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <NoData col="10" />
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
export default PersonalBook;
