import { checkIfEmptyValueExists } from "@/commonHandle";
import { ErrorMessages, SuccessMessages, Text, apiServer } from "@/constant";
import { uploadFiles, deleteFile } from '@/commonHandle';
import formatDate from "@/formatTime";
import BaseAxios from "@/store/setUpAxios";
import classNames from "classnames/bind";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { GoCloudUpload } from 'react-icons/go';
import ImagesInCreatedModal from '../../imagesInCreatedModal';
import styles from "./index.module.css";
import SlideImages from '../../slideImages';

const cx = classNames.bind(styles);

function ContentModalStatusBookDay({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [images, setImages] = useState([]);
	const [isShowSlideImages, setIsShowSlideImages] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataHandling = useSelector((state) => state.vehicleHandling.dataHandling);
  const [readOnly, setReadOnly] = useState(true);
  const [dateViolation, setDateViolation] = useState(
    formatDate(String(dataHandling?.dateViolation)) || ""
  );
  const [addressViolation, setAddressViolation] = useState(
    dataHandling?.addressViolation || ""
  );
  const [nameOfViolation, setNameOfViolation] = useState(
    dataHandling?.nameOfViolation || ""
  );
  const [content, setContent] = useState(dataHandling?.content || "");
  // const [directiveInformation, setDirectiveInformation] = useState(
  //   dataHandling?.directiveInformation || ""
  // );
  const [fullnamePolice, setFullnamePolice] = useState(
    dataHandling?.fullNamePolice || ""
  );
  // const [violatingImages, setViolatingImages] = useState(
  //   dataHandling?.violatingImages || ""
  // );
  const [result, setResult] = useState(
    dataHandling?.result || ""
  );

	const showSlideImage = (indexImage) => {
		setSelectedImageIndex(indexImage);
		setIsShowSlideImages(true);
	};

	const closeSlideImage = () => {
		setIsShowSlideImages(false);
	};

  // const [result, setResult] = useState(dataHandling?.result || "");
  console.log("dataHandling: ", dataHandling)
  useEffect(() => {
    if (dataHandling && dataHandling.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
  }, []);

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formateDateViolation = checkFormatDateBeforeSubmit(dateViolation);

    let dataCreateTracker = {
      dateViolation: formateDateViolation,
      addressViolation,
      nameOfViolation,
      content,
      fullnamePolice,
      // violatingImages,
      result
    };
    
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (!dateViolation) {
        const dateViolation = document.getElementById("dateViolation");
        dateViolation.style.border = Text.error.border;
      }
      if (addressViolation === "") {
        const addressViolation = document.getElementById("addressViolation");
        addressViolation.style.border = Text.error.border;
      }
      if (nameOfViolation === "") {
        const nameOfViolation = document.getElementById("nameOfViolation");
        nameOfViolation.style.border = Text.error.border;
      }

      if (content === "") {
        const content = document.getElementById("content");
        content.style.border = Text.error.border;
      }
      // if (directiveInformation === "") {
      //   const directiveInformation = document.getElementById(
      //     "directiveInformation"
      //   );
      //   directiveInformation.style.border = Text.error.border;
      // }
      if (fullnamePolice === "") {
        const fullnamePolice = document.getElementById("fullnamePolice");
        fullnamePolice.style.border = Text.error.border;
      }
      // if (violatingImages === "") {
      //   const violatingImages = document.getElementById("violatingImages");
      //   violatingImages.style.border = Text.error.border;
      // }
      if (result === "") {
        const result = document.getElementById("result");
        result.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.handling.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataHandling && dataHandling.id) {
        url = apiServer.handling.edit + dataHandling.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataHandling.id;
      }
      BaseAxios({
        method: "POST",
        url: url,
        data: dataCreateTracker,
      })
        .then((res) => {
          console.log("res url: ", url);
          console.log("res successful: ", res)
          toggleIsUpdateSuccess();
          successToast(successMessage);
          handleCloseModal();
        })
        .catch((err) => {
          console.log("Err: ", err)
          handleCloseModal();
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
          <div id="dateViolation" className={cx("formField", "errorBorder")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.caseHandlingLogBook.dateMayHappened}<span>* </span>
            </label>
            <div className={cx("groupDate")}>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("input", "date")}
                required
                type="date"
                value={dateViolation}
                onChange={(e) => {
                  const dateViolation =
                    document.getElementById("dateViolation");
                  dateViolation.style.borderColor = "var(--border-color)";
                  return setDateViolation(e.target.value);
                }}
              />
              {readOnly && <input
                className={cx("input", "date", `${textPlaceholder}`)}
                required
                type="text"
                value={formatDate(String(dateViolation))}
                onChange={(e) => setDate(formatDate(String(e.target.value)))}
                readOnly
              />}
            </div>
          </div>
          <div id="nameOfViolation" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.caseHandlingLogBook.nameOfTheCase}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={nameOfViolation}
              onChange={(e) => {
                const nameOfViolation =
                  document.getElementById("nameOfViolation");
                nameOfViolation.style.borderColor = "var(--border-color)";
                return setNameOfViolation(e.target.value);
              }}
            />
          </div>
        </div>

        <div className={cx("group")}>
          <div id="addressViolation" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.caseHandlingLogBook.thePlaceWhereItHappened}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={addressViolation}
              onChange={(e) => {
                const addressViolation =
                  document.getElementById("addressViolation");
                addressViolation.style.borderColor = "var(--border-color)";
                return setAddressViolation(e.target.value);
              }}
            />
          </div>
          <div id="fullnamePolice" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.caseHandlingLogBook.acceptanceOfficer}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={fullnamePolice}
              onChange={(e) => {
                const fullnamePolice =
                  document.getElementById("fullnamePolice");
                  fullnamePolice.style.borderColor = "var(--border-color)";
                return setFullnamePolice(e.target.value);
              }}
            />
          </div>
        </div>
        <div className={cx("group")}>
        <div
          id="content"
          // style={{ width: "100%", height: "32rem" }}
          className={cx("formField")}
        >
          <label className={cx("labelField")} htmlFor="">
            {Text.caseHandlingLogBook.content}<span>* </span>
          </label>
          <textarea
            onKeyDown={(e) => handleSubmitKeyDown(e)}
            readOnly={readOnly}
            className={cx("input")}
            required
            type="text"
            value={content}
            onChange={(e) => {
              const content = document.getElementById("content");
              content.style.borderColor = "var(--border-color)";
              return setContent(e.target.value);
            }}
          ></textarea>
        </div>
          <div id="result" className={cx("formField")}>
            <label className={cx("labelField")} htmlFor="">
              {Text.caseHandlingLogBook.processingResults}<span>* </span>
            </label>
            <input
              onKeyDown={(e) => handleSubmitKeyDown(e)}
              readOnly={readOnly}
              className={cx("input")}
              required
              type="text"
              value={result}
              onChange={(e) => {
                const result = document.getElementById(
                  "result"
                );
                result.style.borderColor = "var(--border-color)";
                return setResult(e.target.value);
              }}
            />
          </div>
        </div>
          <div className={cx("images")}>
          <div id="violatingImages"  className={cx("formField")}>
            <label style={{display: "flex", alignItems: "center"}} className={cx("labelField")} htmlFor="">
              {Text.caseHandlingLogBook.violatingImages}
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
        <span className={cx("validator")}>{Text.inputRequired}</span>
      </div>
      <div className={cx("groupBtn")}>
        <button onClick={handleCloseModal} className={cx("btnCancel")}>
          {Text.CRUD.cancel}
        </button>
        {!readOnly && (
          <button
            type="submit"
            className={cx("btnSubmit")}
            onClick={handleSubmit}
          >
            {Text.CRUD.end}
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
    </form>
    </>
  );
}

export default ContentModalStatusBookDay;
