import React, { useState, useEffect, memo } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import cn from "classnames";
import styles from "./index.module.css";
import ContentModal from "../contentModal";
import Modal from "@/NewComponents/newModal";
import BaseAxios from "@/store/setUpAxios";
import PaginatedItems from "../../pagination/index";
import { Text, SuccessMessages, ErrorMessages } from "../../../constant";
import EmptyData from "@/NewComponents/emptyData";
import LoadingTable from "@/NewComponents/loadingTable";
import ModalConfirm from "../modalConfirm";
import { notifySuccess, notifyError } from "../../../notify";
import { ToastContainer } from "react-toastify";
import {
  _deleteFollowTheTextServices,
  _getListFollowTheTextServices,
  _createDutyServices,
} from "../services";
import formatDate from "@/formatTime";

function TableComponent() {
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
  const toggleIsUpdateSuccess = () => setIsUpdateSuccess(!isUpdatedSuccess);
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    licensePlates: "",
    violationError: "",
    sentDate: "",
    dateOfPaymentFfFines: "",
    receiver: "",
    violatingImages: "",
  });

  const handleShowModal = (e) => {
    setDesc(Text.CRUD.add);
    setOpenAdd(true);
    setIsUpdateSuccess(false);
    setForm({
      ...form,
      licensePlates: "",
      violationError: "",
      sentDate: "",
      dateOfPaymentFfFines: "",
      receiver: "",
      violatingImages: "",
    });
  };

  useEffect(() => {
    _getListFollowTheText();
  }, []);

  useEffect(() => {
    if (mainData) {
      setLoading(false);
    }
  }, [mainData]);

  useEffect(() => {
    if (isUpdatedSuccess) {
      _getListFollowTheText();
    }
  }, [isUpdatedSuccess]);

  useEffect(() => {
    _getListFollowTheText();
  }, [paginate]);

  const _getListFollowTheText = async () => {
    try {
      const res = await _getListFollowTheTextServices(paginate);
      if (res && res.status === Text.statusTrue) {
        setMainData(res.data.data.list_data);
        setTotalPage(res.data.data.totalPage);
      }
    } catch (error) {}
  };

  const handleEdit = (data) => {
    setDesc(Text.CRUD.insert);
    setOpenAdd(true);
    setIsUpdateSuccess(false);
    setForm({
      ...form,
      licensePlates: data.licensePlates,
      violationError: data.violationError,
      sentDate: data.sentDate,
      dateOfPaymentFfFines: data.dateOfPaymentFfFines,
      receiver: data.receiver,
      violatingImages: data.violatingImages,
    });
    setId(data.Id);
  };

  const handleClose = () => {
    setOpenAdd(false);
  };

  // search
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
    BaseAxios({
      url: `api/accreditation/show/${searchValue}`,
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
        alert(ErrorMessages.search.noMatchingResults);
      });
  };
  // end search

  const handleOpenModalDelete = (id) => {
    setConfirmDelete(true);
    setIsUpdateSuccess(false);
    setId(id);
  };

  const handleSearchKeyPress = (e) => {
    if (e.keyCode === Text.keyEnter) {
      handleSearch();
    }
  };

  const _handleDeleteFollowTheText = async () => {
    try {
      const res = await _deleteFollowTheTextServices(id);
      if (res && res.status === Text.statusTrue) {
        setIsUpdateSuccess(true);
        setConfirmDelete(false);
        notifySuccess(SuccessMessages.delete);
        setId("");
      } else {
        setConfirmDelete(false);
        setIsUpdateSuccess(false);
        notifySuccess(ErrorMessages.delete);
      }
    } catch (error) {
      setConfirmDelete(false);
      setIsUpdateSuccess(false);
      notifySuccess(ErrorMessages.delete);
    }
  };

  return (
    <div className={cn(styles.wrapper)}>
      <ToastContainer />
      {openAdd && (
        <Modal handleCloseModal={handleClose}>
          <ContentModal
            successToast={(message) => notifySuccess(message)}
            errorToast={(message) => notifyError(message)}
            descTitle={desc}
            handleCloseModal={handleClose}
            toggleIsUpdateSuccess={toggleIsUpdateSuccess}
            form={form}
            setForm={setForm}
            id={id}
            setId={setId}
          />
        </Modal>
      )}
      <div className={cn(styles.content)}>
        <div className={cn(styles.contentHeader)}>
          <h2>{Text.title.inspectionDepositBook}</h2>
          <div className={cn(styles.searchAndAdd)}>
            <div className={cn(styles.search)}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={Text.search}
                onKeyDown={(e) => handleSearchKeyPress(e)}
              />
              <BiSearchAlt2
                onClick={handleSearch}
                className={cn(styles.searchicon)}
              />
            </div>
            <div className={cn(styles.addnew)}>
              <button onClick={handleShowModal}>{Text.plus}</button>
            </div>
          </div>
        </div>
        <div className={cn(styles.searchAndAddMobile)}>
          <div className={cn(styles.search)}>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={Text.search}
              onKeyDown={(e) => handleSearchKeyPress(e)}
            />
            <BiSearchAlt2
              onClick={handleSearch}
              className={cn(styles.searchicon)}
            />
          </div>
          <div className={cn(styles.addnew)}>
            <button onClick={handleShowModal}>{Text.plus}</button>
          </div>
        </div>
        <div className={cn(styles.contentbody)}>
          <table className={cn(styles.tableContent)} cellSpacing="0">
            <thead>
              <tr>
                <th className={cn(styles.stt)}>
                  {Text.titleCell.inspectionDepositBook.stt}
                </th>
                <th className={cn(styles.licensePlates)}>
                  {Text.titleCell.inspectionDepositBook.licensePlates}
                </th>
                <th className={cn(styles.violationError)}>
                  {Text.titleCell.inspectionDepositBook.violationError}
                </th>
                <th className={cn(styles.sentDate)}>
                  {Text.titleCell.inspectionDepositBook.sentDate}
                </th>
                <th className={cn(styles.dateOfPaymentFfFines)}>
                  {Text.titleCell.inspectionDepositBook.dateOfPaymentFfFines}
                </th>
                <th className={cn(styles.receiver)}>
                  {Text.titleCell.inspectionDepositBook.receiver}
                </th>
                <th className={cn(styles.violatingImages)}>
                  {Text.titleCell.inspectionDepositBook.violatingImages}
                </th>
                <th className={cn(styles.editAndDelete)}></th>
              </tr>
            </thead>
            {mainData.length > 0 && (
              <tbody>
                {mainData.map((item, index) => (
                  <tr key={`item-${index}`}>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable)}
                    >
                      {index + 1}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable)}
                    >
                      {"74D1 33799"}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable)}
                    >
                      {"Không chấp hành đèn tìn hiệu giao thông"}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable)}
                    >
                      {"13/06/2000"}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable)}
                    >
                      {"13/06/2000"}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable)}
                    >
                      {"Trần Văn Thìn"}
                    </td>
                    <td
                      onClick={() => handleEdit(item)}
                      className={cn(styles.itemTable)}
                    >
                      {"Image"}
                    </td>
                    <td
                      className={cn(
                        styles.contentEditAndDelete,
                        styles.itemTable
                      )}
                    >
                      {confirmDelete && (
                        <ModalConfirm
                          submitDelete={() => handleDeleteClick(idDelete)}
                          backgroundColor={Text.CRUD.backgroundDeleteModal}
                          description={Text.CRUD.deleteConfirm}
                          alertBtn={false}
                          deleteBtn={true}
                          handleDeleteFollowTheText={_handleDeleteFollowTheText}
                          closeModal={() => setConfirmDelete(false)}
                        />
                      )}
                      <AiOutlineDelete
                        className={cn(styles.delete)}
                        onClick={() => handleOpenModalDelete(item.Id)}
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
        <div className={cn(styles.pagination)}>
          <PaginatedItems setPaginate={setPaginate} totalPage={totalPage} />
        </div>
      </div>
    </div>
  );
}

export default memo(TableComponent);
