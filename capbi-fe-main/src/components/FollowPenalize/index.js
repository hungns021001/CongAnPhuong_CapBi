import React, { useState, Fragment, useEffect } from "react";
import cn from "classnames";
import styles from "./index.module.css";
import { GrPrevious, GrNext } from "react-icons/gr";
import { AiOutlineFolderAdd, AiOutlineSearch } from "react-icons/ai";
import ModalLayout from "@/layouts/modal";
import EditData from "./editData";
import ReadOnly from "./readOnly";
import BaseAxios from "@/store/setUpAxios";
import Loading from "../loadingComponent";
import NoData from "../noData/index";
import PaginatedItems from "../pagination";
function FollowPenalize() {
    const [modalAdd, setModalAdd] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [checkUpdateApi, setCheckUpdateApi] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paginate, setPaginate] = useState(1);

    const [addFormData, setAddFormData] = useState({
        sqd: "",
        name: "",
        ns: "",
        hktt: "",
        dt: "",
        qt: "",
        nlv: "",
        ndvp: "",
        nrqdxp: "",
        htxl: "",
        cbdp: ""
    });
    const [editFormData, setEditFormData] = useState({
        sqd: "",
        name: "",
        ns: "",
        hktt: "",
        dt: "",
        qt: "",
        nlv: "",
        ndvp: "",
        nrqdxp: "",
        htxl: "",
        cbdp: ""
    });
    const [searchValue, setSearchValue] = useState("")

    const [editContactId, setEditContactId] = useState(null);
    const handleAddFormChange = (event) => {
        event.preventDefault();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;
        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;
        setAddFormData(newFormData);
    };
    const handleEditFormChange = (event) => {
        event.preventDefault();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;
        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;
        setEditFormData(newFormData);
    };
    const handleAddFormSubmit = (event) => {
        event.preventDefault();
        const formDataReq = {
            decisionId: addFormData.sqd,
            fullName: addFormData.name,
            birthday: addFormData.ns,
            staying: addFormData.hktt,
            nation: addFormData.dt,
            country: addFormData.qt,
            job: addFormData.nlv,
            content: addFormData.ndvp,
            punisher: addFormData.nrqdxp,
            processingForm: addFormData.htxl,
            fullnamePolice: addFormData.cbdp
        };

        BaseAxios({
            url: "api/sanctions/create-sanctions-handler",
            method: "POST",
            data: formDataReq
        })
            .then(() => {
                setModalAdd(false);
                alert("Đã cập nhật thông tin")
                setCheckUpdateApi(!checkUpdateApi)
            })
            .catch(() => {
                alert("có lỗi xảy ra,vui lòng thử lại")
            })
    };
    const handleEditFormSubmit = (event) => {
        event.preventDefault();
        let idData = editContactId
        const editedContact = {
            decisionId: editFormData.sqd,
            fullName: editFormData.name,
            birthday: editFormData.ns,
            staying: editFormData.hktt,
            nation: editFormData.dt,
            country: editFormData.qt,
            job: editFormData.nlv,
            content: editFormData.ndvp,
            punisher: editFormData.nrqdxp,
            processingForm: editFormData.htxl,
            fullnamePolice: editFormData.cbdp
        }
        BaseAxios({
            url: `api/sanctions/update-sanctions/${idData}`,
            method: "POST",
            data: editedContact
        })
            .then(() => {
                alert("Đã cập nhật thông tin")
                setCheckUpdateApi(!checkUpdateApi)
                setEditContactId(null)
            })
            .catch(() => {
                alert("Có lỗi xảy ra,vui lòng thử lại")
            })


    };
    const handleEditClick = (event, contact, index) => {
        event.preventDefault();
        setEditContactId(contact.id);
        const formValues = {
            sqd: contact.DecisionId,
            name: contact.FullName,
            ns: contact.Birthday,
            hktt: contact.Staying,
            dt: contact.Nation,
            qt: contact.Country,
            nlv: contact.Job,
            ndvp: contact.Content,
            nrqdxp: contact.Punisher,
            htxl: contact.ProcessingForm,
            cbdp: contact.FullNamePolice
        };
        setEditFormData(formValues);
    };
    const handleCancelClick = () => {
        setEditContactId(null);
    };
    const handleDeleteClick = (contactId) => {
        BaseAxios({
            method: "POST",
            url: `api/sanctions/delete/${contactId}`,
        })
            .then(() => {
                setCheckUpdateApi(!checkUpdateApi)
                alert("Đã xóa thành công")
            })
            .catch(() => {
                alert("Có lỗi xảy ra,vui lòng thử lại")
            })
    };

    const handleSeachValue = () => {
        if (searchValue === "") {
            setCheckUpdateApi(!checkUpdateApi)
        } else {
            BaseAxios({
                url: `/api/sanctions/show/${searchValue}`,
                method: "POST"
            }).then(data => {
                setContacts(data.data.data.list_data)
            })
                .catch(() => {
                    setLoading(false)
                })

        }

    };

    const handleCloseModal = () => {
        setModalAdd(!modalAdd);
    };

    useEffect(() => {
        BaseAxios({
            url: "api/sanctions/get-sanctions",
            method: "POST"
        }).then(data => {
            setLoading(false)
            setContacts(data.data.data.list_data)
            setPaginate(data?.data?.data?.totalPage);
        })
            .catch(() => {
                setLoading(false)
            })
    }, [checkUpdateApi])



    return (
        <div className={cn(styles.container)}>
            {loading && <Loading />}
            <div className={cn(styles.dashboard)}>
                <div className={cn(styles.filter)}>
                    <input placeholder="Tìm kiếm theo tên" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    <button onClick={handleSeachValue}>
                        <AiOutlineSearch />
                    </button>
                </div>
                <p
                    style={{
                        textAlign: "center",
                        fontWeight: 600,
                        margin: "30px 0px",
                        fontSize: 18,
                    }}
                >
                    Sổ Theo Dõi Xử Phạt
                </p>
                <button
                    onClick={() => setModalAdd(!modalAdd)}
                    className={cn(styles.addBtn)}
                >
                    Thêm
                    <AiOutlineFolderAdd className={cn(styles.iconAdd)} />
                </button>
            </div>
            {modalAdd ? (
                <ModalLayout closeModal={handleCloseModal}>
                    <form
                        className={cn(styles.backGroundModal)}
                        onSubmit={handleAddFormSubmit}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                flex: 1,
                            }}
                        >
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="name">Số quyết định:</label>
                                <input
                                    type="text"
                                    name="sqd"
                                    required="required"
                                    placeholder="Số quyết định"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="date">Họ và tên:</label>
                                <input
                                    type="text"
                                    name="name"
                                    required="required"
                                    placeholder="Họ và tên"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="gt">Năm sinh:</label>
                                <input
                                    type="date"
                                    name="ns"
                                    required="required"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="gt">Hộ khẩu thường trú:</label>
                                <input
                                    type="text"
                                    name="hktt"
                                    required="required"
                                    placeholder="Hộ khẩu thường trú"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="gt">Dân tộc:</label>
                                <input
                                    type="text"
                                    name="dt"
                                    required="required"
                                    placeholder="Dân tộc"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="gt">Quốc tịch:</label>
                                <input
                                    type="text"
                                    name="qt"
                                    required="required"
                                    placeholder="Quốc tịch"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="ntxn">Nghề nghiệp,nơi làm việc:</label>
                                <input
                                    type="text"
                                    name="nlv"
                                    required="required"
                                    placeholder="Nghề nghiệp,nơi làm việc"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="cbkt">Nội dung vi phạm:</label>
                                <input
                                    type="text"
                                    name="ndvp"
                                    required="required"
                                    placeholder="Nội dung vi phạm"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="cbkt">Người ra quyết định xử phạt:</label>
                                <input
                                    type="text"
                                    name="nrqdxp"
                                    required="required"
                                    placeholder="Người ra quyết định xử phạt"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="cbkt">Hình thức xử lí:</label>
                                <input
                                    type="text"
                                    name="htxl"
                                    required="required"
                                    placeholder="Hình thức xử lí"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                            <div className={cn(styles.rowItem)}>
                                <label htmlFor="hktt">Cán bộ được phân công xử lý:</label>
                                <input
                                    type="text"
                                    name="cbdp"
                                    required="required"
                                    placeholder="Cán bộ được phân công xử lý"
                                    onChange={handleAddFormChange}
                                ></input>
                            </div>
                        </div>
                        <button className={cn(styles.addBtnModal)} type="sumbit">
                            Thêm
                        </button>
                    </form>
                </ModalLayout>
            ) : null}
            <form onSubmit={handleEditFormSubmit} className={cn(styles.form)}>
                <table className={cn(styles.table)}>
                    <thead className={cn(styles.thead)}>
                        <tr className={cn(styles.tr)}>
                            <th className={cn(styles.hearder, styles.stt)} >STT<br />(Vụ/<br />Trường hợp)</th>
                            <th className={cn(styles.hearder, styles.stt)}>Số quyết định</th>
                            <th className={cn(styles.hearder, styles.mainCol)}>Họ và tên</th>
                            <th className={cn(styles.hearder, styles.mediumCol)}>Năm sinh</th>
                            <th className={cn(styles.hearder, styles.mainCol)}>Hộ khẩu thường <br /> trú / tạm trú <br />(Ghi rõ xã,phường)</th>
                            <th className={cn(styles.hearder, styles.stt)}>Dân tộc</th>
                            <th className={cn(styles.hearder, styles.stt)}>Quốc tịch</th>
                            <th className={cn(styles.hearder, styles.mediumCol)}>Nghề nghiệp <br />,nơi làm việc</th>
                            <th className={cn(styles.hearder, styles.mainCol)}>Nội dung vi phạm <br /> (Ghi rõ thời gian,ngày,<br />tháng,năm,lỗi vi phạm)</th>
                            <th className={cn(styles.hearder, styles.mainCol)}>Người ra quyết định xử phạt <br /> ( Ghi rõ thời gian,<br />ngày,tháng,năm)</th>
                            <th className={cn(styles.hearder, styles.mainCol)}>Hình thức xử lý <br />(Ghi rõ số tiền xử phạt)</th>
                            <th className={cn(styles.hearder, styles.mainCol)}>Cán bộ được phân công xử lý</th>
                            <th className={cn(styles.hearder, styles.actionGroup)}></th>
                        </tr>
                    </thead>
                    
                            <tbody>
                                {
                                contacts.length > 0 ? (
                                contacts.map((contact, index) => (
                                    // eslint-disable-next-line react/jsx-key
                                    <Fragment key={index}>
                                        {editContactId === contact.id ? (
                                            <EditData
                                                editFormData={editFormData}
                                                contact={contact}
                                                index={index}
                                                handleEditFormChange={handleEditFormChange}
                                                handleCancelClick={handleCancelClick}
                                            />
                                        ) : (
                                            <ReadOnly
                                                index={index}
                                                contact={contact}
                                                handleEditClick={handleEditClick}
                                                handleDeleteClick={handleDeleteClick}
                                            />
                                        )}
                                    </Fragment>
                                ))
                                ):(
                                    <NoData col= "13"/>
                                )
                            }
                            </tbody>
                       
                </table>
            </form>
            <div className="btnPaginateContainer">
                    <PaginatedItems setPaginate={setPaginate} totalPage={paginate} />
                </div>
        </div>
    );
}
export default FollowPenalize;
