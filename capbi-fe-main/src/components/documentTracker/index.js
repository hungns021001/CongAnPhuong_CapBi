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
function DocumentTracker() {
  const [trackerData, setTrackerData] = useState([]);
  const [editTrackerId, setEditTrackerId] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);
  const [dateSend, setDateSend] = useState("");
  const [licensePlates, setLicensePlates] = useState("");
  const [receiver, setReceiver] = useState("");
  const [finePaymentDate, setFinePaymentDate] = useState("");
  const [violation, setViolation] = useState("");
  const [paginate, setPaginate] = useState(1);
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const handleEditClick = (e, tracker) => setEditTrackerId(tracker.Id);
  const handleCancelClick = () => setEditTrackerId(null);
  const handleCloseModal = () => setIsShowModal(false);
  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.accreditation.delete + id,
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
    setDateSend("");
    setLicensePlates("");
    setReceiver("");
    setFinePaymentDate("");
    setViolation("");
  };

  const createNewTracker = () => {
    let dataCreateTracker = {
      dateSend,
      licensePlates,
      receiver,
      finePaymentDate,
      violation,
    };

    let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);

    if (isExitsEmptyData) {
      alert(ErrorMessages.inputData.empty);
    } else {
      BaseAxios({
        method: "POST",
        url: apiServer.accreditation.create,
        data: dataCreateTracker,
      })
        .then(() => {
          toggleIsUpdateSuccess();
          handleCloseModal();
          alert(SuccessMessages.create);
          resetInputsModal();
        })
        .catch(() => {
          alert(ErrorMessages.create);
        });
    }
  };

  useEffect(() => {
    BaseAxios({
      method: "POST",
      url: apiServer.accreditation.get,
    }).then((trackers) => {
      setTrackerData(trackers?.data?.data.list_data);
      setPaginate(trackers?.data?.data?.totalPage);
    });
  }, [isUpdatedSuccess]);

  return (
    <div className={cn(styles.container)}>
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
          {Text.title.soTheoDoiKiemDinh}
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
                <label>{Text.titleCell.sentDay}</label>
                <input
                  type="date"
                  required="required"
                  value={dateSend}
                  onChange={(e) => setDateSend(e.target.value)}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.licensePlates}</label>
                <input
                  type="text"
                  required="required"
                  value={licensePlates}
                  onChange={(e) => setLicensePlates(e.target.value)}
                  placeholder={Text.placeHolder.dataTracker.licensePlates}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.receiver}</label>
                <input
                  type="text"
                  required="required"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder={Text.placeHolder.dataTracker.receiver}
                />
              </div>
            </div>
            <div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.penaltyPaymentDate}</label>
                <input
                  type="date"
                  required="required"
                  value={finePaymentDate}
                  onChange={(e) => setFinePaymentDate(e.target.value)}
                />
              </div>
              <div className={cn(styles.rowItem)}>
                <label>{Text.titleCell.violation}</label>

                <input
                  type="text"
                  required="required"
                  value={violation}
                  onChange={(e) => setViolation(e.target.value)}
                  placeholder={Text.placeHolder.dataTracker.violation}
                />
              </div>
            </div>
            <button
              className={cn(styles.addBtnModal)}
              type="sumbit"
              onClick={createNewTracker}
            >
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
              <th className={cn(styles.hearder)}>{Text.titleCell.sentDay}</th>
              <th className={cn(styles.hearder)}>
                {Text.titleCell.licensePlates}
              </th>
              <th className={cn(styles.hearder)}>{Text.titleCell.receiver}</th>
              <th className={cn(styles.hearder)}>
                {Text.titleCell.penaltyPaymentDate}
              </th>
              <th className={cn(styles.hearder)}>{Text.titleCell.violation}</th>
              <th className={cn(styles.hearder, styles.actionGroup)}></th>
            </tr>
          </thead>
          <tbody>
            {trackerData.length > 0 ? (
              trackerData.map((tracker, index) => (
                <Fragment key={index}>
                  {editTrackerId && editTrackerId === tracker.Id ? (
                    <EditableRow
                      index={index + 1}
                      tracker={tracker}
                      handleCancelClick={handleCancelClick}
                      updatedTracker={toggleIsUpdateSuccess}
                    />
                  ) : (
                    <ReadOnlyRow
                      index={index + 1}
                      tracker={tracker}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <NoData col="7" />
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
export default DocumentTracker;
