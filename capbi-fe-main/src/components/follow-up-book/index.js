import React, { useState, Fragment, useEffect } from "react";
import cn from "classnames";
import styles from "./style.module.css";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import { GrPrevious, GrNext } from "react-icons/gr";
import { AiOutlineFolderAdd, AiOutlineSearch } from "react-icons/ai";
import ModalLayout from "@/layouts/modal";
import {
  Text,
  apiServer,
  SuccessMessages,
  ErrorMessages,
} from "../../constant";
import BaseAxios from "@/store/setUpAxios";
import Loading from "../loadingComponent";
import { checkIfEmptyValueExists } from "../../commonHandle";
import NoData from "../noData/index";
import PaginatedItems from "../pagination";
function Folloupbook() {
  const [passportData, setPassportData] = useState([]);
  const [editPassportId, setEditPassportId] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
  
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState(Text.gender.number.man);
  const [permanentResidence, setPermanentResidence] = useState("");
  const [confirmedDate, setConfirmedDate] = useState("");
  const [inspectionOfficer, setInspectionOfficer] = useState("");
  const [leaderSign, setLeaderSign] = useState("");

  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const handleEditClick = (e, passport) => setEditPassportId(passport.Id);
  const handleCancelClick = () => setEditPassportId(null);
  const handleCloseModal = () => setIsShowModal(false);
  const [paginate, setPaginate] = useState(1);
  
  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.passport.delete + id,
      data: params,
    })
      .then(() => {
        alert(SuccessMessages.delete);
        toggleIsUpdateSuccess();
      })
      .catch(() => {
        alert(ErrorMessages.delete);
      });
  };

  const resetInputsModal = () => {
    setFullName("");
    setDateOfBirth("");
    setSex("");
    setPermanentResidence("");
    setConfirmedDate("");
    setInspectionOfficer("");
    setLeaderSign("");
  };

  const createNew = () => {
    setIsShowLoading(true);
    let dataCreate = {
      fullName,
      birthday: dateOfBirth,
      gender: sex.toString(),
      staying: permanentResidence,
      confirmationDate: confirmedDate,
      fullNamePolice: inspectionOfficer,
      leaderSign,
    };
    let isExitsEmptyData = checkIfEmptyValueExists(dataCreate);
    if (isExitsEmptyData) {
      setIsShowLoading(false);
      alert(ErrorMessages.inputData.empty);
    } else {
      BaseAxios({
        method: "POST",
        url: apiServer.passport.create,
        data: dataCreate,
      })
        .then(() => {
            setLoading(false);
          toggleIsUpdateSuccess();
          handleCloseModal();
          alert(SuccessMessages.create);
          resetInputsModal();
        })
        .catch(() => {
            setLoading(false);
          alert(ErrorMessages.create);
        });
    }
  };

  useEffect(() => {
    BaseAxios({
      method: "POST",
      url: apiServer.passport.get,
    })
      .then((passports) => {
        setPaginate(passports?.data?.data?.totalPage);
        setPassportData(passports?.data?.data.list_data);
        setIsShowLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isUpdatedSuccess]);

  return (
    <div className={cn(styles.container)}>
      {loading && <Loading />}
      <div className={cn(styles.dashboard)}>
        <div className={cn(styles.filter)}>
          <input placeholder={Text.search} type="text" />
          <button>
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
          {Text.title.passportBook}
        </p>
        <button
          onClick={() => setIsShowModal(true)}
          className={cn(styles.addBtn)}
        >
          {Text.CRUD.add}
          <AiOutlineFolderAdd className={cn(styles.iconAdd)} />
        </button>
      </div>
      {isShowModal && (
        <ModalLayout closeModal={handleCloseModal}>
          <div className={cn(styles.backGroundModal)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.fullName}</label>
                <input
                  type="text"
                  required="required"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={Text.placeHolder.dataPassport.fullName}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.dateOfBirth}</label>
                <input
                  type="date"
                  required="required"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.sex}</label>
                <select className={cn(styles.select)}>
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
            </div>
            <div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.permanentResidence}</label>
                <input
                  type="text"
                  required="required"
                  value={permanentResidence}
                  onChange={(e) => setPermanentResidence(e.target.value)}
                  placeholder={Text.placeHolder.dataPassport.permanentResidence}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.confirmedDate}</label>

                <input
                  type="date"
                  required="required"
                  value={confirmedDate}
                  onChange={(e) => setConfirmedDate(e.target.value)}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.inspectionOfficer}</label>
                <input
                  type="text"
                  required="required"
                  value={inspectionOfficer}
                  onChange={(e) => setInspectionOfficer(e.target.value)}
                  placeholder={Text.placeHolder.dataPassport.inspectionOfficer}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.leaderSign}</label>
                <input
                  type="text"
                  required="required"
                  value={leaderSign}
                  onChange={(e) => setLeaderSign(e.target.value)}
                  placeholder={Text.placeHolder.dataPassport.leaderSign}
                />
              </div>
            </div>
            <button className={cn(styles.addBtnModal)} onClick={createNew}>
              {Text.CRUD.add}
            </button>
          </div>
        </ModalLayout>
      )}
      <form className={cn(styles.form)}>
        <table className={cn(styles.table)}>
          <thead className={cn(styles.thead)}>
            <tr className={cn(styles.tr)}>
              <th className={cn(styles.hearder, styles.stt)}>
                {Text.titleCell.stt}
              </th>
              <th className={cn(styles.hearder)}>{Text.titleCell.fullName}</th>
              <th className={cn(styles.hearder)}>
                {Text.titleCell.dateOfBirth}
              </th>
              <th className={cn(styles.hearder)}>{Text.titleCell.sex}</th>
              <th className={cn(styles.hearder)}>
                {Text.titleCell.permanentResidence}
              </th>
              <th className={cn(styles.hearder)}>
                {Text.titleCell.confirmedDate}
              </th>
              <th className={cn(styles.hearder)}>
                {Text.titleCell.inspectionOfficer}
              </th>
              <th className={cn(styles.hearder)}>
                {Text.titleCell.leaderSign}
              </th>
              <th className={cn(styles.hearder, styles.actionGroup)}></th>
            </tr>
          </thead>
          <tbody>
            {passportData.length > 0 ? (
              passportData.map((passport, index) => (
                <Fragment key={index}>
                  {editPassportId && editPassportId === passport.Id ? (
                    <EditableRow
                      index={index}
                      passport={passport}
                      handleCancelClick={handleCancelClick}
                      updated={toggleIsUpdateSuccess}
                    />
                  ) : (
                    <ReadOnlyRow
                      index={index}
                      passport={passport}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <NoData col="9" />
            )}
          </tbody>
        </table>
      </form>
      <div className="btnPaginateContainer">
        <PaginatedItems setPaginate={setPaginate} totalPage={paginate} />
      </div>
    </div>
  );
}
export default Folloupbook;
