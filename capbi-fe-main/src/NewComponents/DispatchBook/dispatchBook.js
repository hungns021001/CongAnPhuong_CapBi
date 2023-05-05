import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getData } from "@/store/vehicleDispatch";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import PaginatedItems from "../../components/pagination";
import {
  ErrorMessages,
  SuccessMessages,
  Text,
  apiServer,
} from "../../constant";
import { notifyError, notifySuccess } from "../../notify";
import DispatchModal from "../DispatchBook/dispatchModal";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import Modal from "../newModalDispatch";
import styles from "./index.module.css";
let idDelete;

function DispatchBook() {
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
  const [alertModal, setAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [addEvent, setAddEvent] = useState(false);
  const dispatch = useDispatch();
  const [searchLoading, setSearchLoading] = useState(true);
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const handleShowModal = (e) => {
    setAddEvent(true);
    setDesc("Thêm");
    setOpenAdd(true);
  };
  const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);

  useEffect(() => {
    if (searchValue === "") {
      if (noPreventCallApiAgain) {
        BaseAxios({
          method: "POST",
          url: apiServer.dispatch.get,
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
            console.log(err);
          });
      }
    } else {
      callApiSearch();
    }
    setSearchLoading(true)
    setNoPreventCallApiAgain(true);
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain, searchLoading]);

  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.dispatch.delete + id,
      data: params,
    })
      .then(() => {
        toggleIsUpdateSuccess();
        setConfirmDelete(false);
        notifySuccess(SuccessMessages.delete);
      })
      .catch(() => {
        setConfirmDelete(false);
        notifySuccess(ErrorMessages.delete);
      });
  };

  const handleEdit = (data) => {
    setDesc("Sửa");
    dispatch(getData(data));
    setOpenAdd(true);
  };

  const handleClose = () => {
    const resetData = {
      Id: "",
      Datetime: "",
      DispatchID: "",
      ReleaseDate: "",
      Subject: "",
      AgencyIssued: "",
      Receiver: "",
    };
    setOpenAdd(false);
    dispatch(getData(resetData));
    setAddEvent(false);
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
      url: `api/dispatch/show`,
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

  const handleOpenModalDelete = (id) => {
    setConfirmDelete(true);
    idDelete = id;
  };

  const handleSearchKeyPress = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const handleExportInformation = () => {
    const timeExport = {
      startDate: startExport,
      endDate: endExport,
    };
    BaseAxios({
      url: "api/dispatch/exports",
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
        notifyError("Có lỗi xảy ra,vui lòng thử lại");
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
          <DispatchModal
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            addEvent={addEvent}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
          />
        </Modal>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>{"Sổ theo dõi công văn đến"}</h2>
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
                <option>Chọn giá trị</option>
                <option className={cn(styles.option)} value="dateTime">
                  Ngày tháng năm
                </option>
                <option value="dispatchId">Số công văn</option>
                <option value="releaseDate">{"Ngày tháng ban hành"}</option>
                <option value="subject">{"Trích yếu"}</option>
                <option value="agencyIssued">{"Cơ quan ban hành"}</option>
                <option value="receiver">{"Người nhận"}</option>
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
                <th className={cn(styles.sentDay)}>{"Ngày tháng năm"}</th>
                <th className={cn(styles.sentOfIssue)}>{"Số công văn"}</th>
                <th className={cn(styles.sentDay)}>{"Ngày tháng ban hành"}</th>
                <th className={cn(styles.receiver)}>{"Trích yếu"}</th>
                <th className={cn(styles.agencyIssued)}>{"Cơ quan ban hành"}</th>
                <th className={cn(styles.receiver)}>{"Người nhận"}</th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {mainData.length > 0 &&
              (console.log(mainData),
                (
                  <tbody>
                    {mainData.map((data, index) => (
                      <tr key={index}>
                        {totalPage > 0 && (
                          <td
                            onClick={() => handleEdit(data)}
                            className={cn(styles.contentStt)}
                          >
                            {paginate === 1
                              ? index + 1
                              : index + 1 + 10 * (paginate - 1)}
                          </td>
                        )}
                        {totalPageSearch > 0 && (
                          <td
                            onClick={() => handleEdit(data)}
                            className={cn(styles.contentStt)}
                          >
                            {paginateSearch === 1
                              ? index + 1
                              : index + 1 + 10 * (paginateSearch - 1)}
                          </td>
                        )}
                        <td
                          onClick={() => handleEdit(data)}
                          className={cn(styles.contentDatetime)}
                        >
                          {data?.Datetime
                            ? formatDate(String(data.Datetime))
                            : ""}
                        </td>
                        <td
                          onClick={() => handleEdit(data)}
                          className={cn(styles.contentDispatchID)}
                        >
                          {data?.DispatchID ? String(data.DispatchID) : ""}
                        </td>
                        <td
                          onClick={() => handleEdit(data)}
                          className={cn(styles.contentReleaseDate)}
                        >
                          {data?.ReleaseDate
                            ? formatDate(String(data.ReleaseDate))
                            : ""}
                        </td>
                        <td
                          onClick={() => handleEdit(data)}
                          className={cn(styles.contentSubject)}
                        >
                          {data?.Subject ? String(data.Subject) : ""}
                        </td>
                        <td
                          onClick={() => handleEdit(data)}
                          className={cn(styles.contentAgencyIssued)}
                        >
                          {data?.AgencyIssued ? String(data.AgencyIssued) : ""}
                        </td>
                        <td
                          onClick={() => handleEdit(data)}
                          className={cn(styles.contentReceiver)}
                        >
                          {data?.Receiver ? String(data.Receiver) : ""}
                        </td>
                        <td className={cn(styles.contentEditAndDelete)}>
                          {confirmDelete && (
                            <ModalConfirm
                              submitDelete={() => handleDeleteClick(idDelete)}
                              backgroundColor={Text.CRUD.backgroundDeleteModal}
                              description={Text.CRUD.deleteConfirm}
                              alertBtn={false}
                              deleteBtn={true}
                              closeModal={() => setConfirmDelete(false)}
                            />
                          )}
                          <AiOutlineDelete
                            className={cn(styles.delete)}
                            onClick={() => handleOpenModalDelete(data.Id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
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
        {mainData.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {mainData.length > 0 && totalPageSearch > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems
              setPaginate={setPaginateSearch}
              totalPage={totalPageSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(DispatchBook);
