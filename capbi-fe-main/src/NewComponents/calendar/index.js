import React, { useState, useEffect, memo } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsCloudDownload } from "react-icons/bs";
import cn from "classnames";
import styles from "./index.module.css";
import Modal from "../newModal";
import BaseAxios from "@/store/setUpAxios";
import PaginatedItems from "../../components/pagination";
import { apiServer, SuccessMessages, ErrorMessages } from "../../constant";
import formatDate from "@/formatTime";
import { useDispatch } from "react-redux";
import { getDataCalendar } from "@/store/vehicleCalendar";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";

import { notifySuccess, notifyError } from "../../notify";
import { ToastContainer } from "react-toastify";
import ContentModalCalendar from "./contentModalCalendar";
import TextHandle from "../calendar/Text";
import TextCalendar from "../calendar/Text";
let idDelete;

function Calendar() {
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [dataCalendar, setDataCalendar] = useState([]);
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
          url: apiServer.calendar.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setDataCalendar(trackers?.data?.data.list_data);
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
      url: apiServer.calendar.delete + id,
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
    dispatch(getDataCalendar(data));
    setOpenAdd(true);
  };
  const handleClose = () => {
    const resetData = {
      Id: "",
      Date: "",
      Location: "",
      Force: "",
      Mission: "",
      Note: "",
    };
    setOpenAdd(false);
    dispatch(getDataCalendar(resetData));
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
      url: `api/calendar/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        setDataCalendar(trackers?.data?.data?.list_data);
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
          <ContentModalCalendar
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            dataCalendar={dataCalendar}
            addEvent={addEvent}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
          />
        </Modal>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>Sổ lịch bảo vệ các sự kiện</h2>
          {/* <div className={cn(styles.searchAndAdd)}>
            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={TextHandle.search}
                onKeyDown={(e) => handleSearchKeyPress(e)}
              />
              <BiSearchAlt2
                onClick={handleSearch}
                className={cn(styles.searchicon)}
              />
            </div>
            <div className={cn(styles.addnew)}>
              <button onClick={handleShowModal}>{TextHandle.plus}</button>
            </div>
          </div> */}
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

            {/* <button
              className={cn(styles.btnExportFile)}
              onClick={handleExportInformation}
            >
              Xuất file
            </button>
            <div className={cn(styles.startExportDate)}>
              <span>Ngày Bắt Đầu:</span>
              <input
                value={startExport}
                onChange={(e) => setStartExport(e.target.value)}
                className={cn(styles.inputDateExport)}
                type="date"
              />
            </div>
            <div className={cn(styles.endExportDate)}>
              <span>Ngày Kết Thúc:</span>
              <input
                value={endExport}
                onChange={(e) => setEndExport(e.target.value)}
                className={cn(styles.inputDateExport)}
                type="date"
              />
            </div> */}
          </div>
          {/* <div className={cn(styles.search)}>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={TextHandle.search}
              onKeyDown={(e) => handleSearchKeyPress(e)}
            />
            <BiSearchAlt2
              onClick={handleSearch}
              className={cn(styles.searchicon)}
            />
          </div>
          <div className={cn(styles.addnew)}>
            <button onClick={handleShowModal}>{TextHandle.plus}</button>
          </div>
        </div> */}
          <div className={cn(styles.groupBtnRight)}>
            <select
              className={cn(styles.inputField)}
              value={fieldSearch}
              onChange={(e) => setFieldSearch(e.target.value)}
            >
              <option>--Chọn giá trị--</option>
              <option value="date">Ngày tháng </option>
              <option value="location">Địa điểm</option>
              <option value="force">Lực lượng</option>
              <option value="mission">Nhiệm vụ</option>
              <option value="note">Ghi chú</option>
            </select>
            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={TextCalendar.search}
                onKeyDown={(e) => handleSearchKeyPress(e)}
              />
              <BiSearchAlt2
                onClick={handleSearch}
                className={cn(styles.searchIcon)}
              />
            </div>
            <div className={cn(styles.addnew)}>
              <button onClick={handleShowModal}>{TextCalendar.plus}</button>
            </div>
          </div>
        </div>

        <div className={cn(styles.contentbody)}>
          <table className={cn(styles.tableContent)} cellSpacing="0">
            <thead>
              <tr>
                <th className={cn(styles.stt)}>Stt</th>
                <th className={cn(styles.seaOfControl)}>Ngày tháng</th>
                <th className={cn(styles.dateOfViolation)}>Địa điểm</th>

                <th className={cn(styles.LocationOfViolation)}>Lực lượng</th>

                <th className={cn(styles.errorViolation)}>Nhiệm vụ</th>
                <th className={cn(styles.violatorName)}>Ghi chú</th>

                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {dataCalendar.length > 0 && (
              <tbody>
                {dataCalendar.map((data, index) => (
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
                      {data?.Date ? String(data.Date) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentDateOfViolation)}
                    >
                      {data?.Location ? String(data.Location) : ""}
                    </td>

                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentErrorViolation)}
                    >
                      {data?.Force ? String(data.Force) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentViolatorName)}
                    >
                      {data?.Mission ? String(data.Mission) : ""}
                    </td>

                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentViolatorName)}
                    >
                      {data?.Note ? String(data.Note) : ""}
                    </td>

                    <td className={cn(styles.contentEditAndDelete)}>
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor="var(--shadow-color)"
                          description={TextCalendar.CRUD.deleteConfirm}
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
            {dataCalendar.length === 0 && !loading && (
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
        {dataCalendar.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {dataCalendar.length > 0 && totalPageSearch > 1 && (
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

export default memo(Calendar);
