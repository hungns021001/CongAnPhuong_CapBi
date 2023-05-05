import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getData } from "@/store/vehicleTraffic";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
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
import TrafficModal from "../Traffic/trafficModal";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import Modal from "../newModalTraffic";
import styles from "./index.module.css";
import TextTraffic from "./textTraffic";
let idDelete;

function TrafficBook() {
  const [fieldSearch, setFieldSearch] = useState("");
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [dataTrafficLock, setDataTrafficLock] = useState([]);
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
          url: apiServer.trafficLock.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setDataTrafficLock(trackers?.data?.data.list_data);
            setLoading(false);
            setTotalPage(trackers?.data?.data?.totalPage);
            setPaginateSearch(1);
            setTotalPageSearch(0);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    } else {
      callApiSearch();
    }
    setNoPreventCallApiAgain(true);
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain]);
  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.trafficLock.delete + id,
      data: params,
    })
      .then((res) => {
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
      Days: "",
      Date: "",
      TrafficIntersection: "",
      Morning: "",
      Afternoon: "",
      Note: "",
    };
    setOpenAdd(false);
    dispatch(getData(resetData));
    setAddEvent(false);
  };
  const handleSearchKeyPress = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
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
      url: `api/trafficLock/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        console.log("call api traffict search:", trackers);
        setDataTrafficLock(trackers?.data?.data?.list_data);
        setTotalPageSearch(trackers?.data?.data?.totalPage);
        setPaginate(1);
        setTotalPage(0);
      })
      .catch((err) => {
        // alert(ErrorMessages.search.noMatchingResults);
        console.log(" err call api traffict search:", err);
      });
  };
  const handleOpenModalDelete = (id) => {
    setConfirmDelete(true);
    idDelete = id;
  };
  const handleExportInformation = () => {
    BaseAxios({
      url: "api/trafficLock/exports",
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
        notifySuccess(TextTraffic.notify.notifySuccess);
      })
      .catch(() => {
        notifyError(TextTraffic.notify.notifyError);
      });
    setStartExport("");
    setEndExport("");
  };
  return (
    <div className={cn(styles.wrapper)}>
      <ToastContainer />
      {openAdd && (
        <Modal handleCloseModal={handleClose}>
          <TrafficModal
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
          <h2>{TextTraffic.title.Traffic}</h2>
        </div>
        <div className={cn(styles.searchAndAddMobile)}>
          <div className={cn(styles.groupBtnLeft)}>
            <div className={cn(styles.export)}>
              {/* <span>
                {TextTraffic.exportFile}
                {TextTraffic.colon}
              </span> */}
              <div
                className={cn(styles.addNew)}
                onClick={handleExportInformation}
              >
                <BsCloudDownload className={cn(styles.iconExport)} />
              </div>
            </div>
          </div>
          <div className={cn(styles.groupBtnRight)}>
            <div className={cn(styles.selectBtn)}>
              <select
                className={cn(styles.inputField)}
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
              >
                <option>{TextTraffic.defaultOption}</option>
                <option value="days">{TextTraffic.Traffic.Days}</option>
                <option value="date">{TextTraffic.Traffic.Date}</option>
                <option value="trafficIntersection">
                  {TextTraffic.Traffic.TrafficIntersection}
                </option>
                <option value="morning">{TextTraffic.Traffic.Morning}</option>
                <option value="afternoon">
                  {TextTraffic.Traffic.Afternoon}
                </option>
                <option value="note">{TextTraffic.Traffic.Note}</option>
              </select>
            </div>

            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={Text.search}
                onKeyDown={(e) => handleSearchKeyPress(e)}
              />
              <BiSearchAlt2
                onClick={handleSearch}
                className={cn(styles.searchIcon)}
              />
            </div>
            <div className={cn(styles.addNew)}>
              <button onClick={handleShowModal}>{Text.plus}</button>
            </div>
          </div>
        </div>
        <div className={cn(styles.contentBody)}>
          <table className={cn(styles.tableContent)} cellSpacing="0">
            <thead>
              <tr>
                <th className={cn(styles.stt)}>
                  {TextTraffic.Traffic.Stt}
                </th>
                <th className={cn(styles.days)}>{TextTraffic.Traffic.Days}</th>
                <th className={cn(styles.trafficDate)}>
                  {TextTraffic.Traffic.Date}
                </th>
                <th className={cn(styles.trafficIntersection)}>
                  {TextTraffic.Traffic.TrafficIntersection}
                </th>
                <th className={cn(styles.morningTraffic)}>
                  {TextTraffic.Traffic.Morning}
                </th>
                <th className={cn(styles.afternoonTraffic)}>
                  {TextTraffic.Traffic.Afternoon}
                </th>
                <th className={cn(styles.note)}>{TextTraffic.Traffic.Note}</th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {dataTrafficLock.length > 0 && (
              <tbody>
                {dataTrafficLock.map((data, index) => (
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
                      className={cn(styles.days)}
                    >
                      {data?.Days ? formatDate(String(data.Days)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.trafficDate)}
                    >
                      {data?.Date ? formatDate(String(data.Date)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.trafficIntersection)}
                    >
                      {data?.TrafficIntersection &&
                      Array.isArray(data.TrafficIntersection)
                        ? data.TrafficIntersection.map((str, i) => (
                            <div key={i}>{str}</div>
                          ))
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.morningTraffic)}
                    >
                      <div className={cn(styles.traffic)}>
                        <div>
                          {data?.Morning && Array.isArray(data.Morning)
                            ? data.Morning.map((str, i) => (
                                <div key={i}>{str}</div>
                              ))
                            : ""}
                        </div>
                      </div>
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.afternoonTraffic)}
                    >
                      <div className={cn(styles.traffic)}>
                        <div>
                          {data?.Afternoon && Array.isArray(data.Afternoon)
                            ? data.Afternoon.map((str, i) => (
                                <div key={i}>{str}</div>
                              ))
                            : ""}
                        </div>
                      </div>
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.note)}
                    >
                      <div className={cn(styles.trafficNote)}>
                        {data?.Note ? String(data.Note) : ""}
                      </div>
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
            )}
            {dataTrafficLock.length === 0 && !loading && (
              <EmptyData colSpan={11} />
            )}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={11} className={cn(styles.loadingArea)}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {dataTrafficLock.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {dataTrafficLock.length > 0 && totalPageSearch > 1 && (
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

export default memo(TrafficBook);
