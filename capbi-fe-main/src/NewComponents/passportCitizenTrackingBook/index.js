import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getDataPassport } from "@/store/vehiclePassport";
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
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import Modal from "../newModal";
import ContentPassportModal from "./contentModalStatus";
import styles from "./index.module.css";
import TextPassport from "./text";
let idDelete;

function PassportCitizenTrackingBook() {
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
  const [addEvent, setAddEvent] = useState(false);
  const dispatch = useDispatch();
  const [fieldSearch, setFieldSearch] = useState("");
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const [searchLoading, setSearchLoading] = useState(true);

  const handleShowModal = (e) => {
    setAddEvent(true);
    setDesc(TextPassport.CRUD.add);
    setOpenAdd(true);
  };
  const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);

  useEffect(() => {
    if (searchValue === "") {
      if (noPreventCallApiAgain) {
        BaseAxios({
          method: "POST",
          url: apiServer.passport.get,
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
    setSearchLoading(true);
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain, searchLoading]);
  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.passport.delete + id,
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
    setDesc(TextPassport.CRUD.insert);
    dispatch(getDataPassport(data));
    setOpenAdd(true);
  };
  const handleClose = () => {
    const resetData = {
      Id: "",
      FullName: "",
      Birthday: "",
      Gender: "",
      Staying: "",
      ConfirmationDate: "",
      FullNamePolice: "",
      leaderSign: "",
    };
    setOpenAdd(false);
    dispatch(getDataPassport(resetData));
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
      url: `api/passport/show`,
      method: "POST",
      data: myObject,
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
      url: "api/passport/exports",
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
          <ContentPassportModal
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
          <h2>{"Sổ theo dõi công dân làm hộ chiếu"}</h2>
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

                <option value="fullName">Họ và tên</option>
                <option value="birthday">Ngày tháng năm sinh</option>

                <option value="staying">Hộ khẩu thường trú (tạm trú)</option>
                <option value="confirmationDate">Ngày tháng xác nhận</option>
                <option value="fullNamePolice">Cán bộ kiểm tra</option>
                <option value="leaderSign">Lãnh đạo ký</option>
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
                <th className={cn(styles.stt)}>{TextPassport.passport.stt}</th>
                <th className={cn(styles.fullName)}>{"Họ và tên"}</th>
                <th className={cn(styles.birthday)}>{"Ngày tháng năm sinh"}</th>
                <th className={cn(styles.gender)}>{"Giới tính"}</th>
                <th className={cn(styles.staying)}>
                  {"Hộ khẩu thường trú (tạm trú)"}
                </th>
                <th className={cn(styles.confirmationDate)}>
                  {"Ngày tháng xác nhận"}
                </th>
                <th className={cn(styles.fullNamePolice)}>
                  {"Cán bộ kiểm tra"}
                </th>
                <th className={cn(styles.leaderSign)}>{"Lãnh đạo ký"}</th>
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
                      className={cn(styles.contentFullName)}
                    >
                      {data?.FullName ? String(data.FullName) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentBirthday)}
                    >
                      {data?.Birthday ? formatDate(String(data.Birthday)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentGender)}
                    >
                      {data?.Gender ? "Nam" : "Nữ"}
                    </td>

                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentStaying)}
                    >
                      {data?.Staying ? String(data.Staying) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentConfirmationDate)}
                    >
                      {data?.ConfirmationDate
                        ? formatDate(String(data.ConfirmationDate))
                        : ""}
                    </td>

                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentFullNamePolice)}
                    >
                      {data?.FullNamePolice ? String(data.FullNamePolice) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentLeaderSign)}
                    >
                      {data?.LeaderSign ? String(data.LeaderSign) : ""}
                    </td>
                    <td className={cn(styles.contentEditAndDelete)}>
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor="var(--shadow-color)"
                          description={TextPassport.CRUD.deleteConfirm}
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
            {dataPassport.length === 0 && !loading && <EmptyData colSpan={9} />}
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

export default memo(PassportCitizenTrackingBook);
