import styles from "./style.module.css";
import {
  Text,
  apiServer,
  SuccessMessages,
  ErrorMessages,
} from "../../constant";
import { checkIfEmptyValueExists } from "../../commonHandle";
import { useEffect, useRef, useState } from "react";
import BaseAxios from "@/store/setUpAxios";
import { useSelector } from "react-redux";
import formatDate from "@/formatTime";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import { notifyError } from "@/notify";
import { uploadFiles, deleteFile } from "@/commonHandle";
import ImagesInCreatedModal from "../imagesInCreatedModal";
import SlideImages from "../slideImages";
import { GoCloudUpload } from "react-icons/go";

const cx = classNames.bind(styles);

function LogModal({
  handleCloseModal,
  toggleIsUpdateSuccess,
  descTitle,
  addEvent,
  successToast,
  errorToast,
}) {
  const [textPlaceholder, setTextPlaceholder] = useState("textPlaceholder");
  const dataMain = useSelector((state) => state.vehicleSanctions.dataMain);
  const [readOnly, setReadOnly] = useState(true);
  const [decisionId, setDecisionId] = useState(
    formatDate(String(dataMain?.decisionId)) || ""
  );
  const [fullName, setFullName] = useState(dataMain?.fullName || "");
  const [birthday, setBirthday] = useState(
    formatDate(String(dataMain?.birthday)) || ""
  );
  const [staying, setStaying] = useState(dataMain?.staying || "");
  const [nation, setNation] = useState(dataMain?.nation || "");
  const [country, setCountry] = useState(dataMain?.country || "");
  const [job, setJob] = useState(dataMain?.job || "");
  const [content, setContent] = useState(dataMain?.content || "");
  const [punisher, setPunisher] = useState(dataMain?.punisher || "");
  const [processingForm, setProcessingForm] = useState(
    dataMain?.processingForm || ""
  );
  const [fullnamePolice, setFullnamePolice] = useState(
    dataMain?.fullnamePolice || ""
  );
  const [images, setImages] = useState([]);
  const [isShowSlideImages, setIsShowSlideImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const inputRef = useRef();

  const showSlideImage = (indexImage) => {
    setSelectedImageIndex(indexImage);
    setIsShowSlideImages(true);
  };

  const closeSlideImage = () => {
    setIsShowSlideImages(false);
  };
  useEffect(() => {
    if (dataMain && dataMain.id) setTextPlaceholder("dateText");
    if (addEvent) setReadOnly(false);
    inputRef.current.focus();
  }, []);

  const resetInputsModal = () => {
    setDecisionId("");
    setFullName("");
    setBirthday("");
    setStaying("");
    setNation("");
    setCountry("");
    setJob("");
    setContent("");
    setPunisher("");
    setProcessingForm("");
    setFullnamePolice("");
    setTextPlaceholder("textPlaceholder");
  };

  const checkFormatDateBeforeSubmit = (date) => {
    if (String(date).slice(0, 3).includes("-") === false)
      date = formatDate(String(date));
    return date;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formateddecisionId = checkFormatDateBeforeSubmit(decisionId);
    let formatedbirthday = checkFormatDateBeforeSubmit(birthday);
    let dataCreateTracker = {
      decisionId: formateddecisionId,
      fullName,
      birthday: formatedbirthday,
      staying,
      nation,
      country,
      job,
      content,
      punisher,
      processingForm,
      fullnamePolice,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);
    if (isExitsEmptyData) {
      if (decisionId === "") {
        const decisionId = document.getElementById("decisionId");
        decisionId.style.border = Text.error.border;
      }
      if (fullName === "") {
        const fullName = document.getElementById("fullName");
        fullName.style.border = Text.error.border;
      }
      if (birthday === "") {
        const birthday = document.getElementById("birthday");
        birthday.style.border = Text.error.border;
      }
      if (staying === "") {
        const staying = document.getElementById("staying");
        staying.style.border = Text.error.border;
      }
      if (nation === "") {
        const nation = document.getElementById("nation");
        nation.style.border = Text.error.border;
      }
      if (country === "") {
        const country = document.getElementById("country");
        country.style.border = Text.error.border;
      }
      if (job === "") {
        const job = document.getElementById("job");
        job.style.border = Text.error.border;
      }
      if (content === "") {
        const content = document.getElementById("content");
        content.style.border = Text.error.border;
        content.style.borderRadius = Text.error.borderRadius;
      }
      if (punisher === "") {
        const punisher = document.getElementById("punisher");
        punisher.style.border = Text.error.border;
      }
      if (processingForm === "") {
        const processingForm = document.getElementById("processingForm");
        processingForm.style.border = Text.error.border;
      }
      if (fullnamePolice === "") {
        const fullnamePolice = document.getElementById("fullnamePolice");
        fullnamePolice.style.border = Text.error.border;
      }
    } else {
      let url = apiServer.sanctions.create;
      let errorMessage = ErrorMessages.create;
      let successMessage = SuccessMessages.create;
      if (dataMain && dataMain.id) {
        url = apiServer.sanctions.edit + dataMain.id;
        successMessage = SuccessMessages.edit;
        errorMessage = ErrorMessages.edit;
        dataCreateTracker.id = dataMain.id;
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
        .catch((err) => {
          console.log(err);
          if (
            err.response.data.message ===
            "Currently you do not have permission to edit"
          ) {
            notifyError("Hiện tại bạn không có quyền chỉnh sửa");
            handleCloseModal();
          }
          if (err.response.data.message === "Editing time has passed.") {
            notifyError("Đã vượt quá thời hạn chỉnh sửa");
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
      Text.uploadFromModal
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
          <div className={cx("groupDays")}>
            {/* <div id="decisionId" className={cx("formField", "errorBorder")}>
                    <label className={cx("labelField")} htmlFor="">
                        {Text.titlelogbook.decisionId} <span>* </span>
                    </label>
                    <div className={cx("groupDate")}>
                        <input
                            readOnly={readOnly}
                            className={cx("inputField", "date")}
                            required
                            type="text"
                            placeholder={Text.placeHolder.dataLog.decisionId}
                            value={decisionId}
                            onChange={(e) => {
                                const decisionId = document.getElementById("decisionId");
                                decisionId.style.borderColor = "var(--border-color)";
                                return setDecisionId(e.target.value);
                            }}
                        />
                    </div>
                </div> */}
            <div id="decisionId" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.decisionId}
                <span>* </span>
              </label>
              <input
                ref={inputRef}
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                type="text"
                value={decisionId}
                onChange={(e) => {
                  const decisionId = document.getElementById("decisionId");
                  decisionId.style.borderColor = "var(--border-color)";
                  return setDecisionId(e.target.value);
                }}
              />
            </div>
            <div id="fullName" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.fullName}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
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
          </div>
          <div className={cx("finedPersonInfo")}>
            <div id="birthday" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.birthday}
                <span>* </span>
              </label>
              <div className={cx("groupDate")}>
                <input
                  onKeyDown={(e) => handleSubmitKeyDown(e)}
                  readOnly={readOnly}
                  className={cx("inputField", "date")}
                  required
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    const birthday = document.getElementById("birthday");
                    birthday.style.borderColor = "var(--border-color)";
                    return setBirthday(e.target.value);
                  }}
                />
                {readOnly && (
                  <input
                    className={cx("inputField", "date", `${textPlaceholder}`)}
                    required
                    type="text"
                    value={formatDate(String(birthday))}
                    onChange={(e) =>
                      setBirthday(formatDate(String(e.target.value)))
                    }
                    readOnly
                  />
                )}
              </div>
            </div>
            <div id="staying" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.staying}
                <span>* </span>
              </label>
              <div className={cx("groupDate")}>
                <input
                  readOnly={readOnly}
                  className={cx("inputField", "date")}
                  required
                  type="text"
                  onKeyDown={(e) => handleSubmitKeyDown(e)}
                  value={staying}
                  onChange={(e) => {
                    const staying = document.getElementById("staying");
                    staying.style.borderColor = "var(--border-color)";
                    return setStaying(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className={cx("text_1")}>
            <div id="nation" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.nation}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                type="text"
                value={nation}
                onChange={(e) => {
                  const nation = document.getElementById("nation");
                  nation.style.borderColor = "var(--border-color)";
                  return setNation(e.target.value);
                }}
              ></input>
            </div>
            <div id="country" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.country}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                type="text"
                value={country}
                onChange={(e) => {
                  const country = document.getElementById("country");
                  country.style.borderColor = "var(--border-color)";
                  return setCountry(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("text_1")}>
            <div id="job" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.job}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                type="text"
                value={job}
                onChange={(e) => {
                  const job = document.getElementById("job");
                  job.style.borderColor = "var(--border-color)";
                  return setJob(e.target.value);
                }}
              />
            </div>
            <div id="processingForm" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.processingForm}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                type="text"
                value={processingForm}
                onChange={(e) => {
                  const processingForm =
                    document.getElementById("processingForm");
                  processingForm.style.borderColor = "var(--border-color)";
                  return setProcessingForm(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("text_1")}>
            <div id="punisher" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.punisher}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
                required
                type="text"
                value={punisher}
                onChange={(e) => {
                  const punisher = document.getElementById("punisher");
                  punisher.style.borderColor = "var(--border-color)";
                  return setPunisher(e.target.value);
                }}
              />
            </div>
            <div id="fullnamePolice" className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.fullnamePolice}
                <span>* </span>
              </label>
              <input
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("inputField")}
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
          <div id="content" className={cx("content")}>
            <div className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.titlelogbook.content}
                <span>* </span>
              </label>
              <textarea
                onKeyDown={(e) => handleSubmitKeyDown(e)}
                readOnly={readOnly}
                className={cx("textareaField")}
                required
                type="text"
                value={content}
                onChange={(e) => {
                  const content = document.getElementById("content");
                  content.style.borderColor = "var(--border-color)";
                  return setContent(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("images")}>
            <div className={cx("formField")}>
              <label className={cx("labelField")} htmlFor="">
                {Text.image}
                <GoCloudUpload
                  title={Text.uploadImages}
                  className={cx("iconUploadImages")}
                  onClick={(e) => handleImagesUpload(e)}
                />
                <input
                  type="file"
                  className={cx("hiddenInputUploadImages")}
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
        <div className={cx("groupBtn")}>
          <div className={cx("setText")}>
            <span className={cx("validatorText")}>{Text.inputRequired}</span>
          </div>
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

export default LogModal;
