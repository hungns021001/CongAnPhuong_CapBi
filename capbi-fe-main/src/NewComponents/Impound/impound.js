import React, { useState, useEffect, memo } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import cn from "classnames";
import styles from "./index.module.css";
import ImpoundModal from "../Impound/impoundModal";
import Modal from "../newimpoundModal";
import BaseAxios from "@/store/setUpAxios";
import PaginatedItems from "../../components/pagination";
import {
  Text,
  apiServer,
  SuccessMessages,
  ErrorMessages,
} from "../../constant";
import formatDate from "@/formatTime";
import { useDispatch } from "react-redux";
import { getData } from "@/store/vehicleImpound";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import { notifySuccess, notifyError } from "../../notify";
import { ToastContainer } from "react-toastify";
import { BsCloudDownload } from "react-icons/bs";

let idDelete;

function ImpoundBook() {
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
          url: apiServer.impound.get,
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
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain]);

  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.impound.delete + id,
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
      ReturnDate: "",
      LicensePlates: "",
      DateOfViolation: "",
      FullName: "",
      OnHold: "",
      Returned: "",
      OfficerReturns: "",
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
      url: `api/impound/show`,
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
      startDate: startExport,
      endDate: endExport,
    };
    BaseAxios({
      url: "api/impound/exports",
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
          <ImpoundModal
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
          <h2>{"Sổ theo dõi tạm giữ xử lý phương tiện"}</h2>
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
                <option>{Text.chooseValue}</option>
                <option value="returnDate">{"Ngày Trả"}</option>
                <option value="licensePlates">{"Biển Kiểm Soát"}</option>
                <option value="dateOfViolation">{"Ngày Vi Phạm"}</option>
                <option value="fullname">{"Tên Người Vi Phạm"}</option>
                <option value="onHold">{"Đã Tạm Giữ"}</option>
                <option value="returned">{"Đã Trả Lại"}</option>
                <option value="officerReturns">{"Cán Bộ Trả"}</option>
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
            <div className={cn(styles.addnew)}>
              <button onClick={handleShowModal}>{Text.plus}</button>
            </div>
          </div>
        </div>
        <div className={cn(styles.contentbody)}>
          <table className={cn(styles.tableContent)} cellSpacing="0">
            <thead>
              <tr>
                <th className={cn(styles.stt)}>{Text.impoundbook.stt}</th>
                <th className={cn(styles.returnDate)}>{Text.impoundbook.returnDate}</th>
                <th className={cn(styles.licensePlates)}>{Text.impoundbook.licensePlates}</th>
                <th className={cn(styles.dateOfViolation)}>{Text.impoundbook.dateOfViolation}</th>
                <th className={cn(styles.fullname)}>{Text.impoundbook.fullname}</th>
                <th className={cn(styles.onHold)}>{Text.impoundbook.onHold}</th>
                <th className={cn(styles.returned)}>{Text.impoundbook.returned}</th>
                <th className={cn(styles.officerReturns)}>{Text.impoundbook.officerReturns}</th>
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
                      className={cn(styles.contentReturnDate)}
                    >
                      {data?.ReturnDate
                        ? formatDate(String(data.ReturnDate))
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentLicensePlates)}
                    >
                      {data?.LicensePlates ? String(data.LicensePlates) : ""}
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
                      className={cn(styles.contentFullName)}
                    >
                      {data?.FullName ? String(data.FullName) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentOnHold)}
                    >
                      {data?.OnHold ? String(data.OnHold) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentReturned)}
                    >
                      {data?.Returned ? String(data.Returned) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentOfficerReturns)}
                    >
                      {data?.OfficerReturns ? String(data.OfficerReturns) : ""}
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
            {mainData.length === 0 && !loading && <EmptyData colSpan={9} />}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={9} className={cn(styles.loadingArea)}>
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

export default memo(ImpoundBook);
