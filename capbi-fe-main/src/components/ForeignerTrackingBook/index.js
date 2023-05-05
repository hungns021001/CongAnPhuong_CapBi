import cn from "classnames";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

import BaseAxios from "@/store/setUpAxios";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import ModalConfirm from "../../NewComponents/modalConfirm";

import { SuccessMessages, Text, apiServer } from "../../constant";
import formatDate from "../../formatTime";
import { notifyError, notifySuccess } from "../../notify";

import { IoIosCloseCircleOutline } from "react-icons/io";
import ModalForeignerTracking from "../../NewComponents/newModalForeignerTracking";
import { getDataForeignerTrackingBookSlice } from "../../store/foreignerTrackingBook";
import PaginatedItems from "../pagination";
import ForeignerTrackingBookModal from "./modal";

let idDelete;
function ForeignerTrackingBook() {
  const [isShow, setIsShow] = useState(false);
  const [paginate, setPaginate] = useState(1);
  const [searchValue, setSeachValue] = useState("");
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const [mainData, setMainData] = useState([]);
  const dispatch = useDispatch();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [add, setAdd] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [totalPageSearch, setTotalPageSearch] = useState(0);
  const [paginateSearch, setPaginateSearch] = useState(1);
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [addEvent, setAddEvent] = useState(false);
  const [searchLoading, setSearchLoading] = useState(true);

  useEffect(() => {
    BaseAxios({
      method: "POST",
      url: apiServer.foreignerTracking.get,
      params: {
        page: paginate,
      },
    })
      .then((res) => {
        setMainData(res?.data?.data.list_data);
        setTotalPage(res?.data?.data?.totalPage);
        setIsShow(false);
        setPaginateSearch(1);
        setTotalPageSearch(0);
      })
      .catch((err) => {
        console.log("err get:", err);
      });
    setSearchLoading(true)
  }, [isUpdatedSuccess, paginate, searchLoading]);

  const searchHandler = () => {
    setPaginate(1);
    setPaginateSearch(1);
    if (searchValue.trim() === "") {
      toggleIsUpdateSuccess();
      setSeachValue("");
    } else {
      callApiSearch();
    }
  };

  const callApiSearch = () => {
    const myObject = {};
    myObject[fieldSearch] = searchValue;
    BaseAxios({
      url: `/api/immigrantRouter/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginate,
      },
    })
      .then((data) => {
        setMainData(data.data.data.list_data);
        setTotalPageSearch(trackers?.data?.data?.totalPage);
        setPaginate(1);
        setTotalPage(0);
      })
      .catch((err) => {
        setMainData([]);
        setTotalPageSearch(0);
        setTotalPage(0);
      });
  };

  const handleSearchKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchHandler();
    }
  };
  const handleClose = () => {
    setIsShow(false);
  };

  const handlerReset = () => {
    const resetData = {
      Id: "",
      RegisterDate: "",
      FullName: "",
      BirthDay: "",
      Country: "",
      ResidentialAddress: "",
      Passport: "",
      RecidencePermitNumber: "",
      Job: "",
      EntryDate: "",
      GateEntry: "",
      EntryPurpose: "",
      SojournDateFrom: "",
      SojournDateTo: "",
      GuarantorName: "",
      FullNamePolice: "",
      PoliceLead: "",
    };
    dispatch(getDataForeignerTrackingBookSlice(resetData));
  };

  const deleteHandler = (id) => {
    BaseAxios({
      method: "POST",
      url: apiServer.foreignerTracking.delete + id,
    })
      .then(() => {
        toggleIsUpdateSuccess();
        setConfirmDelete(false);
        notifySuccess(SuccessMessages.delete);
      })
      .catch(() => {
        setConfirmDelete(false);
        notifySuccess("Đã xảy ra lỗi vui lòng thử lại");
      });
  };

  const handleOpenModalDelete = (id) => {
    setConfirmDelete(true);
    idDelete = id;
  };

  const editHandler = (item) => {
    dispatch(getDataForeignerTrackingBookSlice(item));
    setIsShow(true);
  };
  const ExportInformationHandler = () => {
    const timeExport = {
      startDate: startExport,
      endDate: endExport,
    };
    BaseAxios({
      url: "/api/immigrantRouter/exports",
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
    <>
      <ToastContainer />
      {isShow && (
        <ModalForeignerTracking handleCloseModal={handleClose}>
          <ForeignerTrackingBookModal
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            setIsShow={setIsShow}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
            addEvent={add}
            setAdd={setAdd}
          />
        </ModalForeignerTracking>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.dashboard)}>
          <div className={cn(styles.titleContainer)}>
            <h2 className={cn(styles.title)}>Sổ Đăng Ký Người Nước Ngoài</h2>
          </div>
        </div>
        <div className={cn(styles.groupBtn)}>
          <div className={cn(styles.groupBtnLeft)}>
            <div
              className={cn(styles.addnew)}
              onClick={ExportInformationHandler}
            >
              <BsCloudDownload className={cn(styles.iconExport)} />
            </div>
          </div>
          <div className={cn(styles.groupBtnRight)}>
            <div className={cn(styles.selectbtn)}>
              <select
                className={cn(styles.searchInput)}
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
              >
                <option>{"Chọn giá trị"}</option>
                <option className={cn(styles.option)} value="RegisterDate">
                  {" "}
                  {Text.titleForeignerTrackingBook.registerDate}
                </option>
                <option value="FullName">
                  {Text.titleForeignerTrackingBook.fullName}
                </option>
                <option value="BirthDay">
                  {Text.titleForeignerTrackingBook.birthDay}
                </option>
                <option value="Country">
                  {Text.titleForeignerTrackingBook.country}
                </option>
                <option value="ResidentialAddress">
                  {Text.titleForeignerTrackingBook.residentialAddress}
                </option>
                <option value="Passport">
                  {Text.titleForeignerTrackingBook.passport}
                </option>
                <option value="RecidencePermitNumber">
                  {Text.titleForeignerTrackingBook.recidencePermitNumber}
                </option>
                <option value="Job">
                  {Text.titleForeignerTrackingBook.job}
                </option>
                <option value="EntryDate">
                  {Text.titleForeignerTrackingBook.entryDate}
                </option>
                <option value="GateEntry">
                  {Text.titleForeignerTrackingBook.gateEntry}
                </option>
                <option value="EntryPurpose">
                  {Text.titleForeignerTrackingBook.entryPurpose}
                </option>
                <option value="SojournDateFrom">
                  {Text.titleForeignerTrackingBook.sojournDateFrom}
                </option>
                <option value="SojournDateTo">
                  {Text.titleForeignerTrackingBook.sojournDateTo}
                </option>
                <option value="GuarantorName">
                  {Text.titleForeignerTrackingBook.guarantorName}
                </option>
                <option value="FullNamePolice">
                  {Text.titleForeignerTrackingBook.fullNamePolice}
                </option>
                <option value="PoliceLead">
                  {Text.titleForeignerTrackingBook.PoliceLead}
                </option>
              </select>
            </div>

            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSeachValue(e.target.value)}
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
                      setSeachValue("")
                    }}
                  />) : (
                  <div></div>
                )
              }
              <BiSearchAlt2
                onClick={searchHandler}
                className={cn(styles.searchIcon)}
              />
            </div>
            <div className={cn(styles.addnew)}>
              <button
                onClick={() => {
                  setAdd(true);
                  handlerReset();
                  setIsShow(true);
                  setAddEvent(true);
                }}
              >
                {Text.plus}
              </button>
            </div>
          </div>
        </div>

        <div className={cn(styles.contentbody)}>
          <table
            className={cn(styles.tableContainer)}
            cellPadding="10"
            cellSpacing="0"
          >
            <thead>
              <tr>
                <th className={cn(styles.stt, styles.borderTable)}>STT</th>
                <th
                  className={cn(styles.registerDateTable, styles.borderTable)}
                >
                  Ngày đăng ký
                </th>
                <th className={cn(styles.fullNameTable, styles.borderTable)}>
                  Họ và tên
                </th>
                <th className={cn(styles.birthDayTable, styles.borderTable)}>
                  Ngày tháng năm sinh
                </th>
                <th className={cn(styles.countryTable, styles.borderTable)}>
                  Quốc tịch
                </th>
                <th
                  className={cn(
                    styles.residentialAddressTable,
                    styles.borderTable
                  )}
                >
                  Địa chỉ cư trú
                </th>
                <th className={cn(styles.passportTable, styles.borderTable)}>
                  Sổ hộ chiếu
                </th>
                <th
                  className={cn(
                    styles.recidencePermitNumberTable,
                    styles.borderTable
                  )}
                >
                  Số giấy tờ cho cư trú
                </th>
                <th className={cn(styles.jobTable, styles.borderTable)}>
                  Nghề nghiệp
                </th>
                <th className={cn(styles.entryDateTable, styles.borderTable)}>
                  Ngày nhập cảnh
                </th>
                <th className={cn(styles.gateEntryTable, styles.borderTable)}>
                  Cửa khẩu nhập cảnh
                </th>
                <th
                  className={cn(styles.entryPurposeTable, styles.borderTable)}
                >
                  Mục đích nhập cảnh
                </th>
                <th
                  className={cn(
                    styles.sojournDateFromTable,
                    styles.borderTable
                  )}
                >
                  Ngày bắt đầu tạm trú
                </th>
                <th
                  className={cn(styles.sojournDateToTable, styles.borderTable)}
                >
                  Ngày đi
                </th>
                <th
                  className={cn(styles.GuarantorNameTable, styles.borderTable)}
                >
                  Họ và tên chủ nhà
                </th>
                <th
                  className={cn(styles.FullNamePoliceTable, styles.borderTable)}
                >
                  Cán bộ đăng ký
                </th>
                <th className={cn(styles.PoliceLeadTable, styles.borderTable)}>
                  Chỉ huy ký
                </th>
                <th
                  className={cn(styles.editAndDelete, styles.borderTable)}
                ></th>
              </tr>
            </thead>
            <tbody className={cn(styles.bordertbody)}>
              {mainData.length == 0 ? (
                <tr>
                  <td
                    colSpan={21}
                    style={{ fontSize: "14px", fontWeight: "600" }}
                    className={cn(styles.borderColumn, styles.itemTable)}
                  >
                    Bảng này chưa có dữ liệu
                  </td>
                </tr>
              ) : (
                mainData.map((item, index) => (
                  <tr key={index} className={cn(styles.borderColumnID)}>
                    {totalPage > 0 && (
                      <td
                        onClick={() => editHandler(item)}
                        className={cn(styles.contentStt, styles.itemTable)}
                      >
                        {paginate === 1
                          ? index + 1
                          : index + 1 + 10 * (paginate - 1)}
                      </td>
                    )}
                    {totalPageSearch > 0 && (
                      <td
                        onClick={() => editHandler(item)}
                        className={cn(styles.contentStt, styles.itemTable)}
                      >
                        {paginateSearch === 1
                          ? index + 1
                          : index + 1 + 10 * (paginateSearch - 1)}
                      </td>
                    )}
                    {/* <td
                      className={cn(styles.borderColumn, styles.itemTable)}
                      onClick={() => editHandler(item)}
                    >{index + 1}</td> */}
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentRegisterDate)}
                      onClick={() => editHandler(item)}
                    >
                      {formatDate(String(item.RegisterDate))}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentFullName)}
                      onClick={() => editHandler(item)}
                    >
                      {item.FullName}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentBirthDay)}
                      onClick={() => editHandler(item)}
                    >
                      {formatDate(String(item.BirthDay))}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentCountry)}
                      onClick={() => editHandler(item)}
                    >
                      {item.Country}
                    </td>

                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentResidentialAddress)}
                      onClick={() => editHandler(item)}
                    >
                      {item.ResidentialAddress}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentPassport)}
                      onClick={() => editHandler(item)}
                    >
                      {item.Passport}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentRecidencePermitNumberTable)}
                      onClick={() => editHandler(item)}
                    >
                      {item.RecidencePermitNumber}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentJob)}
                      onClick={() => editHandler(item)}
                    >
                      {item.Job}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contetnEntryDateTable)}
                      onClick={() => editHandler(item)}
                    >
                      {formatDate(String(item.EntryDate))}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentGateEntry)}
                      onClick={() => editHandler(item)}
                    >
                      {item.GateEntry}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentEntryPurpose)}
                      onClick={() => editHandler(item)}
                    >
                      {item.EntryPurpose}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentSojournDateFrom)}
                      onClick={() => editHandler(item)}
                    >
                      {formatDate(String(item.SojournDateFrom))}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentSojournDateTo)}
                      onClick={() => editHandler(item)}
                    >
                      {formatDate(String(item.SojournDateTo))}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.GuarantorName)}
                      onClick={() => editHandler(item)}
                    >
                      {item.GuarantorName}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentFullNamePolice)}
                      onClick={() => editHandler(item)}
                    >
                      {item.FullNamePolice}
                    </td>
                    <td
                      className={cn(styles.borderColumn, styles.itemTable, styles.contentPoliceLead)}
                      onClick={() => editHandler(item)}
                    >
                      {item.PoliceLead}
                    </td>
                    <td
                      className={cn(
                        styles.contentEditAndDelete,
                        styles.itemTable
                      )}
                    >
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => {
                            deleteHandler(idDelete);
                          }}
                          backgroundColor="rgba(3, 3, 3, 0.1)"
                          description="Bạn có chắc muốn xóa thông tin này ? "
                          alertBtn={false}
                          deleteBtn={true}
                          closeModal={() => setConfirmDelete(false)}
                        />
                      )}
                      <AiOutlineDelete
                        className={cn(styles.delete)}
                        onClick={() => {
                          handleOpenModalDelete(item.Id);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
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
    </>
  );
}
export default ForeignerTrackingBook;
