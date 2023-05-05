import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getData } from "@/store/vehicleSanctions";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { GoCloudUpload } from "react-icons/go";
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
import LogModal from "../LogBook/logModal";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import ModalLogBookSaction from "../newModalLogBookSaction";
import styles from "./index.module.css";
import ImagesInTdTag from "../imagesInTdTag";
import { uploadFiles } from "@/commonHandle";
import SlideImages from "../slideImages";

let idDelete;

function Sanctions() {
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
  const [searchLoading, setSearchLoading] = useState(true);
  const [addEvent, setAddEvent] = useState(false);

  const dispatch = useDispatch();
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const handleShowModal = (e) => {
    setAddEvent(true);
    setDesc("Thêm");
    setOpenAdd(true);
  };
  const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);
  const [images, setImages] = useState([]);
  const [isShowSlideImages, setIsShowSlideImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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
    setSearchLoading(true);
    setNoPreventCallApiAgain(true);
  }, [
    isUpdatedSuccess,
    paginate,
    paginateSearch,
    noPreventCallApiAgain,
    searchLoading,
  ]);

  const showSlideImage = (indexImage) => {
    setSelectedImageIndex(indexImage);
    setIsShowSlideImages(true);
  };

  const closeSlideImage = () => {
    setIsShowSlideImages(false);
  };

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
        notifyError("Có lỗi xảy ra, vui lòng thử lại");
      });
    console.log(timeExport);
    setStartExport("");
    setEndExport("");
  };

  const handleFilesSelect = (e) => {
    let imageFiles = uploadFiles(
      images,
      e.target.files,
      Text.fiveImageFiles,
      Text.twoMillionBytes,
      Text.imageTypes
    );
    if (imageFiles && imageFiles.length > 0) setImages(imageFiles);
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
      {isShowSlideImages && (
        <SlideImages
          images={images}
          selectedImageIndex={selectedImageIndex}
          closeSlideImage={closeSlideImage}
        />
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>Sổ theo dõi xử phạt</h2>
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
                <option value="decisionId">
                  {Text.titlelogbook.decisionId}
                </option>
                <option value="fullName">{Text.titlelogbook.fullName}</option>
                <option value="birthday">{Text.titlelogbook.birthday}</option>
                <option value="staying">{Text.titlelogbook.staying}</option>
                <option value="nation">{Text.titlelogbook.nation}</option>
                <option value="country">{Text.titlelogbook.country}</option>
                <option value="job">{Text.titlelogbook.job}</option>
                <option value="content">{Text.titlelogbook.content}</option>
                <option value="punisher">{Text.titlelogbook.punisher}</option>
                <option value="processingForm">
                  {Text.titlelogbook.processingForm}
                </option>
                <option value="fullnamePolice">
                  {Text.titlelogbook.fullnamePolice}
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
              <div className={cn(styles.empty)}></div>
              {searchValue.trim() != "" ? (
                searchLoading && (
                  <IoIosCloseCircleOutline
                    className={cn(styles.closeIcon)}
                    onClick={() => {
                      setSearchLoading(false);
                      setSearchValue("");
                    }}
                  />
                )
              ) : (
                <div></div>
              )}
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
                <th className={cn(styles.stt)}>{Text.titlelogbook.stt}</th>
                <th className={cn(styles.decisionId)}>
                  {Text.titlelogbook.decisionId}
                </th>
                <th className={cn(styles.fullName)}>
                  {Text.titlelogbook.fullName}
                </th>
                <th className={cn(styles.licensePlates)}>
                  {Text.titlelogbook.birthday}
                </th>
                <th className={cn(styles.receiver)}>
                  {Text.titlelogbook.staying}
                </th>
                <th className={cn(styles.nation)}>
                  {Text.titlelogbook.nation}
                </th>
                <th className={cn(styles.country)}>
                  {Text.titlelogbook.country}
                </th>
                <th className={cn(styles.job)}>{Text.titlelogbook.job}</th>
                <th className={cn(styles.contentContainer)}>
                  {Text.titlelogbook.content}
                </th>
                <th className={cn(styles.punisher)}>
                  {Text.titlelogbook.punisher}
                </th>
                <th className={cn(styles.processingForm)}>
                  {Text.titlelogbook.processingForm}
                </th>
                <th className={cn(styles.licensePlates)}>
                  {Text.titlelogbook.fullnamePolice}
                </th>

                <th className={cn(styles.image)}>{Text.image}</th>
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
                      className={cn(styles.cContentContainer)}
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

                    <td
                      className={cn(styles.contentImage)}
                      onClick={(e) => {
                        if (e.target.tagName === "TD") handleEdit(data);
                      }}
                    >
                      <div className={cn(styles.uploadImages)}>
                        {/* <GoCloudUpload
													title={Text.uploadImages}
													className={cn(styles.iconUploadImages)}
													onClick={(e) => handleImagesUpload(e)}
												/>
												<input
													type="file"
													className={cn(styles.hiddenInputUploadImages)}
													ref={inputRefOfIconUpload}
													onChange={(e) => handleFilesSelect(e)}
													multiple
													accept={Text.imageTypesString}
												/> */}

                        <label htmlFor="upload">
                          <GoCloudUpload
                            title={Text.uploadImages}
                            className={cn(styles.iconUploadImages)}
                          />
                        </label>
                        <input
                          id="upload"
                          type="file"
                          className={cn(styles.hiddenInputUploadImages)}
                          onChange={(e) => handleFilesSelect(e)}
                          multiple
                          accept={Text.imageTypesString}
                        />
                      </div>
                      {images && images.length > 0 && (
                        <ImagesInTdTag
                          images={images}
                          showSlideImage={showSlideImage}
                        />
                      )}
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

export default memo(Sanctions);
