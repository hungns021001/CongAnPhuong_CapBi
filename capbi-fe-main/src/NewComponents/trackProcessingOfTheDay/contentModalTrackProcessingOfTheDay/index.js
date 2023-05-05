import { checkIfEmptyValueExists } from "@/commonHandle";
import { ErrorMessages, SuccessMessages, Text, apiServer } from "@/constant";
import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import TextTheDay from "../text";
import styles from "./index.module.css";
import { GoCloudUpload } from "react-icons/go";
import SlideImages from "../../slideImages";
import { uploadFiles, deleteFile } from '@/commonHandle';
import ImagesInCreatedModal from "../../imagesInCreatedModal";


const cx = classNames.bind(styles);
function HandoverUnitModalTrackProcessingOfTheDay({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataHandlingOnDay = useSelector(
    (state) => state.vehicleHandlingOnDaySlice.dataHandlingOnDay
  );
  const [readOnly, setReadOnly] = useState(true);
  const [licensePlates, setLicensePlates] = useState(
    dataHandlingOnDay?.licensePlates || ""
  );
  const [addressOfViolation, setAddressOfViolation] = useState(
    dataHandlingOnDay?.addressOfViolation || ""
  );
  const [handoverUnit, setHandoverUnit] = useState(
    dataHandlingOnDay?.handoverUnit || ""
  );
  const [fullName, setFullName] = useState(dataHandlingOnDay?.fullName || "");
  const [custody, setCustody] = useState(dataHandlingOnDay?.custody || "");
  // const [picture, setPicture] = useState(dataHandlingOnDay?.picture || "");
  const [receiver, setReceiver] = useState(dataHandlingOnDay?.receiver || "");
  const [amount, setAmount] = useState(dataHandlingOnDay?.amount || "");
  const [result, setResult] = useState(dataHandlingOnDay?.result || "");
  const [violation, setViolation] = useState(
    dataHandlingOnDay?.violation || ""
  );
	const [images, setImages] = useState([]);
	const [isShowSlideImages, setIsShowSlideImages] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    if (dataHandlingOnDay && dataHandlingOnDay.id)
      setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus();
  }, []);

  const resetInputsModal = () => {
    setLicensePlates("");
    setDateOfViolation("");
    setAddressOfViolation("");
    setViolation("");
    setFullName("");
    setCustody("");
    setHandoverUnit("");
    setReceiver("");
    setAmount("");
    setResult("");
    // setPicture("");
  };

  const [dateOfViolation, setDateOfViolation] = useState(
    formatDate(String(dataHandlingOnDay.dateOfViolation)) || ""
  );

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formateDate = checkFormatDateBeforeSubmit(dateOfViolation);
    let dataCreateTracker = {
      licensePlates,
      dateOfViolation: formateDate,
      addressOfViolation,
      violation,
      fullName,
      custody,
      handoverUnit,
      receiver,
      amount,
      result,
      // picture,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (licensePlates === "") {
        const licensePlates = document.getElementById("licensePlates");
        licensePlates.style.border = Text.error.border;
      }
      if (!dateOfViolation) {
        const dateOfViolation = document.getElementById("dateOfViolation");
        dateOfViolation.style.border = Text.error.border;
      }
      if (addressOfViolation === "") {
        const addressOfViolation =
          document.getElementById("addressOfViolation");
        addressOfViolation.style.border = Text.error.border;
      }
      if (violation === "") {
        const violation = document.getElementById("violation");
        violation.style.border = Text.error.border;
      }
      if (fullName === "") {
        const fullName = document.getElementById("fullName");
        fullName.style.border = Text.error.border;
      }
      if (custody === "") {
        const custody = document.getElementById("custody");
        custody.style.border = Text.error.border;
      }
      if (handoverUnit === "") {
        const handoverUnit = document.getElementById("handoverUnit");
        handoverUnit.style.border = Text.error.border;
      }
      if (receiver === "") {
        const receiver = document.getElementById("receiver");
        receiver.style.border = Text.error.border;
      }
      if (amount === "") {
        const amount = document.getElementById("amount");
        amount.style.border = Text.error.border;
      }
      // if (picture === "") {
      //   const picture = document.getElementById("picture");
      //   picture.style.border = Text.error.border;
      // }
      if (result === "") {
        const result = document.getElementById("result");
        result.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.handlingonDay.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataHandlingOnDay && dataHandlingOnDay.id) {
        url = apiServer.handlingonDay.edit + dataHandlingOnDay.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataHandlingOnDay.id;
      }
      BaseAxios({
        method: "POST",
        url: url,
        data: dataCreateTracker,
      })
        .then(() => {
          toggleIsUpdateSuccess();
          successToast(successMessage);
          resetInputsModal();
          handleCloseModal();
        })
        .catch(() => {
          error(errorMessage);
        })
        .catch((err) => {
          if (
            err?.response?.data?.data ===
            "Currently you do not have permission to edit"
          ) {
            notifyError("Hiện tại bạn không có quyền chỉnh sửa");
            handleCloseModal();
          }
        });
    }
  };
  const handleSubmitKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
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
			Text.uploadFromModal,
		);
		if (imageFiles && imageFiles.length > 0) setImages(imageFiles);
	};

  const showSlideImage = (indexImage) => {
		setSelectedImageIndex(indexImage);
		setIsShowSlideImages(true);
	};

	const closeSlideImage = () => {
		setIsShowSlideImages(false);
	};

	const deleteImage = (index) => {
		let newImages = deleteFile(images, index);
		setImages(newImages);
	};
  return (
    <>
    {isShowSlideImages && (
				<SlideImages
					images={images}
					selectedImageIndex={selectedImageIndex}
					closeSlideImage={closeSlideImage}
				/>
			)}
      <form
        className={readOnly ? cx("bodyForm", "readOnlyStyle") : cx("bodyForm")}
      >
        <div className={cx("inputArea")}>
          <div className={cx("group")}>
            <div
              id="dateOfViolation"
              className={cx("formField", "errorBorder")}
            >
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.dateOfViolation}
                <span>* </span>
              </label>
              <div className={cx("groupDate")}>
                <input
                  onKeyDown={(e) => handleSubmitKeyDown(e)}
                  ref={inputRef}
                  readOnly={readOnly}
                  className={cx("input", "date")}
                  required
                  type="date"
                  value={dateOfViolation}
                  onChange={(e) => {
                    const dateOfViolation =
                      document.getElementById("dateOfViolation");
                    dateOfViolation.style.borderColor = "var(--border-color)";
                    return setDateOfViolation(e.target.value);
                  }}
                />
                {readOnly && (
                  <input
                    className={cx("input", "date", `${textPlaceholder}`)}
                    required
                    type="text"
                    value={formatDate(String(dateOfViolation))}
                    onChange={(e) =>
                      setDate(formatDate(String(e.target.value)))
                    }
                    readOnly
                  />
                )}
              </div>
            </div>
            <div id="licensePlates" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.licensePlates}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={licensePlates}
                onChange={(e) => {
                  const licensePlates =
                    document.getElementById("licensePlates");
                  licensePlates.style.borderColor = "var(--border-color)";
                  return setLicensePlates(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("group")}>
            <div id="addressOfViolation" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.addressOfViolation}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={addressOfViolation}
                onChange={(e) => {
                  const addressOfViolation =
                    document.getElementById("addressOfViolation");
                  addressOfViolation.style.borderColor = "var(--border-color)";
                  return setAddressOfViolation(e.target.value);
                }}
              />
            </div>
            <div id="violation" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.violation}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={violation}
                onChange={(e) => {
                  const violation = document.getElementById("violation");
                  violation.style.borderColor = "var(--border-color)";
                  return setViolation(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("group")}>
            <div id="fullName" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.fullName}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={fullName}
                onChange={(e) => {
                  const fullName = document.getElementById("fullName");
                  fullName.style.borderColor = "var(--border-color)";
                  return setFullName(e.target.value);
                }}
              />
            </div>
            <div id="custody" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.custody}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={custody}
                onChange={(e) => {
                  const custody = document.getElementById("custody");
                  custody.style.borderColor = "var(--border-color)";
                  return setCustody(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("group")}>
            <div id="receiver" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.receiver}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={receiver}
                onChange={(e) => {
                  const receiver = document.getElementById("receiver");
                  receiver.style.borderColor = "var(--border-color)";
                  return setReceiver(e.target.value);
                }}
              />
            </div>
            <div id="amount" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.amount}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={amount}
                onChange={(e) => {
                  const amount = document.getElementById("amount");
                  amount.style.borderColor = "var(--border-color)";
                  return setAmount(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("group")}>
            <div id="handoverUnit" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.handoverUnit}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                style={{ padding: "1.7rem" }}
                type="text"
                value={handoverUnit}
                onChange={(e) => {
                  const handoverUnit = document.getElementById("handoverUnit");
                  handoverUnit.style.borderColor = "var(--border-color)";
                  return setHandoverUnit(e.target.value);
                }}
              />
            </div>
            <div id="result" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {TextTheDay.trackProcessingOfTheDay.result}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input")}
                required
                type="text"
                value={result}
                onChange={(e) => {
                  const result = document.getElementById("result");
                  result.style.borderColor = "var(--border-color)";
                  return setResult(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx('images')}>
						<div className={cx('formField')}>
							<label className={cx('labelImg')} htmlFor="">
								{Text.image}
								<GoCloudUpload
									title={Text.uploadImages}
									className={cx('iconUploadImages')}
									onClick={(e) => handleImagesUpload(e)}
								/>
								<input
									type="file"
									className={cx('hiddenInputUploadImages')}
									ref={inputRefOfIconUpload}
									onChange={(e) => handleFilesSelect(e)}
									multiple
								/>
							</label>
							<ImagesInCreatedModal
								images={images}
								deleteImage={deleteImage}
								showSlideImage={showSlideImage}
							/>
						</div>
					</div>
        </div>

        <div className={cx("group")}>
          <span className={cx("validator")}>{TextTheDay.inputRequired}</span>
        </div>
        <div className={cx("groupBtn")}>
          <div className={cx("setButton")}>
            <button onClick={handleCloseModal} className={cx("btnCancel")}>
              {Text.CRUD.cancel}
            </button>
            {!readOnly && (
              <button
                type="submit"
                className={cx("btnSubmit")}
                onClick={handleSubmit}
              >
                Xong
              </button>
            )}
            {readOnly && (
              <button
                onClick={() => setReadOnly(false)}
                className={cx("btnSubmit")}
              >
                {descTitle}
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default HandoverUnitModalTrackProcessingOfTheDay;
