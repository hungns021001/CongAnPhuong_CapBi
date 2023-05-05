import EmptyData from "@/NewComponents/emptyData";
import LoadingTable from "@/NewComponents/loadingTable";
import ModalConfirm from "@/NewComponents/modalConfirm";
import Modal from "@/NewComponents/newModal";
import formatDate from "@/formatTime";
import { getData } from "@/store/custodyFolowSlice";
import BaseAxios from "@/store/setUpAxios";
import cn from "classnames";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsCloudDownload } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import PaginatedItems from "../../components/pagination";
import { ErrorMessages, SuccessMessages, Text } from "../../constant";
import { notifyError, notifySuccess } from "../../notify";
import ContentModal from "./contentModal";
import styles from "./index.module.css";

let idDelete;

function CustodyFolowBook() {
    const [startExport, setStartExport] = useState("")
    const [endExport, setEndExport] = useState("")
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
    const [fieldSearch, setFieldSearch] = useState("")
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
                    url: "api/impound/get-impound",
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
        setSearchLoading(true)
    }, [isUpdatedSuccess, paginate, paginateSearch, noPreventCallApiAgain, searchLoading]);

    const handleDeleteClick = (id) => {
        const params = { id };
        BaseAxios({
            method: "POST",
            url: `api/impound/delete/${id}`,
            data: params,
        })
            .then(() => {
                toggleIsUpdateSuccess();
                setConfirmDelete(false);
                notifySuccess(SuccessMessages.delete)
            })
            .catch(() => {
                setConfirmDelete(false);
                notifySuccess(ErrorMessages.delete)
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
            DateSend: "",
            LicensePlates: "",
            Receiver: "",
            FinePaymentDate: "",
            Violation: "",
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
        myObject[fieldSearch] = searchValue
        BaseAxios({
            url: `api/impound/show`,
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
            endDate: endExport
        }
        BaseAxios({
            url: 'api/sanctions/exports',
            method: 'POST',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            notifySuccess("Đã tải xuống file")
        }).catch(() => {
            notifyError("Có lỗi xảy ra,vui lòng thử lại")
        })
        console.log(timeExport);
        setStartExport("")
        setEndExport("")
    }

    const handleExportFile = () => {
        BaseAxios({
            method: 'POST',
            url: 'api/impound/exports',
            responseType: "blob",
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            notifySuccess("Đã tải xuống file")
        }).catch(() => {
            notifyError("Có lỗi xảy ra,vui lòng thử lại")
        })
    }

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
            <div className={cn(styles.content)}>
                <div className={cn(styles.contentHeader)}>
                    <h2>Sổ theo dõi tạm giữ, giấy tờ và vi phạm giao thông</h2>
                    {/* <div className={cn(styles.searchAndAdd)}>
                        <button className={cn(styles.btnExportFile)} onClick={handleExportInformation}>Xuất Thông Tin</button>
                        <select className={cn(styles.inputField)} value={fieldSearch} onChange={(e) => setFieldSearch(e.target.value)} >
                            <option value='dateSend'>Ngày Tháng Gửi</option>
                            <option value='licensePlates'>Biển Kiểm Soát</option>
                            <option value='violation'>Lỗi Vi Phạm</option>
                            <option value='receiver'>Người Nhận</option>
                            <option value='finePaymentDate'>Ngày thanh toán</option>
                        </select>
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
                    </div> */}
                </div>
                <div className={cn(styles.searchAndAddMobile)}>
                    <div className={cn(styles.groupBtnLeft)}>
                        <div className={cn(styles.export)}>
                            <div
                                className={cn(styles.addnew)}
                                onClick={handleExportFile}
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
                                <option value='returnDate'>Ngày trả</option>
                                <option value='licensePlates'>Biển Kiểm Soát</option>
                                <option value='dateOfViolation'>Ngày Vi Phạm</option>
                                <option value='fullname'>Tên Người Vi Phạm</option>
                                <option value='onHold'>Đã Tạm Giữ</option>
                                <option value='returned'>Đã Trả Lại</option>
                                <option value='officerReturns'>Cán Bộ Trả</option>
                            </select>
                        </div>
                        <div className={cn(styles.search)}>
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder='Tìm kiếm'
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
                                <th className={cn(styles.stt)}>{Text.titleCell.stt}</th>
                                <th className={cn(styles.receiver)}>{Text.titleCell.payBackDay}</th>
                                <th className={cn(styles.penaltyPaymentDate)}>{Text.titleCell.licensePlates}</th>
                                <th className={cn(styles.receiver)}>{Text.titleCell.errorDay}</th>
                                <th className={cn(styles.penaltyPaymentDate)}>{Text.titleCell.errorPersonName}</th>
                                <th className={cn(styles.penaltyPaymentDate)}>{Text.titleCell.custody}</th>
                                <th className={cn(styles.penaltyPaymentDate)}>{Text.titleCell.payBack}</th>
                                <th className={cn(styles.penaltyPaymentDate)}>{Text.titleCell.cadres}</th>
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
                                        <td onClick={() => handleEdit(data)} className={cn(styles.contentReveiver)}>
                                            {data?.ReturnDate ? formatDate(String(data.ReturnDate)) : ""}
                                        </td>
                                        <td
                                            onClick={() => handleEdit(data)}
                                            className={cn(styles.penaltyPaymentDate)}
                                        >
                                            {data?.LicensePlates ? String(data.LicensePlates) : ""}
                                        </td>
                                        <td onClick={() => handleEdit(data)} className={cn(styles.contentReveiver)}>
                                            {data?.DateOfViolation ? formatDate(String(data.DateOfViolation)) : ""}
                                        </td>
                                        <td
                                            onClick={() => handleEdit(data)}
                                            className={cn(styles.penaltyPaymentDate)}
                                        >
                                            {data?.FullName ? String(data.FullName) : ""}
                                        </td>
                                        <td onClick={() => handleEdit(data)} className={cn(styles.penaltyPaymentDate)}>
                                            {data?.OnHold ? String(data.OnHold) : ""}
                                        </td>
                                        <td onClick={() => handleEdit(data)} className={cn(styles.penaltyPaymentDate)}>
                                            {data?.Returned ? String(data.Returned) : ""}
                                        </td>
                                        <td onClick={() => handleEdit(data)} className={cn(styles.penaltyPaymentDate)}>
                                            {data?.OfficerReturns ? String(data.OfficerReturns) : ""}
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
                        {mainData.length === 0 && !loading && <EmptyData colSpan={8} />}
                        {loading && (
                            <tbody>
                                <tr>
                                    <td colSpan={8} className={cn(styles.loadingArea)}>
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

export default CustodyFolowBook;
