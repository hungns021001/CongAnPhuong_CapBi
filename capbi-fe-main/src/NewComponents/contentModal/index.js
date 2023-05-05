import formatDate from '@/formatTime';
import BaseAxios from '@/store/setUpAxios';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { GoCloudUpload } from 'react-icons/go';
import { checkIfEmptyValueExists } from '../../commonHandle';
import { ErrorMessages, SuccessMessages, Text, apiServer } from '../../constant';
import { uploadFiles, deleteFile } from '@/commonHandle';
import ImagesInCreatedModal from '../imagesInCreatedModal';
import styles from './index.module.css';
import SlideImages from '../slideImages';

const cx = classNames.bind(styles);

function ContentModal({ handleCloseModal, toggleIsUpdateSuccess, descTitle, addEvent, successToast, errorToast }) {
	const [textPlaceholder, setTextPlaceholder] = useState('textPlaceholder');
	const dataMain = useSelector((state) => state.vehicleAccreditationSlice.dataMain);
	const [readOnly, setReadOnly] = useState(true);
	const [dateSend, setDateSend] = useState(formatDate(String(dataMain.dateSend)) || '');
	const [licensePlates, setLicensePlates] = useState(dataMain?.licensePlates || '');
	const [receiver, setReceiver] = useState(dataMain?.receiver || '');
	const [finePaymentDate, setFinePaymentDate] = useState(formatDate(String(dataMain?.finePaymentDate)) || '');
	const [violation, setViolation] = useState(dataMain?.violation || '');
	const [images, setImages] = useState([]);
	const [isShowSlideImages, setIsShowSlideImages] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);

	const showSlideImage = (indexImage) => {
		setSelectedImageIndex(indexImage);
		setIsShowSlideImages(true);
	};

	const closeSlideImage = () => {
		setIsShowSlideImages(false);
	};

	useEffect(() => {
		if (dataMain && dataMain.id) setTextPlaceholder('dateText');
		if (addEvent) setReadOnly(false);
		inputRef.current.focus();
	}, []);

	const inputRef = useRef();

	const resetInputsModal = () => {
		setDateSend('');
		setLicensePlates('');
		setReceiver('');
		setFinePaymentDate('');
		setViolation('');
		setTextPlaceholder('textPlaceholder');
	};

	const checkFormatDateBeforeSubmit = (date) => {
		if (String(date).slice(0, 3).includes('-') === false) date = formatDate(String(date));

		return date;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let formatedDateSend = checkFormatDateBeforeSubmit(dateSend);
		let formatedFinePaymentDate = checkFormatDateBeforeSubmit(finePaymentDate);
		let dataCreateTracker = {
			dateSend: formatedDateSend,
			licensePlates,
			receiver,
			finePaymentDate: formatedFinePaymentDate,
			violation,
		};
		let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);

		if (isExitsEmptyData) {
			if (!dateSend) {
				const dateSend = document.getElementById('sentDay');
				dateSend.style.border = Text.error.border;
			}
			if (licensePlates === '') {
				const licensePlates = document.getElementById('licensePlates');
				licensePlates.style.border = Text.error.border;
			}
			if (receiver === '') {
				const receiver = document.getElementById('receiver');
				receiver.style.border = Text.error.border;
			}
			if (!finePaymentDate) {
				const finePaymentDate = document.getElementById('penaltyPaymentDate');
				finePaymentDate.style.border = Text.error.border;
			}
			if (violation === '') {
				const violation = document.getElementById('violation');
				violation.style.border = Text.error.border;
			}
		} else {
			let url = apiServer.accreditation.create;
			let errorMessage = ErrorMessages.create;
			let successMessage = SuccessMessages.create;
			if (dataMain && dataMain.id) {
				url = apiServer.accreditation.edit + dataMain.id;
				successMessage = SuccessMessages.edit;
				errorMessage = ErrorMessages.edit;
				dataCreateTracker.id = dataMain.id;
			}
			BaseAxios({
				method: 'POST',
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
					if (err.response.data.data === 'Currently you do not have permission to edit') {
						notifyError('Hiện tại bạn không có quyền chỉnh sửa');
						handleCloseModal();
					} else {
						notifyError('Có lỗi xảy ra,vui lòng thử lại');
						handleCloseModal();
					}
				});
		}
	};

	const handleSubmitKeyDown = (e) => {
		if (e.keyCode === 13) handleSubmit(e);
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
			<form className={readOnly ? cx('bodyForm', 'readOnlyStyle') : cx('bodyForm')}>
				<div className={cx('inputArea')}>
					<div className={cx('groupDays')}>
						<div id="sentDay" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.sentDate}
								<span>* </span>
							</label>
							<div className={cx('groupDate')}>
								<input
									ref={inputRef}
									readOnly={readOnly}
									className={cx('inputField', 'date')}
									required
									type="date"
									pattern="^\d{1,2}\/\d{1,2}\/\d{4}$"
									value={dateSend}
									onChange={(e) => {
										const dateSend = document.getElementById('sentDay');
										dateSend.style.borderColor = 'var(--border-color)';
										return setDateSend(e.target.value);
									}}
								/>
								{readOnly && (
									<input
										className={cx('inputField', 'date', `${textPlaceholder}`)}
										required
										type="text"
										value={formatDate(String(dateSend))}
										onChange={(e) => setDateSend(formatDate(String(e.target.value)))}
										readOnly
									/>
								)}
							</div>
						</div>
						<div id="penaltyPaymentDate" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.dateOfPaymentFfFines}
								<span>* </span>
							</label>
							<div className={cx('groupDate')}>
								<input
									readOnly={readOnly}
									className={cx('inputField', 'date')}
									required
									type="date"
									value={finePaymentDate}
									onChange={(e) => {
										const penaltyPaymentDate = document.getElementById('penaltyPaymentDate');
										penaltyPaymentDate.style.borderColor = 'var(--border-color)';
										return setFinePaymentDate(e.target.value);
									}}
								/>
								{readOnly && (
									<input
										className={cx('inputField', 'date', `${textPlaceholder}`)}
										required
										type="text"
										value={formatDate(String(finePaymentDate))}
										onChange={(e) => setFinePaymentDate(formatDate(String(e.target.value)))}
										readOnly
									/>
								)}
							</div>
						</div>
					</div>
					<div className={cx('finedPersonInfo')}>
						<div id="licensePlates" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.licensePlates}
								<span>* </span>
							</label>
							<input
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={licensePlates}
								onChange={(e) => {
									const licensePlates = document.getElementById('licensePlates');
									licensePlates.style.borderColor = 'var(--border-color)';
									return setLicensePlates(e.target.value);
								}}
							/>
						</div>
						<div id="receiver" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.receiver}
								<span>* </span>
							</label>
							<input
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={receiver}
								onChange={(e) => {
									const receiver = document.getElementById('receiver');
									receiver.style.borderColor = 'var(--border-color)';
									return setReceiver(e.target.value);
								}}
							/>
						</div>
					</div>
					<div id="violation" className={cx('violation')}>
						<div className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.violationError}
								<span>* </span>
							</label>
							<textarea
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={violation}
								onChange={(e) => {
									const violation = document.getElementById('violation');
									violation.style.borderColor = 'var(--border-color)';
									return setViolation(e.target.value);
								}}
							></textarea>
						</div>
					</div>
					<div className={cx('images')}>
						<div className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
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
				<div className={cx('groupBtn')}>
					<div id="staffReceive" className={cx('noteModal')}>
						<span>{Text.inputRequired}</span>
					</div>
					<div className={cx('setButton')}>
						<button onClick={handleCloseModal} className={cx('btnCancel')}>
							{Text.CRUD.cancel}
						</button>
						{!readOnly && (
							<button type="submit" className={cx('btnSubmit')} onClick={handleSubmit}>
								Xong
							</button>
						)}
						{readOnly && (
							<button onClick={() => setReadOnly(false)} className={cx('btnSubmit')}>
								{descTitle}
							</button>
						)}
					</div>
				</div>
			</form>
		</>
	);
}

export default ContentModal;
