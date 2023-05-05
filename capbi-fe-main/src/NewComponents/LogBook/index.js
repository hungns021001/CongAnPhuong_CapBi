import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getData } from "@/store/vehicleSanctions";
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
import ModalLogBookSaction from "../newModalLogBookSaction";
import styles from "./index.module.css";
import LogModal from "./logModal";

let idDelete;

function LogBook() {
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
          url: apiServer.sanctions.get,
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
      url: apiServer.sanctions.delete + id,
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
      DecisionId: "",
      FullName: "",
      Birthday: "",
      Staying: "",
      Nation: "",
      Country: "",
      Job: "",
      Content: "",
      Punisher: "",
      ProcessingForm: "",
      FullNamePolice: "",
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
      url: `api/sanctions/show`,
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
      url: "api/sanctions/exports",
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
        <ModalLogBookSaction handleCloseModal={handleClose}>
          <LogModal
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            addEvent={addEvent}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
          />
        </ModalLogBookSaction>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>{"Sổ theo dõi quyết định xử phạt"}</h2>
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
                <option value="decisionId">{"Số quyết định"}</option>
                <option value="fullName">{"Họ và tên"}</option>
                <option value="birthday">{"Ngày tháng năm sinh"}</option>
                <option value="staying">
                  {"Hộ khẩu thường trú, tạm trú \n(Ghi rõ Xã, Phường)"}
                </option>
                <option value="nation">{"Dân tộc"}</option>
                <option value="country">{"Quốc tịch"}</option>
                <option value="job">{"Nghề nghiệp, nơi làm việc"}</option>
                <option value="content">
                  {
                    "Nội dung vi phạm \n(Ghi rõ thời gian, ngày, tháng, năm, lỗi vi phạm)"
                  }
                </option>
                <option value="punisher">
                  {
                    "Người ra quyết định xử phạt \n( Ghi rõ thời gian, ngày, tháng, năm)"
                  }
                </option>
                <option value="processingForm">
                  {"Hình thức xử lý \n(Ghi rõ số tiền xử phạt)"}
                </option>
                <option value="fullnamePolice">
                  {"Cán bộ được phân công xử lý"}
                </option>
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
                <th className={cn(styles.stt)}>STT</th>
                <th className={cn(styles.decisionId)}>{"Số quyết định"}</th>
                <th className={cn(styles.fullName)}>{"Họ và tên"}</th>
                <th className={cn(styles.licensePlates)}>
                  {"Ngày tháng năm sinh"}
                </th>
                <th className={cn(styles.receiver)}>
                  {"Hộ khẩu thường trú, tạm trú \n(Ghi rõ Xã, Phường)"}
                </th>
                <th className={cn(styles.nation)}>{"Dân tộc"}</th>
                <th className={cn(styles.country)}>{"Quốc tịch"}</th>
                <th className={cn(styles.job)}>
                  {"Nghề nghiệp, nơi làm việc"}
                </th>
                <th className={cn(styles.contentViolate)}>
                  {
                    "Nội dung vi phạm \n(Ghi rõ thời gian, ngày, tháng, năm, lỗi vi phạm)"
                  }
                </th>
                <th className={cn(styles.punisher)}>
                  {
                    "Người ra quyết định xử phạt \n( Ghi rõ thời gian, ngày, tháng, năm)"
                  }
                </th>
                <th className={cn(styles.processingorm)}>
                  {"Hình thức xử lý \n(Ghi rõ số tiền xử phạt)"}
                </th>
                <th className={cn(styles.fullNamePolice)}>
                  {"Cán bộ được phân công xử lý"}
                </th>
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
                      className={cn(styles.contentDecisionId)}
                    >
                      {data?.DecisionId
                        ? formatDate(String(data.DecisionId))
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
                      className={cn(styles.contentBirthday)}
                    >
                      {data?.Birthday ? formatDate(String(data.Birthday)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentStaying)}
                    >
                      {data?.Staying ? formatDate(String(data.Staying)) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentNation)}
                    >
                      {data?.Nation ? String(data.Nation) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentCountry)}
                    >
                      {data?.Country ? String(data.Country) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentJob)}
                    >
                      {data?.Job ? String(data.Job) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.cContentViolate)}
                    >
                      {data?.Content ? String(data.Content) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentPunisher)}
                    >
                      {data?.Punisher ? String(data.Punisher) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentProcessingForm)}
                    >
                      {data?.ProcessingForm ? String(data.ProcessingForm) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentFullNamePolice)}
                    >
                      {data?.FullNamePolice ? String(data.FullNamePolice) : ""}
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
            {mainData.length === 0 && !loading && <EmptyData colSpan={13} />}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={13} className={cn(styles.loadingArea)}>
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

export default memo(LogBook);
