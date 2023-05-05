import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getData } from "@/store/vehicleResident";
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
import ResidentModal from "../Resident/residentModal";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import ModalResident from "../newModalResident";
import styles from "./index.module.css";

let idDelete;

function ResidentBook() {
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
          url: apiServer.resident.get,
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
    setNoPreventCallApiAgain(true);
    setSearchLoading(true);
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain, searchLoading]);

  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.resident.delete + id,
      data: params,
    })
      .then((res) => {
        console.log(res);
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
      Date: "",
      Address: "",
      Host: "",
      FullName: "",
      CitizenNumber: "",
      Violationer: "",
      FormProcessing: "",
      PoliceCheck: "",
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
      url: `api/resident/show`,
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
        setTotalPageSearch(0);
        setTotalPage(0);
      });
  };

  const handleOpenModalDelete = (Id) => {
    setConfirmDelete(true);
    idDelete = Id;
  };

  const handleSearchKeyPress = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };
  const handleExportInformation = () => {
    const timeExport = {
      start: formatDate(String(startExport)),
      end: formatDate(String(endExport)),
    };
    console.log(timeExport);
    setStartExport("");
    setEndExport("");
  };

  return (
    <div className={cn(styles.wrapper)}>
      <ToastContainer />
      {openAdd && (
        <ModalResident handleCloseModal={handleClose}>
          <ResidentModal
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            addEvent={addEvent}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
          />
        </ModalResident>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>{"Sổ Theo Dõi Kiểm Tra Cư Trú"}</h2>
        </div>
        <div className={cn(styles.searchAndAddMobile)}>
          <div className={cn(styles.groupBtnLeft)}>
            <div className={cn(styles.export)}>
              {/* <span>
                {TextTheDay.exportFile}
                {TextTheDay.colon}
              </span> */}
              <div
                className={cn(styles.addNew)}
                onClick={handleExportInformation}
              >
                <BsCloudDownload className={cn(styles.iconExport)} />
              </div>
            </div>
            {/* <button className={cn(styles.btnExportFile)} onClick={handleExportInformation}>Xuất file</button>
                        <div className={cn(styles.startExportDate)}>
                            <span>Ngày Bắt Đầu:</span>
                            <input value={startExport} onChange={(e) => setStartExport(e.target.value)} className={cn(styles.inputDateExport)} type="date" />
                        </div>
                        <div className={cn(styles.endExportDate)}>
                            <span>Ngày Kết Thúc:</span>
                            <input value={endExport} onChange={(e) => setEndExport(e.target.value)} className={cn(styles.inputDateExport)} type="date" />
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
                <option value="date">{"Ngày Tháng Năm Kiểm Tra"}</option>
                <option value="address">{"Địa Chỉ Kiểm Tra"}</option>
                <option value="host">{"Chủ Nhà Trọ/ Chủ Hộ"}</option>
                <option value="fullName">{"Họ Tên Người Được Kiểm Tra"}</option>
                <option value="citizenNumber">{"Số CCCD"}</option>
                <option value="violationer">{"Người Vi Phạm"}</option>
                <option value="formProcessing">{"Hinh Thức Xử Lý"}</option>
                <option value="policeCheck">{"CSKV Kiểm Tra"}</option>
              </select>
            </div>
            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={"Tìm kiếm"}
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
                <th className={cn(styles.stt)}>{Text.residentbook.stt}</th>
                <th className={cn(styles.date)}>{"Ngày Tháng Năm Kiểm Tra"}</th>
                <th className={cn(styles.address)}>{"Địa Chỉ Kiểm Tra"}</th>
                <th className={cn(styles.host)}>
                  {"Chủ Nhà Trọ/ Chủ Hộ"}
                </th>
                <th className={cn(styles.fullName)}>
                  {"Họ Tên Người Được Kiểm Tra"}
                </th>
                <th className={cn(styles.citizenNumber)}>{"Số CCCD"}</th>
                <th className={cn(styles.violationer)}>{"Người Vi Phạm"}</th>
                <th className={cn(styles.formProcessing)}>{"Hinh Thức Xử Lý"}</th>
                <th className={cn(styles.policeCheck)}>{"CSKV Kiểm Tra"}</th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {mainData.length > 0 && (
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
                      className={cn(styles.contentDate)}
                    >
                      {data?.Date ? formatDate(String(data.Date)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentAddress)}
                    >
                      {data?.Address ? String(data.Address) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentHost)}
                    >
                      {data?.Host ? formatDate(String(data.Host)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentFullName)}
                    >
                      {data?.FullName ? formatDate(String(data.FullName)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentCitizenNumber)}
                    >
                      {data?.CitizenNumber ? String(data.CitizenNumber) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentViolationer)}
                    >
                      {data?.Violationer ? String(data.Violationer) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentFormProcessing)}
                    >
                      {data?.FormProcessing ? String(data.FormProcessing) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentPoliceCheck)}
                    >
                      {data?.PoliceCheck ? String(data.PoliceCheck) : ""}
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
            {mainData.length === 0 && !loading && <EmptyData colSpan={10} />}
            {loading && (
              <tbody>
                <tr>
                  <td
                    style={{ textAlign: "center" }}
                    colSpan={10}
                    className={cn(styles.loadingArea)}
                  >
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

export default memo(ResidentBook);
