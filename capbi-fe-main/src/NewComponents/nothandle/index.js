import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getDataHandle } from "@/store/vehicleHandle";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { useDispatch } from "react-redux";
import PaginatedItems from "../../components/pagination";
import { ErrorMessages, SuccessMessages, apiServer } from "../../constant";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import Modal from "../newModal";
import styles from "./index.module.css";

import { IoIosCloseCircleOutline } from "react-icons/io";
import { ToastContainer } from "react-toastify";
import { notifyError, notifySuccess } from "../../notify";
import TextHandle from "../nothandle/Text";
import ContentModalNothandle from "./contentModalNothandle";
let idDelete;

function Nothandle() {
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [dataPassport, setDataPassport] = useState([]);
  const [paginate, setPaginate] = useState(1);
  const [paginateSearch, setPaginateSearch] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPageSearch, setTotalPageSearch] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
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
          url: apiServer.nothandle.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setDataPassport(trackers?.data?.data.list_data);
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
    setNoPreventCallApiAgain(true);
    setSearchLoading(true)
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain, searchLoading]);
  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.nothandle.delete + id,
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
    setDesc(TextHandle.CRUD.insert);
    dispatch(getDataHandle(data));
    setOpenAdd(true);
  };
  const handleClose = () => {
    const resetData = {
      Id: "",
      SeaOfControl: "",
      DateOfViolation: "",
      LocationOfViolation: "",
      ErrorViolation: "",
      ViolatorName: "",
      ApplicantName: "",
      CommandSettlement: "",
      OfficersReceiveStickers: "",
    };
    setOpenAdd(false);
    dispatch(getDataHandle(resetData));
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
      url: `api/nothandle/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        setDataPassport(trackers?.data?.data?.list_data);
        setTotalPageSearch(trackers?.data?.data?.totalPage);
        setPaginate(1);
        setTotalPage(0);
      })
      .catch(() => {
        setDataPassport([]);
        setTotalPageSearch(0);
        setTotalPage(0);
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
      url: "api/nothandle/exports",
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
          <ContentModalNothandle
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            dataPassport={dataPassport}
            addEvent={addEvent}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
          />
        </Modal>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>{"Sổ theo dõi không xử lý"}</h2>
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
                <option value="lisencePlate">Biển Kiểm soát</option>
                <option value="dateOfViolation">Ngày tháng năm vi phạm</option>
                <option value="locationViolation">Địa điểm vi phạm</option>
                <option value="violation">Lỗi vi phạm</option>
                <option value="nameViolator">Tên người vi phạm</option>
                <option value="nameBailsman">Tên người xin</option>
                <option value="solCommander">Chỉ huy giải quyết</option>
                <option value="staffReceive">Cán bộ nhận giấy dán</option>
              </select>
            </div>
            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={TextHandle.search}
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
              <button onClick={handleShowModal}>{TextHandle.plus}</button>
            </div>
          </div>
        </div>

        <div className={cn(styles.contentbody)}>
          <table className={cn(styles.tableContent)} cellSpacing="0">
            <thead>
              <tr>
                <th className={cn(styles.stt)}>STT</th>
                <th className={cn(styles.seaOfControl)}>
                  {TextHandle.nothandle.violation}
                </th>
                <th className={cn(styles.dateOfViolation)}>
                  {TextHandle.nothandle.dateOfViolation}
                </th>

                <th className={cn(styles.LocationOfViolation)}>
                  {TextHandle.nothandle.LocationOfViolation}
                </th>

                <th className={cn(styles.errorViolation)}>
                  {TextHandle.nothandle.errorViolation}
                </th>
                <th className={cn(styles.violatorName)}>
                  {TextHandle.nothandle.violatorName}
                </th>
                <th className={cn(styles.applicantName)}>
                  {TextHandle.nothandle.applicantName}
                </th>
                <th className={cn(styles.commandSettlement)}>
                  {TextHandle.nothandle.commandSettlement}
                </th>
                <th className={cn(styles.OfficersReceiveStickers)}>
                  {TextHandle.nothandle.OfficersReceiveStickers}
                </th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {dataPassport.length > 0 && (
              <tbody>
                {dataPassport.map((data, index) => (
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
                      className={cn(styles.contentSeaOfControl)}
                    >
                      {data?.LisencePlate ? String(data.LisencePlate) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentDateOfViolation)}
                    >
                      {data?.DateOfViolation
                        ? formatDate(String(data.DateOfViolation))
                        : ""}
                    </td>

                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentLocationOfViolation)}
                    >
                      {data?.LocationViolation
                        ? String(data.LocationViolation)
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentErrorViolation)}
                    >
                      {data?.Violation ? String(data.Violation) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentViolatorName)}
                    >
                      {data?.NameViolator ? String(data.NameViolator) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentApplicantName)}
                    >
                      {data?.NameBailsman ? String(data.NameBailsman) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentCommandSettlement)}
                    >
                      {data?.SolCommander ? String(data.SolCommander) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentLeaderSign)}
                    >
                      {data?.StaffReceive ? String(data.StaffReceive) : ""}
                    </td>
                    <td className={cn(styles.contentEditAndDelete)}>
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor="var(--shadow-color)"
                          description={TextHandle.CRUD.deleteConfirm}
                          alertBtn={false}
                          deleteBtn={true}
                          closeModal={() => setConfirmDelete(false)}
                          data={data}
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
            {dataPassport.length === 0 && !loading && (
              <EmptyData colSpan={10} />
            )}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={10} className={cn(styles.loadingArea)}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {dataPassport.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {dataPassport.length > 0 && totalPageSearch > 1 && (
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

export default memo(Nothandle);
