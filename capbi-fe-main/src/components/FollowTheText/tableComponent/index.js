import EmptyData from "@/NewComponents/emptyData";
import LoadingTable from "@/NewComponents/loadingTable";
import Modal from "@/NewComponents/newModal";
import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ToastContainer } from "react-toastify";
import ModalConfirm from "../../../NewComponents/modalConfirm";
import { ErrorMessages, SuccessMessages, Text } from "../../../constant";
import { notifyError, notifySuccess } from "../../../notify";
import PaginatedItems from "../../pagination/index";
import ContentModal from "../contentModal";
import {
  _deleteFollowTheTextServices,
  _getListFollowTheTextServices
} from "../services";
import styles from "./index.module.css";

function TableComponent() {
  const [openAdd, setOpenAdd] = useState(false);
  const [startExport, setStartExport] = useState("");
  const [fieldSearch, setFieldSearch] = useState("");
  const [endExport, setEndExport] = useState("");
  const [mainData, setMainData] = useState([]);
  const [paginate, setPaginate] = useState(1);
  const [paginateSearch, setPaginateSearch] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPageSearch, setTotalPageSearch] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const [id, setId] = useState("");
  const [addEvent, setAddEvent] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);
  const [form, setForm] = useState({
    dateTime: "",
    dispatchID: "",
    recipients: "",
    releaseDate: "",
    signer: "",
    subject: "",
  });

  const handleShowModal = (e) => {
    setAddEvent(true);
    setDesc(Text.CRUD.end);
    setOpenAdd(true);
    setIsUpdateSuccess(false);
    setForm({
      ...form,
      dateTime: "",
      dispatchID: "",
      recipients: "",
      releaseDate: "",
      signer: "",
      subject: "",
    });
  };

  useEffect(() => {
    _getListFollowTheText();
  }, []);

  useEffect(() => {
    if (mainData) {
      setLoading(false);
    }
  }, [mainData]);

  useEffect(() => {
    if (isUpdatedSuccess) {
      _getListFollowTheText();
    }
    setSearchLoading(true)
  }, [isUpdatedSuccess, searchLoading]);

  useEffect(() => {
    _getListFollowTheText();
  }, [paginate]);

  const _getListFollowTheText = async () => {
    try {
      const res = await _getListFollowTheTextServices(paginate);
      if (res && res.status === Text.statusTrue) {
        setMainData(res.data.data.list_data);
        setTotalPage(res.data.data.totalPage);
      }
    } catch (error) { }
  };

  const handleEdit = (data) => {
    setDesc(Text.CRUD.insert);
    setOpenAdd(true);
    setIsUpdateSuccess(false);
    setForm({
      ...form,
      dateTime: formatDate(data.Datetime),
      dispatchID: data.DispatchID,
      recipients: data.Recipients,
      releaseDate: formatDate(data.ReleaseDate),
      signer: data.Signer,
      subject: data.Subject,
    });
    setId(data.Id);
  };

  const handleClose = () => {
    setOpenAdd(false);
  };

  // search
  const handleSearch = () => {
    setPaginate(1);
    setPaginateSearch(1);
    if (searchValue.trim() === "") {
      toggleIsUpdateSuccess();
      setSearchValue("");
    } else {
      callApiSearch();
    }
  };

  const callApiSearch = () => {
    const myObject = {};
    myObject[fieldSearch] = searchValue;
    BaseAxios({
      url: `api/tracker/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        setMainData(trackers?.data?.data?.list_data);
        setTotalPageSearch(trackers?.data?.data?.totalPage);
        setPaginate(1);
        setTotalPage(0);
      })
      .catch(() => {
        setMainData([]);
        setTotalPage(0);
        setTotalPageSearch(0);
      });
  };
  // end search

  const handleOpenModalDelete = (id) => {
    setConfirmDelete(true);
    setIsUpdateSuccess(false);
    setId(id);
  };

  const handleSearchKeyPress = (e) => {
    if (e.keyCode === Text.keyEnter) {
      handleSearch();
    }
  };

  const _handleDeleteFollowTheText = async () => {
    try {
      const res = await _deleteFollowTheTextServices(id);
      if (res && res.status === Text.statusTrue) {
        setIsUpdateSuccess(true);
        setConfirmDelete(false);
        notifySuccess(SuccessMessages.delete);
        setId("");
      } else {
        setConfirmDelete(false);
        setIsUpdateSuccess(false);
        notifySuccess(ErrorMessages.delete);
      }
    } catch (error) {
      setConfirmDelete(false);
      setIsUpdateSuccess(false);
      notifySuccess(ErrorMessages.delete);
    }
  };
  const handleExportInformation = () => {
    const timeExport = {
      startDate: startExport,
      endDate: endExport,
    };
    BaseAxios({
      url: "api/tracker/exports",
      method: "POST",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        notifySuccess(Text.CRUD.Success);
      })
      .catch(() => {
        notifyError(Text.CRUD.Error);
      });
    console.log(timeExport);
    setStartExport("");
    setEndExport("");
  };

  return (
    <div className={cn(styles.wrapper)}>
      <ToastContainer />
      {openAdd && (
        <Modal handleCloseModal={handleClose}>
          <ContentModal
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
            form={form}
            setForm={setForm}
            id={id}
            setId={setId}
            addEvent={addEvent}
            setAddEvent={setAddEvent}
          />
        </Modal>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>{"Sổ theo dõi văn bản đi"}</h2>
        </div>
        <div className={cn(styles.searchAndAddMobile)}>
          <div className={cn(styles.groupBtnLeft)}>
            <div className={cn(styles.export)}>
              <div
                className={cn(styles.addnew)}
                onClick={handleExportInformation}
              >
                <BsCloudDownload className={cn(styles.iconExport)} />
              </div>
            </div>
            {/* <div className={cn(styles.startExportDate)}>
                            <span>
                                {Text.dateStart}
                                {Text.colon}
                            </span>
                            <input
                                value={startExport}
                                onChange={(e) => setStartExport(e.target.value)}
                                className={cn(styles.inputDateExport)}
                                type="date"
                            />
                        </div>
                        <div className={cn(styles.endExportDate)}>
                            <span>
                                {Text.dateEnd}
                                {Text.colon}
                            </span>
                            <input
                                value={endExport}
                                onChange={(e) => setEndExport(e.target.value)}
                                className={cn(styles.inputDateExport)}
                                type="date"
                            />
                        </div> */}
          </div>
          <div className={cn(styles.groupBtnRight)}>
            <div className={cn(styles.selectbtn)}>
              <select
                className={cn(styles.inputField)}
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
              >
                <option>{"Chọn giá trị"}</option>
                <option className={cn(styles.option)} value="dispatchID">
                  Số Công Văn
                </option>
                <option value="releaseDate">Ngày Tháng Ban Hành</option>
                <option value="subject">Trích Yếu</option>
                <option value="signer">Người Ký</option>
                <option value="recipients">Nơi Nhận</option>
              </select>
            </div>
            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm"
                onKeyDown={(e) => handleSearchKeyPress(e)}
              />
              <div className={cn(styles.empty)} ></div>
              {
                (searchValue.trim() != "") ? (
                  searchLoading && <IoIosCloseCircleOutline
                    className={cn(styles.closeIcon)}
                    onClick={() => {
                      setSearchLoading(false)
                      setSearchValue("")
                    }}
                  />) : (
                  <div></div>
                )
              }
              <BiSearchAlt2
                onClick={handleSearch}
                className={cn(styles.searchIcon)}
              />
            </div>
            <div className={cn(styles.addnew)}>
              <button onClick={handleShowModal}>{Text.plus}</button>
            </div>
          </div>
        </div>
        <div className={cn(styles.contentbody)}>
          <table className={cn(styles.tableContent)} cellSpacing="0">
            <thead>
              <tr>
                <th className={cn(styles.stt)}>{"STT"}</th>
                <th className={cn(styles.dispatchNumber)}>{"Số công văn"}</th>
                <th className={cn(styles.issueDate)}>
                  {"Ngày tháng ban hành"}
                </th>
                <th className={cn(styles.abstract)}>{"Trích yếu"}</th>
                <th className={cn(styles.signer)}>{" Người ký"}</th>
                <th className={cn(styles.recipients)}>{"Nơi nhận"}</th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {mainData.length > 0 && (
              <tbody>
                {mainData.map((item, index) => (
                  <tr key={`item-${index}`}>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.contentStt)}
                    >
                      {index + 1}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentDispatchNumber)}
                    >
                      {item.DispatchID}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentIssueDate)}
                    >
                      {formatDate(item.ReleaseDate)}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentAbsTract)}
                    >
                      {item.Subject}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentSinger)}
                    >
                      {item.Signer}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentRecipients)}
                    >
                      {item.Recipients}
                    </td>
                    <td
                      className={cn(
                        styles.contentEditAndDelete,
                        styles.itemTable
                      )}
                    >
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={_handleDeleteFollowTheText}
                          backgroundColor={Text.CRUD.backgroundDeleteModal}
                          description={Text.CRUD.deleteConfirm}
                          alertBtn={false}
                          deleteBtn={true}
                          closeModal={() => setConfirmDelete(false)}
                        />
                      )}
                      <AiOutlineDelete
                        className={cn(styles.delete)}
                        onClick={() => handleOpenModalDelete(item.Id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
            {mainData.length === 0 && !loading && <EmptyData colSpan={7} />}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={7} className={cn(styles.loadingArea)}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TableComponent);
