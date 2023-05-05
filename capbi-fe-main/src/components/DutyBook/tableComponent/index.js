import EmptyData from "@/NewComponents/emptyData";
import LoadingTable from "@/NewComponents/loadingTable";
import Modal from "@/NewComponents/newModal";
import BaseAxios from "@/store/setUpAxios";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ToastContainer } from "react-toastify";
import ModalConfirm from "../../../NewComponents/modalConfirm";
import { ErrorMessages, SuccessMessages, Text, apiServer } from "../../../constant";
import { notifyError, notifySuccess } from "../../../notify";
import PaginatedItems from "../../pagination/index";
import ContentModal from "../contentModal";
import {
  _deleteDutyServices,
  _getListDutyServices
} from "../services";
import styles from "./index.module.css";

function TableComponent() {
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [dataStatusBook, setDataStatusBook] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [paginate, setPaginate] = useState(1);
  const [paginateSearch, setPaginateSearch] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPageSearch, setTotalPageSearch] = useState(0);
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const [id, setId] = useState("");
  const [absenceNoReason, setAbsenceNoReason] = useState("");
  const [fieldSearch, setFieldSearch] = useState("");
  const [keySearch, setKeySearch] = useState("");
  const [form, setForm] = useState({
    date: new Date().toJSON().slice(0, 10),
    hourOnDuty: "",
    fullName: "",
    total: "",
    present: "",
    excusedAbsence: "",
    absenceNoReason: "",
    contentOfShift: "",
    informationOfShift: "",
    directiveInformation: "",
    fullnameHandover: "",
    fullnameReceiver: "",
    leadShift: "",
  });
  const [searchLoading, setSearchLoading] = useState(true);
  const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);
  useEffect(() => {
    if (searchValue === "") {
      if (noPreventCallApiAgain) {
        BaseAxios({
          method: "POST",
          url: apiServer.shift.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setDataStatusBook(trackers?.data?.data.list_data);
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

  const handleShowModal = (e) => {
    setDesc(Text.CRUD.add);
    setOpenAdd(true);
    setReadOnly(false);
    setIsUpdateSuccess(false);
    setForm({
      ...form,
      hourOnDuty: "",
      fullName: "",
      total: "",
      present: "",
      excusedAbsence: "",
      absenceNoReason: "",
      contentOfShift: "",
      informationOfShift: "",
      directiveInformation: "",
      fullnameHandover: "",
      fullnameReceiver: "",
      leadShift: "",
    });
    setAbsenceNoReason("");
  };

  useEffect(() => {
    _getListDutyBook();
  }, []);

  useEffect(() => {
    _getListDutyBook();
  }, [form.date]);

  useEffect(() => {
    if (mainData) {
      setLoading(false);
    }
  }, [mainData]);

  useEffect(() => {
    if (!keySearch) {
      _getListDutyBook();
    }
  }, [keySearch]);

  useEffect(() => {
    if (isUpdatedSuccess) {
      _getListDutyBook();
    }
  }, [isUpdatedSuccess]);

  useEffect(() => {
    _getListDutyBook();
    
  }, [paginate, paginateSearch]);

  const _getListDutyBook = async () => {
    try {
      const res = await _getListDutyServices(paginate, {});
      if (res && res.status === Text.statusTrue) {
        setMainData(res.data.data.list_data);
        setTotalPage(res.data.data.totalPage);
        setLoading(false);
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
      hourOnDuty: data.HourOnDuty,
      fullName: data.FullName,
      total: data.Total,
      present: data.Present,
      excusedAbsence: data.ExcusedAbsence,
      absenceNoReason: data.AbsenceNoReason,
      contentOfShift: data.ContentOfShift,
      informationOfShift: data.InformationOfShift,
      directiveInformation: data.DirectiveInformation,
      fullnameHandover: data.FullNameHandover,
      fullnameReceiver: data.FullNameReceiver,
      leadShift: data.LeadShift,
    });
    setId(data.Id);
    setAbsenceNoReason(
      data.AbsenceNoReason === null ? 0 : data.AbsenceNoReason
    );
  };

  const handleClose = () => {
    setOpenAdd(false);
  };

  // search
  // const handleSearch = async () => {
  //   try {
  //     const res = await _searchDutyServices(paginate, {
  //       search: keySearch,
  //     });
  //     if (keySearch) {
  //       if (res && res.status === Text.statusTrue) {
  //         setMainData(res.data.data.list_data);
  //       }
  //     }
  //   } catch (error) {
  //     alert(ErrorMessages.search.noMatchingResults);
  //   }
  // };
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

  // end search
  const callApiSearch = () => {
    const myObject = {};
    myObject[fieldSearch] = searchValue;
    BaseAxios({
      url: `api/shift/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        setDataStatusBook(trackers?.data?.data?.list_data);
        setTotalPageSearch(trackers?.data?.data?.totalPage);
        setPaginate(1);
        setTotalPage(0);
      })
      .catch((err) => {
        setDataStatusBook([]);
        setTotalPage(0);
        setTotalPageSearch(0);
      });
  };

  const handleOpenModalDelete = (id) => {
    setConfirmDelete(true);
    setIsUpdateSuccess(false);
    setId(id);
  };

  // const handleSearchKeyPress = (e) => {
  //   if (e.keyCode === Text.keyEnter) {
  //     handleSearch();
  //   }
  // };
  const handleSearchKeyPress = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const _handleDeleteDuty = async () => {
    try {
      const res = await _deleteDutyServices(id);
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
      url: "api/shift/exports",
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
            setAbsenceNoReason={setAbsenceNoReason}
            absenceNoReason={absenceNoReason}
            readOnly={readOnly}
            setReadOnly={setReadOnly}
          />
        </Modal>
      )}
      <div className={cn(styles.content)}>
        {/* title */}
        <div
          style={{ textAlign: "center" }}
          className={cn(styles.contentHeader)}
        >
          <h2> Sổ trực ban</h2>
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
                <option value="hourOnDuty">Giờ trực</option>
                <option value="fullName">
                  Trực lãnh đạo, chỉ huy. Trực ban
                </option>
                <option value="total">
                  Quân số thường trực chiến đấu(Tổng số)
                </option>
                <option value="present">
                  Quân số thường trực chiến đấu(Có mặt)
                </option>
                <option value="excusedAbsence">
                  Quân số thường trực chiến đấu(Vắng có lý)
                </option>
                <option value="absenceNoReason">
                  Quân số thường trực chiến đấu(Vắng không lý do)
                </option>
                <option value="contentOfShift">Nội dung ca trực</option>
                <option value="informationOfShift">
                  Xử lý thông tin, tài liệu, vụ việc của lãnh đạo, chỉ huy
                </option>
                <option value="directiveInformation">
                  Chỉ đạo xử lý thông tin, tài liệu, vụ việc của lãnh đạo, chỉ
                  huy
                </option>
                <option value="fullnameHandover">
                  Cán bộ bàn giao (Ký, ghi rõ họ tên)
                </option>
                <option value="fullnameReceiver">
                  Cán bộ nhận (Ký, ghi rõ họ tên)
                </option>
                <option value="leadShift">
                  Chỉ huy ca trực (Ký, ghi rõ họ tên)
                </option>
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
                <th rowSpan={3} className={cn(styles.hourDuty)}>
                  {"Giờ trực"}
                </th>
                <th rowSpan={3} className={cn(styles.headerTitle, styles.duty, styles.fullName)}>
                  Trực lãnh đạo, chỉ huy. Trực ban
                </th>
                <th
                  colSpan={4}
                  className={cn(styles.headerTitle, styles.large, styles.totalGenal)}
                >
                  {"Quân số thường trực chiến đấu"}
                </th>
                <th
                  rowSpan={3}
                  className={cn(styles.headerTitle, styles.contentShift)}
                >
                  Nội dung ca trực <br /> (Tiếp nhận đầy đủ tình hình, tài liệu, hồ sơ, phương tiện, thiết bị, tài sản của ca trực trước bàn giao và thu nhận thông tin, tài liệu, vụ việc... có trong ca trực)
                </th>
                <th
                  rowSpan={3}
                  className={cn(styles.headerTitle, styles.contentOfShift)}
                >
                  {"Xử lý thông tin, tài liệu, vụ việc của lãnh đạo, chỉ huy"}
                </th>
                <th
                  rowSpan={3}
                  className={cn(
                    styles.headerTitle,
                    styles.contentOfShift
                  )}
                >
                  {
                    "Chỉ đạo xử lý thông tin, tài liệu, vụ việc của lãnh đạo, chỉ huy"
                  }
                </th>
                <th
                  rowSpan={3}
                  className={cn(styles.headerTitle, styles.medium)}
                >
                  Cán bộ bàn giao <br /> (Ký, ghi rõ họ tên)
                </th>
                <th
                  rowSpan={3}
                  className={cn(styles.headerTitle, styles.medium)}
                >
                  Cán bộ nhận <br /> (Ký, ghi rõ họ tên)
                </th>
                <th
                  rowSpan={3}
                  className={cn(styles.headerTitle, styles.medium)}
                >
                  Chỉ huy ca trực <br /> (Ký, ghi rõ họ tên)
                </th>
                <th
                  rowSpan={3}
                  className={cn(styles.contentEditAndDelete, styles.itemTable)}
                ></th>
              </tr>
              <tr>
                <th
                  rowSpan={2}
                  className={cn(styles.headerTitle, styles.totalChil)}
                >
                  {"Tổng số"}
                </th>
                <th
                  rowSpan={2}
                  className={cn(styles.headerTitle, styles.present)}
                >
                  {"Có mặt"}
                </th>
                <th colSpan={2}>{"Vắng"}</th>
              </tr>
              <tr>
                <th className={cn(styles.headerTitle, styles.notReason)}>
                  {"Có lý do"}
                </th>
                <th className={cn(styles.headerTitle, styles.notReason)}>
                  {"Không lý do"}
                </th>
              </tr>
            </thead>
            {dataStatusBook.length > 0 && (
              <tbody>
                {dataStatusBook.map((item, index) => (
                  <tr key={index}>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.contentHourDuty)}
                    >
                      {item.HourOnDuty}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentFullName)}
                    >
                      {item.FullName}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.notReason)}
                    >
                      {item.Total}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.notReason)}
                    >
                      {item.Present}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.notReason)}
                    >
                      {item.ExcusedAbsence}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.notReason)}
                    >
                      {item.AbsenceNoReason}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentShift)}
                    >
                      {item.ContentOfShift}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentOfShift)}
                    >
                      {item.InformationOfShift}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.contentOfShift)}
                    >
                      {item.DirectiveInformation}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.medium)}
                    >
                      {item.FullNameHandover}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.medium)}
                    >
                      {item.FullNameReceiver}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable, styles.medium)}
                    >
                      {item.LeadShift}
                    </td>
                    <td
                      className={cn(
                        styles.contentEditAndDelete,
                        styles.itemTable
                      )}
                    >
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={_handleDeleteDuty}
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
            {dataStatusBook.length === 0 && !loading && <EmptyData colSpan={17} />}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={17} className={cn(styles.loadingArea)}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {dataStatusBook.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {dataStatusBook.length > 0 && totalPageSearch > 1 && (
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

export default memo(TableComponent);
