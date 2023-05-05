import React, { useState, Fragment, useEffect } from "react";
import cn from "classnames";

import styles from "./style.module.css";
import ReadOnlyly from "./ReadOnlyly";
import Editableble from "./Editableble";
import { GrPrevious, GrNext } from "react-icons/gr";
import { AiOutlineFolderAdd, AiOutlineSearch } from "react-icons/ai";
import ModalLayout from "@/layouts/modal";
import BaseAxios from "@/store/setUpAxios";
import { apiServer, ErrorMessages, SuccessMessages } from "@/constant";
import { checkIfEmptyValueExists } from "@/commonHandle";
import Loading from "../loadingComponent/index";
import NoData from "../noData/index";
import PaginatedItems from "../pagination";

function Logbooknotprocessed() {
  const [getData, setGetData] = useState([]);
  const [paginate, setPaginate] = useState(1);
  const [modalAdd, setModalAdd] = useState(false);
  const [ isUpdated, setIsUpdated] = useState(false);
  const toggleIsUpdate = () => setIsUpdated(!isUpdated);
  const [dateOfViolation, setDateOfViolation] = useState("");
  const [violation, setViolation] = useState("");
  const [addressViolation, setAddressViolation] = useState("");
  const [note, setNote] = useState("");
  const [editGetId, setEditGetId] = useState(null);
  const [searchValue,setSeachValue] = useState("")

  const handleEditClick = (e, get) => setEditGetId(get.Id);
  const handleCancelClick = () => {
    setEditGetId(null);
  };
  const handleSeachValue = () => {
    if(searchValue === "") {
      setIsUpdated(!isUpdated)
    } else {
      BaseAxios({
        method: "POST",
        url: `api/nothandle/show/${searchValue}`,
      }).then((getDatas) => {
        setGetData(getDatas?.data?.data.list_data);
      });
    }
  };
  const handleCloseModal = () => {
    setModalAdd(!modalAdd);
  };
  useEffect(() => {
    BaseAxios({
      method: "POST",
      url: apiServer.nothandle.get,
    }).then((getDatas) => {
      setGetData(getDatas?.data?.data.list_data);
      setPaginate(getDatas?.data?.data?.totalPage);
    });
  }, [isUpdated]);
  const handleDeleteClick = (id) => {
    const params = { id };
    BaseAxios({
      method: "POST",
      url: apiServer.nothandle.delete + id,
      data: params,
    })
      .then(() => {
        alert(SuccessMessages.delete);
        toggleIsUpdate();
      })
      .catch(() => {
        alert(ErrorMessages.delete);
      });
  };
  const resetInputModal = () => {
    setDateOfViolation("");
    setViolation("");
    setNote("");
    setAddressViolation("");
  };
  const createNewData = (e) => {
    e.preventDefault();
    let dataCreateData = {
      dateOfViolation,
      violation,
      addressViolation,
      note,
    };
    let isExitData = checkIfEmptyValueExists(dataCreateData);

    if (isExitData) {
      alert(ErrorMessages.inputData.empty);
    } else {
      BaseAxios({
        method: "POST",
        url: apiServer.nothandle.create,
        data: dataCreateData,
      })
        .then(() => {
          toggleIsUpdate();
          handleCloseModal();
          alert(SuccessMessages.create);
          resetInputModal();
        })
        .catch(() => {
          alert(ErrorMessages.create);
        });
    }
  };

  return (
    <div className={cn(styles.container)}>
      <div className={cn(styles.dashboard)}>
        <div className={cn(styles.filter)}>
          <input placeholder="Tìm kiếm theo nơi vi phạm" type="text" value={searchValue} onChange={(e)=>setSeachValue(e.target.value)} />
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
          Sổ Theo Dõi Không Xử Lý
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
          <form className={cn(styles.backGroundModal)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <div className={cn(styles.rowItem)}>
                <label>Ngày tháng năm vi phạm:</label>
                <input
                  type="date"
                  value={dateOfViolation}
                  required="required"
                  onChange={(e) => setDateOfViolation(e.target.value)}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label>Lỗi vi phạm:</label>
                <input
                  type="text"
                  value={violation}
                  required="required"
                  placeholder="Lỗi vi phạm..."
                  onChange={(e) => setViolation(e.target.value)}
                ></input>
              </div>
              <div className={cn(styles.rowItem)}>
                <label htmlFor="nvp">Nơi vi phạm:</label>
                <input
                  type="text"
                  value={addressViolation}
                  required="required"
                  placeholder="Nơi vi phạm..."
                  onChange={(e) => setAddressViolation(e.target.value)}
                ></input>
              </div>
            </div>

            <div className={cn(styles.rowItem)}>
              <label htmlFor="gc">Ghi chú:</label>
              <input
                type="text"
                value={note}
                required="required"
                placeholder="Ghi chú..."
                onChange={(e) => setNote(e.target.value)}
              ></input>
            </div>

            <button
              className={cn(styles.addBtnModal)}
              type="sumbit"
              onClick={createNewData}
            >
              Thêm
            </button>
          </form>
        </ModalLayout>
      ) : null}
      <form className={cn(styles.form)}>
        <table className={cn(styles.table)}>
          <thead className={cn(styles.thead)}>
            <tr className={cn(styles.tr)}>
              <th className={cn(styles.hearder, styles.stt)}>Stt</th>
              <th className={cn(styles.hearder)}>Ngày tháng Năm vi phạm</th>
              <th className={cn(styles.hearder)}>Lỗi vi phạm</th>
              <th className={cn(styles.hearder)}>Nơi vi phạm</th>
              <th className={cn(styles.hearder)}>Ghi chú</th>

              <th className={cn(styles.hearder, styles.actionGroup)}></th>
            </tr>
          </thead>
          <tbody>
            {
            getData.length > 0 ?(
            getData.map((get, index) => (
              // eslint-disable-next-line react/jsx-key
              <Fragment key={index}>
                {editGetId && editGetId === get.Id ? (
                  <Editableble
                    // editFormData={editFormData}
                    index={index}
                    get={get}
                    updatedGet={toggleIsUpdate}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyly
                    index={index}
                    get={get}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))
            ):(
              <NoData col="6"/>
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
export default Logbooknotprocessed;
