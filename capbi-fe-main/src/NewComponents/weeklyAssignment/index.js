import { ErrorMessages, SuccessMessages, Text, apiServer } from "@/constant";
import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getDataWeeklyAssignment } from "@/store/vehicleWeeklyAssignment";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import PaginatedItems from "../../components/pagination";
import { notifyError, notifySuccess } from "../../notify";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import Modal from "../newModal";
import ContentModalWeekly from "./contentModalWeekly";
import styles from "./index.module.css";

let idDelete;
function WeeklyAssignment() {
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [dataWeeklyAssignment, setDataWeeklyAssignment] = useState([]);
  const [paginate, setPaginate] = useState(1);
  const [paginateSearch, setPaginateSearch] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPageSearch, setTotalPageSearch] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");
  const [fieldSearch, setFieldSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addEvent, setAddEvent] = useState(false);
  const dispatch = useDispatch();
  const [searchLoading, setSearchLoading] = useState(true);
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const handleShowModal = (e) => {
    setAddEvent(true);
    setDesc(Text.CRUD.add);
    setOpenAdd(true);
  };
  const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);
  useEffect(() => {
    if (searchValue === "") {
      if (noPreventCallApiAgain) {
        BaseAxios({
          method: "POST",
          url: apiServer.weeklyAssignment.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setDataWeeklyAssignment(trackers?.data?.data.list_data);
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
      url: apiServer.weeklyAssignment.delete + id,
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
    setDesc(Text.CRUD.insert);
    dispatch(getDataWeeklyAssignment(data));
    setOpenAdd(true);
  };
  const handleClose = () => {
    const resetData = {
      Id: "",
      Days: "",
      Date: "",
      Captain: "",
      InHour: "",
      OverTime: "",
      OnDuty: "",
      PatrolShiftOne: "",
      PatrolShiftTwo: "",
    };
    setOpenAdd(false);
    dispatch(getDataWeeklyAssignment(resetData));
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
      url: `api/weeklyAssignment/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        setDataWeeklyAssignment(trackers?.data?.data?.list_data);
        setTotalPageSearch(trackers?.data?.data?.totalPage);
        setPaginate(1);
        setTotalPage(0);
      })
      .catch(() => {
        setDataWeeklyAssignment([]);
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
      url: "api/weeklyAssignment/exports",
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
        notifySuccess(Text.CRUD.Success);
      })
      .catch(() => {
        notifyError(Text.CRUD.Error);
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
          <ContentModalWeekly
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
          <h2>Sổ phân công trực tuần</h2>
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
              <select className={cn(styles.inputField)} value={fieldSearch} onChange={(e) => setFieldSearch(e.target.value)} >
                <option >Chọn giá trị</option>
                <option value="days">Thứ</option>
                <option value="date">Ngày</option>
                <option value="captain">Trực chỉ huy</option>
                <option value="inHour">Trực Ban Trong Giờ	</option>
                <option value="overTime">Trực Ban Ngoài Giờ	</option>
                <option value="onDuty">Trực Chiến</option>
                <option value="patrolShiftOne">Tuần Tra Ca 1</option>
                <option value="patrolShiftTwo">Tuần Tra Ca 2</option>
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
              <BiSearchAlt2 onClick={handleSearch} className={cn(styles.searchIcon)} />
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
                <th className={cn(styles.stt)} rowSpan={2}>{Text.dataWeeklyAssignment.stt}</th>
                <th rowSpan={2} className={cn(styles.day)}>
                  {"Thứ "}
                </th>
                <th rowSpan={2} className={cn(styles.standingForce)}>
                  {"Ngày tháng năm"}
                </th>
                <th rowSpan={2} className={cn(styles.caseName)}>
                  {"Trực chỉ huy"}
                </th>
                <th colSpan={2} className={cn(styles.details)}>
                  {"Trực ban"}
                </th>

                <th rowSpan={2} className={cn(styles.contentInHour)}>
                  {"Trực chiến "}
                </th>
                <th colSpan={2} className={cn(styles.patrol)}>
                  {"Tuần tra"}
                </th>
                <th rowSpan={2} className={cn(styles.editAndDelete)}></th>
              </tr>
              <tr>
                <th className={cn(styles.contentInHour)} rowSpan={1.5}>{"Trong giờ"}</th>
                <th className={cn(styles.contentInHour)} rowSpan={1.5}>{"Ngoài giờ"}</th>
                <th className={cn(styles.contentInHour)} rowSpan={1.5}>{"Ca 1"}</th>
                <th className={cn(styles.contentInHour)} rowSpan={1.5}>{"Ca 2"}</th>
              </tr>
              
            </thead>
            {dataWeeklyAssignment.length > 0 && (
              <tbody>
                {dataWeeklyAssignment.map((data, index) => (
                  <tr key={index}>
                    {totalPage > 0 && (
                      <td
                        onClick={() => handleEdit(data)}
                        className={cn(styles.contentStt, styles.itemTable)}
                      >
                        {paginate === 1
                          ? index + 1
                          : index + 1 + 10 * (paginate - 1)}
                      </td>
                    )}
                    {totalPageSearch > 0 && (
                      <td
                        onClick={() => handleEdit(data)}
                        className={cn(styles.contentStt, styles.itemTable)}
                      >
                        {paginateSearch === 1
                          ? index + 1
                          : index + 1 + 10 * (paginateSearch - 1)}
                      </td>
                    )}
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentDays, styles.itemTable)}
                    >
                      {data?.Days ? String(data.Days) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.standingForce)}
                    >
                      {data?.Date ? formatDate(String(data.Date)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentCaptain, styles.itemTable)}
                    >
                      {data?.Captain ? String(data.Captain) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentInHour, styles.itemTable)}
                    >
                      {data?.InHour ? String(data.InHour) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentOverTime, styles.itemTable)}
                    >
                      {data?.OverTime ? String(data.OverTime) : ""}
                    </td>

                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentOnDuty)}
                    >
                      {data?.OnDuty ? String(data.OnDuty) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentPatrolShiftOne)}
                    >
                      {data?.PatrolShiftOne ? String(data.PatrolShiftOne) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentPatrolShiftTwo)}
                    >
                      {data?.PatrolShiftTwo ? String(data.PatrolShiftTwo) : ""}
                    </td>

                    <td className={cn(styles.contentEditAndDelete)}>
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor="var(--shadow-color)"
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
            {dataWeeklyAssignment.length === 0 && !loading && (
              <EmptyData colSpan={9} />
            )}
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
        {dataWeeklyAssignment.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {dataWeeklyAssignment.length > 0 && totalPageSearch > 1 && (
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

export default memo(WeeklyAssignment);
