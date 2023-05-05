import { ErrorMessages, SuccessMessages, apiServer } from "@/constant";
import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getDataHandlingOnDay } from "@/store/vehicleHandlingOnDaySlice";
import cn from "classnames";
import { memo, useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import PaginatedItems from "../../components/pagination";
import { notifyError, notifySuccess } from "../../notify";
import { groupByComma } from "../../utils/numberUtils";
import EmptyData from "../emptyData";
import LoadingTable from "../loadingTable";
import ModalConfirm from "../modalConfirm";
import Modal from "../newModal";
import ContentModalTrackProcessingOfTheDay from "./contentModalTrackProcessingOfTheDay";
import styles from "./index.module.css";
import TextTheDay from "./text";
import { GoCloudUpload } from "react-icons/go";
import ImagesInTdTag from "../imagesInTdTag";
import SlideImages from "../slideImages";
import { uploadFiles } from "@/commonHandle";

let idDelete;
function TrackProcessingOfTheDay() {
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [dataHandlingOnDay, setDataHandlingOnDay] = useState([]);
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
  const [images, setImages] = useState([]);
  const [isShowSlideImages, setIsShowSlideImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [searchLoading, setSearchLoading] = useState(true);
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const handleShowModal = (e) => {
    setAddEvent(true);
    setDesc(TextTheDay.CRUD.add);
    setOpenAdd(true);
  };
  const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);
  useEffect(() => {
    if (searchValue === "") {
      if (noPreventCallApiAgain) {
        BaseAxios({
          method: "POST",
          url: apiServer.handlingonDay.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setDataHandlingOnDay(trackers?.data?.data.list_data);
            setLoading(false);
            setTotalPage(trackers?.data?.data?.totalPage);
            setPaginateSearch(1);
            setTotalPageSearch(0);
          })
          .catch((err) => {});
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
  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.handlingonDay.delete + id,
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
    setDesc(TextTheDay.CRUD.insert);
    dispatch(getDataHandlingOnDay(data));
    setOpenAdd(true);
  };
  const handleClose = () => {
    const resetData = {
      Id: "",
      LicensePlates: "",
      DateOfViolation: "",
      AddressOfViolation: "",
      Violation: "",
      FullName: "",
      Custody: "",
      HandoverUnit: "",
      Receiver: "",
      Amount: "",
      Picture: "",
      Result: "",
      Verify: "",
    };
    setOpenAdd(false);
    dispatch(getDataHandlingOnDay(resetData));
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
      url: `api/handlingonDay/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        setDataHandlingOnDay(trackers?.data?.data?.list_data);
        setTotalPageSearch(trackers?.data?.data?.totalPage);
        setPaginate(1);
        setTotalPage(0);
      })
      .catch(() => {
        setDataHandlingOnDay([]);
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
    BaseAxios({
      url: "api/handlingonDay/exports",
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
        notifySuccess(TextTheDay.notify.notifySuccess);
      })
      .catch(() => {
        notifyError(TextTheDay.notify.notifyError);
      });
    setStartExport("");
    setEndExport("");
  };
  const showSlideImage = (indexImage) => {
    setSelectedImageIndex(indexImage);
    setIsShowSlideImages(true);
  };

  const closeSlideImage = () => {
    setIsShowSlideImages(false);
  };

  const inputRefOfIconUpload = useRef(null);

  const handleImagesUpload = (e) => {
    e.stopPropagation();
    inputRefOfIconUpload.current.click();
  };

  const handleFilesSelect = (e) => {
    let imageFiles = uploadFiles(
      images,
      e.target.files,
      TextTheDay.fiveImageFiles,
      TextTheDay.twoMillionBytes,
      TextTheDay.imageTypes
    );
    if (imageFiles && imageFiles.length > 0) setImages(imageFiles);
  };

  const fieldOptions = [
    { label: TextTheDay.defaultOption, value: "" },
    {
      label: TextTheDay.trackProcessingOfTheDay.licensePlates,
      value: "licensePlates",
    },
    {
      label: TextTheDay.trackProcessingOfTheDay.dateOfViolation,
      value: "dateOfViolation",
    },
    {
      label: TextTheDay.trackProcessingOfTheDay.addressOfViolation,
      value: "addressOfViolation",
    },
    { label: TextTheDay.trackProcessingOfTheDay.violation, value: "violation" },
    { label: TextTheDay.trackProcessingOfTheDay.fullName, value: "fullName" },
    { label: TextTheDay.trackProcessingOfTheDay.custody, value: "custody" },
    {
      label: TextTheDay.trackProcessingOfTheDay.handoverUnit,
      value: "handoverUnit",
    },
    { label: TextTheDay.trackProcessingOfTheDay.receiver, value: "receiver" },
    { label: TextTheDay.trackProcessingOfTheDay.amount, value: "amount" },
    { label: TextTheDay.trackProcessingOfTheDay.result, value: "result" },
  ];
  return (
    <div className={cn(styles.wrapper)}>
      <ToastContainer />
      {openAdd && (
        <Modal handleCloseModal={handleClose}>
          <ContentModalTrackProcessingOfTheDay
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            addEvent={addEvent}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
          />
        </Modal>
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
          <h2>{TextTheDay.title.trackProcessingOfTheDay}</h2>
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
            </div>

            <div className={cn(styles.groupBtnRight)}>
              <div className={cn(styles.selectBtn)}>
                <select
                  className={cn(styles.inputField)}
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                >
                  {fieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cn(styles.search)}>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={TextTheDay.search.searchPlaceholder}
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
              <div className={cn(styles.addNew)}>
                <button onClick={handleShowModal}>{TextTheDay.plus}</button>
              </div>
            </div>
          
        </div>
        <div className={cn(styles.contentBody)}>
          <table className={cn(styles.tableContent)} cellSpacing="0">
            <thead>
              <tr>
                <th className={cn(styles.stt)}>
                  {TextTheDay.trackProcessingOfTheDay.stt}
                </th>
                <th className={cn(styles.licensePlates)}>
                  {TextTheDay.trackProcessingOfTheDay.licensePlates}
                </th>
                <th className={cn(styles.date)}>
                  {TextTheDay.trackProcessingOfTheDay.dateOfViolation}
                </th>
                <th className={cn(styles.location)}>
                  {TextTheDay.trackProcessingOfTheDay.addressOfViolation}
                </th>
                <th className={cn(styles.violation)}>
                  {TextTheDay.trackProcessingOfTheDay.violation}
                </th>
                <th className={cn(styles.fullName)}>
                  {TextTheDay.trackProcessingOfTheDay.fullName}
                </th>
                <th className={cn(styles.custody)}>
                  {TextTheDay.trackProcessingOfTheDay.custody}
                </th>
                <th className={cn(styles.handOver)}>
                  {TextTheDay.trackProcessingOfTheDay.handoverUnit}
                </th>
                <th className={cn(styles.receive)}>
                  {TextTheDay.trackProcessingOfTheDay.receiver}
                </th>
                <th className={cn(styles.bets)}>
                  {TextTheDay.trackProcessingOfTheDay.amount}
                </th>
                <th className={cn(styles.attachPhoto)}>
                  {TextTheDay.trackProcessingOfTheDay.picture}
                </th>
                <th className={cn(styles.result)}>
                  {TextTheDay.trackProcessingOfTheDay.result}
                </th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {dataHandlingOnDay.length > 0 && (
              <tbody>
                {dataHandlingOnDay.map((data, index) => (
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
                      className={cn(styles.contentLicensePlates)}
                    >
                      {data?.LicensePlates ? String(data.LicensePlates) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.dateOfViolation)}
                    >
                      {data?.DateOfViolation
                        ? formatDate(String(data.DateOfViolation))
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.addressOfViolation)}
                    >
                      {data?.AddressOfViolation
                        ? String(data.AddressOfViolation)
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentViolation)}
                    >
                      {data?.Violation ? String(data.Violation) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contetnFullName)}
                    >
                      {data?.FullName ? String(data.FullName) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentCustody)}
                    >
                      {data?.Custody ? String(data.Custody) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.handoverUnit)}
                    >
                      {data?.HandoverUnit ? String(data.HandoverUnit) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentReceive)}
                    >
                      {data?.Receiver ? String(data.Receiver) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.amount)}
                    >
                      {data?.Amount ? groupByComma(data.Amount) : ""}
                    </td>
                    <td
                      className={cn(styles.contentImage)}
                      onClick={(e) => {
                        if (e.target.tagName === "TD") handleEdit(data);
                      }}
                    >
                      <div className={cn(styles.uploadImages)}>
                        <GoCloudUpload
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
                        />
                      </div>
                      {images && images.length > 0 && (
                        <ImagesInTdTag
                          images={images}
                          showSlideImage={showSlideImage}
                        />
                      )}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentResult)}
                    >
                      {data?.Result ? String(data.Result) : ""}
                    </td>
                    {/* <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.verify)}
                    >
                      {data?.Verify ? String(data.Verify) : ""}
                    </td> */}
                    <td className={cn(styles.contentEditAndDelete)}>
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor={
                            TextTheDay.CRUD.backgroundDeleteModal
                          }
                          description={TextTheDay.CRUD.deleteConfirm}
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
            {dataHandlingOnDay.length === 0 && !loading && (
              <EmptyData colSpan={11} />
            )}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={11} className={cn(styles.loadingArea)}>
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {dataHandlingOnDay.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {dataHandlingOnDay.length > 0 && totalPageSearch > 1 && (
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

export default memo(TrackProcessingOfTheDay);
