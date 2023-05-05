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
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import {
  ErrorMessages,
  SuccessMessages,
  Text,
  apiServer,
} from "../../../constant";
import { notifyError, notifySuccess } from "../../../notify";
import PaginatedItems from "../../pagination";
import ContentModal from "../contentModal";
import ModalConfirm from "../modalConfirm";
import {
  _deleteFollowTheTextServices,
  _getListFollowTheTextServices
} from "../services";
import styles from "./index.module.css";


function TableComponent() {
  const [readOnly, setReadOnly] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
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
  const [addEvent, setAddEvent] = useState(false);
  const dispatch = useDispatch();
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    date: "",
    location: "",
    force: "",
    mission: "",
    note: "",
  });
  const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);
  useEffect(() => {
    if (searchValue === "") {
      if (noPreventCallApiAgain) {
        BaseAxios({
          method: "POST",
          url: apiServer.calendar.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setMainData(trackers?.data?.data.list_data);
            setLoading(false);
            setTotalPage(trackers?.data?.data?.totalPage);
            setPaginateSearch(1);
            setTotalPageSearch(0);
          })
          .catch((err) => {
          });
      }
    } else {
      callApiSearch();
    }
    setNoPreventCallApiAgain(true);
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain]);
  const handleShowModal = (e) => {
    setDesc(Text.CRUD.add);
    setOpenAdd(true);
    setAddEvent(true)
    setReadOnly(false);
    setIsUpdateSuccess(false);
    setForm({
      ...form,
      date: "",
      location: "",
      force: "",
      mission: "",
      note: "",
    });
  };
  useEffect(() => {
    _getListFollowTheText();
  }, []);
  useEffect(() => {
    _getListFollowTheText();
  }, [form.date]);
  useEffect(() => {
    if (mainData) {
      setLoading(false);
    }
  }, [mainData]);
  useEffect(() => {
    if (isUpdatedSuccess) {
      _getListFollowTheText();
    }
  }, [isUpdatedSuccess]);
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
    setReadOnly(true);
    setIsUpdateSuccess(false);
    setForm({
      ...form,
      date: data.Date,
      location: data.Location,
      force: data.Force,
      mission: data.Mission,
      note: data.Note,
    });
    setId(data.Id);
  };
  const handleClose = () => {
    setOpenAdd(false);
  };
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
      url: `api/calendar/show`,
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
        alert(ErrorMessages.search.noMatchingResults);
      });
  };
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
      url: "api/calendar/exports",
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
        notifySuccess("Đã tải xuống file");
      })
      .catch(() => {
        notifyError("Có lỗi xảy ra, vui lòng thử lại");
      });
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
            readOnly={readOnly}
            setReadOnly={setReadOnly}
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            addEvent={addEvent}
            setAddEvent={setAddEvent}
          />
        </Modal>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>Sổ lịch bảo vệ sự kiện</h2>
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
          </div>
          <div className={cn(styles.groupBtnRight)}>
            <div className={cn(styles.selectbtn)}>
              <select
                className={cn(styles.inputField)}
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
              >
                <option>Chọn giá trị</option>
                <option value="date"> {Text.eventBook.date}</option>
                <option value="location"> {Text.eventBook.location}</option>
                <option value="force"> {Text.eventBook.force}</option>
                <option value="mission"> {Text.eventBook.mission}</option>
                <option value="note"> {Text.eventBook.note}</option>
              </select>
            </div>

            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm..."
                onKeyDown={(e) => handleSearchKeyPress(e)}
              />
              <BiSearchAlt2
                onClick={handleSearch}
                className={cn(styles.searchicon)}
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
                <th className={cn(styles.time)}>{Text.eventBook.date}</th>
                <th className={cn(styles.location)}>
                  {Text.eventBook.location}
                </th>
                <th className={cn(styles.force)}>{Text.eventBook.force}</th>
                <th className={cn(styles.mission)}>{Text.eventBook.mission}</th>
                <th className={cn(styles.note)}>{Text.eventBook.note}</th>
                <th className={cn(styles.contentEditAndDelete)}></th>
              </tr>
            </thead>
            {mainData.length > 0 && (
              <tbody>
                {mainData.map((item, index) => (
                  <tr key={`item-${index}`}>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.time)}
                    >
                      {item?.Date ? formatDate(String(item.Date)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.location)}
                    >
                      {item?.Location ? String(item.Location) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.force)}
                    >
                      {item?.Force ? String(item.Force) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.mission)}
                    >
                      {item?.Mission ? String(item.Mission) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.note)}
                    >
                      {item?.Note ? String(item.Note) : ""}
                    </td>
                    <td
                      className={cn(
                        styles.contentEditAndDelete,
                        styles.itemTable
                      )}
                    >
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor={Text.CRUD.backgroundDeleteModal}
                          description={Text.CRUD.deleteConfirm}
                          alertBtn={false}
                          deleteBtn={true}
                          handleDeleteFollowTheText={_handleDeleteFollowTheText}
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
        {/* {mainData.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )} */}
        {totalPage > 1 && <div className={cn(styles.pagination)}>
          <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
        </div>  }
      </div>
    </div>
  );
}

export default memo(TableComponent);
