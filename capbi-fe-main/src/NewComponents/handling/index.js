import { ErrorMessages, SuccessMessages, Text, apiServer } from "@/constant";
import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import { getDataHandling } from "@/store/vehicleHandling";
import cn from "classnames";
import { memo, useEffect, useState, useRef } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { GoCloudUpload } from 'react-icons/go';
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
import ContentModalStatusBookDay from "./contentModalStatusBookDay";
import styles from "./index.module.css";
import TextTheDay from "./text";
import SlideImages from "../slideImages";
import ImagesInTdTag from '../imagesInTdTag';
import { uploadFiles } from '@/commonHandle';


let idDelete;

function HandLing() {
  const [startExport, setStartExport] = useState("");
  const [endExport, setEndExport] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [dataHandling, setDataHandling] = useState([]);
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
    setDesc(TextTheDay.CRUD.add);
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
          url: apiServer.handling.get,
          params: {
            page: paginate,
          },
        })
          .then((trackers) => {
            setDataHandling(trackers?.data?.data.list_data);
            setLoading(false);
            setTotalPage(trackers?.data?.data?.total_page);
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
    setSearchLoading(true)
  }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain, searchLoading]);

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
      url: apiServer.handling.delete + id,
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
    dispatch(getDataHandling(data));
    setOpenAdd(true);
  };

  const handleClose = () => {
    const resetData = {
      Id: "",
      DateViolation: "",
      NameOfViolation: "",
      AddressViolation: "",
      Content: "",
      FullNamePolice: "",
      DirectiveInformation: "",
      Result: "",
    };
    setOpenAdd(false);
    dispatch(getDataHandling(resetData));
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
      url: `api/handling/show`,
      data: myObject,
      method: "POST",
      params: {
        page: paginateSearch,
      },
    })
      .then((trackers) => {
        setDataHandling(trackers?.data?.data?.list_data);
        setTotalPageSearch(trackers?.data?.data?.total_page);
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
      url: "api/handling/exports",
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
    setStartExport("");
    setEndExport("");
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
			Text.fiveImageFiles,
			Text.twoMillionBytes,
			Text.imageTypes,
		);
		if (imageFiles && imageFiles.length > 0) setImages(imageFiles);
	};

  return (
    <div className={cn(styles.wrapper)}>
      <ToastContainer />
      {openAdd && (
        <Modal handleCloseModal={handleClose}>
          <ContentModalStatusBookDay

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
          <h2>{"Sổ theo dõi xử lý vụ việc"}</h2>
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
                <option className={cn(styles.option)} value="dateViolation">
                  Ngày xảy ra
                </option>
                <option value="nameOfViolation">Tên vụ việc</option>
                <option value="addressViolation">Địa điểm xảy ra</option>
                <option value="content">Nội dung</option>
                <option value="fullnamePolice">Cán bộ thụ lý</option>
                <option value="result">Kết quả xử lý</option>
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
                <th className={cn(styles.stt)}>{Text.caseHandlingLogBook.stt}</th>
                <th className={cn(styles.date)}>{Text.caseHandlingLogBook.dateMayHappened}</th>
                <th className={cn(styles.forceOnDuty)}>{Text.caseHandlingLogBook.nameOfTheCase}</th>
                <th className={cn(styles.caseName)}>{Text.caseHandlingLogBook.thePlaceWhereItHappened}</th>
                <th className={cn(styles.location)}>{Text.caseHandlingLogBook.content}</th>
                <th className={cn(styles.directiveInformation)}>
                  {Text.caseHandlingLogBook.acceptanceOfficer}
                </th>
                <th className={cn(styles.returns)}>{Text.caseHandlingLogBook.processingResults}</th>
                <th className={cn(styles.handOver)}>
                  {Text.caseHandlingLogBook.violatingImages}
                </th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {dataHandling.length > 0 && (
              <tbody>
                {dataHandling.map((data, index) => (
                  <tr key={index}>
                     {
                    totalPage == 0 && (
											<td onClick={() => handleEdit(data)} className={cn(styles.contentStt)}>
												{paginate === 1 ? index + 1 : index + 1 + 10 * (paginate - 1)}
											</td>
										)}
                    {
                    totalPage > 0 && (
											<td onClick={() => handleEdit(data)} className={cn(styles.contentStt)}>
												{paginate === 1 ? index + 1 : index + 1 + 10 * (paginate - 1)}
											</td>
										)}
										{totalPageSearch > 0 && (
											<td onClick={() => handleEdit(data)} className={cn(styles.contentStt)}>
												{paginateSearch === 1
													? index + 1
													: index + 1 + 10 * (paginateSearch - 1)}
											</td>
										)}
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentDateTime)}
                    >
                      {data?.DateViolation
                        ? formatDate(String(data.DateViolation))
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentCaseName)}
                    >
                      {data?.NameOfViolation
                        ? String(data.NameOfViolation)
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentStandingForce)}
                    >
                      {data?.AddressViolation
                        ? String(data.AddressViolation)
                        : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentNote)}
                    >
                      {data?.Content ? String(data.Content) : ""}
                    </td>
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentHandling)}
                    >
                      {data?.FullNamePolice ? String(data.FullNamePolice) : ""}
                    </td>{" "}
                    <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentContent)}
                    >
                      {data?.Result
                        ? String(data.Result)
                        : ""}
                    </td>
                    {/* <td
                      onClick={() => handleEdit(data)}
                      className={cn(styles.contentDirenformation)}
                    >
                      {data?.DirecInformation
                        ? String(data.Direnformation)
                        : ""}
                    </td> */}
                    <td
											className={cn(styles.contentImage)}
											onClick={(e) => {
												if (e.target.tagName === 'TD') handleEdit(data);
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
												<ImagesInTdTag images={images} showSlideImage={showSlideImage} />
											)}
										</td>
                    <td className={cn(styles.contentEditAndDelete)}>
                      {confirmDelete && (
                        <ModalConfirm
                          ariaHideApp={false}
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor="var(--shadow-color)"
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
            {dataHandling.length === 0 && !loading && <EmptyData colSpan={9} />}
            {loading && (
              <tbody>
                <tr>
                  <td colSpan={9} className={cn(styles.loadingArea)}>
                    <LoadingTable /></td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {dataHandling.length > 0 && totalPage > 1 && (
          <div className={cn(styles.pagination)}>
            <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
          </div>
        )}
        {dataHandling.length > 0 && totalPageSearch > 1 && (
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

export default memo(HandLing);
