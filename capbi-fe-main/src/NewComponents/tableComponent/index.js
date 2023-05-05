import formatDate from '@/formatTime';
import BaseAxios from '@/store/setUpAxios';
import cn from 'classnames';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiSearchAlt2 } from 'react-icons/bi';
import { GoCloudUpload } from 'react-icons/go';
import React, { useState, useEffect, useRef } from 'react';
import { BsCloudDownload } from 'react-icons/bs';
import styles from './index.module.css';
import ContentModal from '../contentModal';
import Modal from '../newModal';
import PaginatedItems from '../../components/pagination';
import { Text, apiServer, SuccessMessages, ErrorMessages } from '../../constant';
import { useDispatch } from 'react-redux';
import { getData } from '@/store/vehicleAccreditation';
import EmptyData from '../emptyData';
import LoadingTable from '../loadingTable';
import ModalConfirm from '../modalConfirm';
import { notifySuccess, notifyError } from '../../notify';
import { ToastContainer } from 'react-toastify';
import ImagesInTdTag from '../imagesInTdTag';
import { uploadFiles } from '@/commonHandle';
import SlideImages from '../slideImages';

let idDelete;

function TableComponent() {
	const [startExport, setStartExport] = useState('');
	const [endExport, setEndExport] = useState('');
	const [openAdd, setOpenAdd] = useState(false);
	const [mainData, setMainData] = useState([]);
	const [paginate, setPaginate] = useState(1);
	const [paginateSearch, setPaginateSearch] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const [totalPageSearch, setTotalPageSearch] = useState(0);
	const [searchValue, setSearchValue] = useState('');
	const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
	const [loading, setLoading] = useState(true);
	const [desc, setDesc] = useState('');
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [fieldSearch, setFieldSearch] = useState('');
	const [addEvent, setAddEvent] = useState(false);
	const dispatch = useDispatch();
	const [searchLoading, setSearchLoading] = useState(true);
	const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
	const handleShowModal = (e) => {
		setAddEvent(true);
		setDesc('Thêm');
		setOpenAdd(true);
	};

	const [noPreventCallApiAgain, setNoPreventCallApiAgain] = useState(false);
	const [images, setImages] = useState([]);
	const [isShowSlideImages, setIsShowSlideImages] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);

	useEffect(() => {
		if (searchValue === '') {
			if (noPreventCallApiAgain) {
				BaseAxios({
					method: 'POST',
					url: '/api/accreditation/get-accreditation',
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

	const showSlideImage = (indexImage) => {
		setSelectedImageIndex(indexImage);
		setIsShowSlideImages(true);
	};

	const closeSlideImage = () => {
		setIsShowSlideImages(false);
	};

	useEffect(() => {
		if (searchValue === '') {
			if (noPreventCallApiAgain) {
				BaseAxios({
					method: 'POST',
					url: '/api/accreditation/get-accreditation',
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
	}, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain]);

	const handleDeleteClick = (id) => {
		const params = { id };
		BaseAxios({
			method: 'POST',
			url: apiServer.accreditation.delete + id,
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
		setDesc('Sửa');
		dispatch(getData(data));
		setOpenAdd(true);
	};

	const callApiSearch = () => {
		const myObject = {};
		myObject[fieldSearch] = searchValue;
		BaseAxios({
			url: `api/accreditation/show`,
			data: myObject,
			method: 'POST',
			params: {
				page: paginateSearch,
			},
		})
			.then((trackers) => {
				setMainData(trackers?.data?.data?.list_data);
				setTotalPageSearch(trackers?.data?.data?.totalPage);
				setPaginate(2);
				setTotalPage(0);
			})
			.catch(() => {
				alert(ErrorMessages.search.noMatchingResults);
			});
	};

	const handleSearch = () => {
		setPaginate(1);
		setPaginateSearch(1);
		if (searchValue.trim() === '') {
			toggleIsUpdateSuccess();
			setSearchValue('');
		} else {
			callApiSearch();
		}
	};

	const handleExportInformation = () => {
		const timeExport = {
			startDate: startExport,
			endDate: endExport,
		};
		BaseAxios({
			url: 'api/accreditation/exports',
			method: 'POST',
			responseType: 'blob',
		})
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `${Date.now()}.xlsx`);
				document.body.appendChild(link);
				link.click();
				notifySuccess('Đã tải xuống file');
			})
			.catch(() => {
				notifyError('Có lỗi xảy ra,vui lòng thử lại');
			});
		setStartExport('');
		setEndExport('');
	};

	// const inputRefOfIconUpload = useRef(null);

	// const handleImagesUpload = (e) => {
	// 	e.stopPropagation();
	// 	if (inputRefOfIconUpload && inputRefOfIconUpload.current) inputRefOfIconUpload.current.click();
	// };

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

	const handleClose = () => {
		const resetData = {
			Id: '',
			DateSend: '',
			LicensePlates: '',
			Receiver: '',
			FinePaymentDate: '',
			Violation: '',
		};
		setOpenAdd(false);
		dispatch(getData(resetData));
		setAddEvent(false);
	};

	return (
		<div className={cn(styles.wrapper)}>
			<ToastContainer />
			{openAdd && (
				<Modal handleCloseModal={handleClose}>
					<ContentModal
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
					<h2>Sổ theo dõi gửi kiểm định</h2>
				</div>
				<div className={cn(styles.searchAndAddMobile)}>
					<div className={cn(styles.groupBtnLeft)}>
						<div className={cn(styles.export)}>
							<div className={cn(styles.addnew)} onClick={handleExportInformation}>
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
								<option className={cn(styles.option)} value="dateSend">
									{Text.titleCell.sentDay}
								</option>
								<option value="licensePlates">{Text.titleCell.licensePlates}</option>
								<option value="violation">{Text.titleCell.violation}</option>
								<option value="receiver">{Text.titleCell.receiver}</option>
								<option value="finePaymentDate">{Text.titleCell.penaltyPaymentDate}</option>
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
								<th className={cn(styles.stt)}>{'STT'}</th>
								<th className={cn(styles.sentDay)}>{'Ngày tháng gửi'}</th>
								<th className={cn(styles.licensePlates)}>{'Biển kiểm soát'}</th>
								<th className={cn(styles.receiver)}>{'Người nhận'}</th>
								<th className={cn(styles.penaltyPaymentDate)}>{'Ngày tháng nộp phạt'}</th>
								<th className={cn(styles.violation)}>{'Lỗi vi phạm'}</th>
								<th className={cn(styles.image)}>{Text.image}</th>
								<th className={cn(styles.editAndDelete)}></th>
							</tr>
						</thead>
						{mainData.length > 0 && (
							<tbody>
								{mainData.map((data, index) => (
									<tr key={index}>
										{totalPage > 0 && (
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
										<td onClick={() => handleEdit(data)} className={cn(styles.contentSentDay)}>
											{data?.DateSend ? formatDate(String(data.DateSend)) : ''}
										</td>
										<td
											onClick={() => handleEdit(data)}
											className={cn(styles.contentLicensePlates)}
										>
											{data?.LicensePlates ? String(data.LicensePlates) : ''}
										</td>
										<td onClick={() => handleEdit(data)} className={cn(styles.contentReveiver)}>
											{data?.Receiver ? String(data.Receiver) : ''}
										</td>
										<td
											onClick={() => handleEdit(data)}
											className={cn(styles.contentPenaltyPaymentDate)}
										>
											{data?.FinePaymentDate ? formatDate(String(data.FinePaymentDate)) : ''}
										</td>
										<td onClick={() => handleEdit(data)} className={cn(styles.contentViolation)}>
											{data?.Violation ? String(data.Violation) : ''}
										</td>
										<td
											className={cn(styles.contentImage)}
											onClick={(e) => {
												if (e.target.tagName === 'TD') handleEdit(data);
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
												<ImagesInTdTag images={images} showSlideImage={showSlideImage} />
											)}
										</td>
										<td className={cn(styles.contentEditAndDelete)}>
											{confirmDelete && (
												<ModalConfirm
													submitDelete={() => handleDeleteClick(idDelete)}
													backgroundColor="rgba(3, 3, 3, 0.1)"
													description="Bạn có chắc muốn xóa thông tin này ? "
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
						{mainData.length === 0 && !loading && <EmptyData colSpan={7} />}
						{loading && (
							<tbody>
								<tr>
									<td colSpan={7} className={cn(styles.loadingArea)}>
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
						<PaginatedItems setPaginate={setPaginateSearch} totalPage={totalPageSearch} />
					</div>
				)}
			</div>
		</div>
	);
}

export default TableComponent;
