import classNames from "classnames/bind";
import { useState, useEffect, memo } from "react";
import { ToastContainer } from "react-toastify";
import styles from "./register.module.css";

import EmptyData from "@/NewComponents/emptyData";
import LoadingTable from "@/NewComponents/loadingTable";
import ModalConfirm from "@/NewComponents/modalConfirm";
import ModalRegisterNew from "@/NewComponents/newModalRegister";
import { BsCloudDownload } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import BaseAxios from "@/store/setUpAxios";
import { notifyError, notifySuccess } from "@/notify";
import PaginatedItems from "../pagination";
import { IoIosCloseCircleOutline } from "react-icons/io";

let idDelete;

const cx = classNames.bind(styles);
function Register() {
  const [isModal, setIsModal] = useState(false)
  const [mainData, setMainData] = useState([])
  const [modalData, setModalData] = useState(null)
  const [paginate, setPaginate] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paginateSearch, setPaginateSearch] = useState(1);
  const [totalPage, setTotalPage] = useState()
  const [totalPageSearch, setTotalPageSearch] = useState()
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(true);

  useEffect(() => {
    BaseAxios({
      url: 'api/admin/accounts',
      method: 'GET',
      params: {
        page: paginateSearch,
      }
    }).then((data) => {
      setLoading(false)
      setMainData(data.data.data.list_data);
      setTotalPage(data.data.data.totalPage)
    }).catch((err) => {
      if (err.response.data.msg === "Data Not Found") {
        setMainData(err.response.data.data.list_data);
      }
      setLoading(false)
    })
    setSearchLoading(true)
  }, [isUpdate, paginateSearch, searchLoading])

  const handleOpenModalDelete = (id) => {
    setConfirmDelete(true);
    idDelete = id;
  };

  const convertRoleId = (role) => {
    let text = ""
    if (role === 6) {
      text = "admin"
    } else if (role === 1) {
      text = "Trưởng công an phường"
    } else if (role === 2) {
      text = "Trưởng nhóm Tổng hợp"
    } else if (role === 3) {
      text = "Trưởng nhóm Phòng chống tội phạm"
    } else if (role === 4) {
      text = "Trưởng nhóm Cảnh sát khu vực"
    } else if (role === 5) {
      text = "Trưởng nhóm Cảnh sát trật tự"
    } else if (role === 7) {
      text = "Cán bộ nhóm Tổng hợp"
    } else if (role === 8) {
      text = "Cán bộ nhóm Phòng chống tội phạm"
    } else if (role === 9) {
      text = "Cán bộ nhóm Cảnh sát khu vực"
    } else if (role === 10) {
      text = "Cán bộ nhóm Cảnh sát trật tự"
    }
    return text
  }

  const handleDeleteClick = (id) => {
    BaseAxios({
      method: "DELETE",
      url: `api/admin/accounts/${id}`
    }).then(() => {
      setIsUpdate(!isUpdate)
      setConfirmDelete(false)
      notifySuccess("Đã xóa tài khoản thành công")
    }).catch((err) => {
      setConfirmDelete(false)
      if (err.response.data.msg === "You can't delete the account!") {
        notifyError("Bạn không thể xóa tài khoản này")
      } else {
        notifyError("Có lỗi xảy ra,vui lòng thử lại")
      }
    })
  }

  const openModal = (item) => {
    setIsModal(true)
    setModalData(item)
  }

  const handleSearch = () => {
    if (searchValue === "") {
      setIsUpdate(!isUpdate)
    } else {
      BaseAxios({
        url: 'api/admin/accounts-search',
        method: 'GET',
        params: {
          name: searchValue,
          page: paginate
        }
      }).then((data) => {
        setMainData(data.data.data.list_data);
        setTotalPageSearch(data.data.data.totalPage)
        setTotalPage(0)
        setPaginateSearch(1);
      }).catch((err) => {
        setMainData([]);
        setTotalPageSearch(0)
        setTotalPage(0)
      })
    }
  }

  return (
    <div className={cx('content')}>
      <ToastContainer />
      {isModal && <ModalRegisterNew data={modalData} handleUpdate={() => setIsUpdate(!isUpdate)} handleCloseModal={() => {
        setIsModal(false)
        setModalData(null)
      }}></ModalRegisterNew>}
      <div className={cx('contentHeader')}>
        <h2>Quản lý tài khoản</h2>
      </div>
      <div className={cx('searchAndAddMobile')}>
        <div className={cx('groupBtnLeft')}>
        </div>
        <div className={cx('groupBtnRight')}>
          <div className={cx('search')}>
            <input
              onKeyDown={(e) => {
                if (e.keyCode === 13) handleSearch()
              }}
              value={searchValue}
              type="text"
              placeholder="Tìm kiếm"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className={cx("empty")} ></div>
            {
              (searchValue.trim() != "") ? (
                searchLoading && <IoIosCloseCircleOutline
                  className={cx("closeIcon")}
                  onClick={() => {
                    setSearchLoading(false)
                    setSearchValue("")
                  }}
                />) : (
                <div></div>
              )
            }
            <BiSearchAlt2
              onClick={handleSearch}
              className={cx('searchIcon')}
            />
          </div>
          <div className={cx("addnew")}>
            <button onClick={() => setIsModal(true)}>+</button>
          </div>
        </div>
      </div>
      <div className={cx('contentbody')}>
        <table className={cx('tableContent')} cellSpacing="0">
          <thead>
            <tr>
              <th className={cx('stt')}>{"STT"}</th>
              <th className={cx('violation1')}>{"Họ và tên"}</th>
              <th className={cx('violation2')}>Tên đăng nhập</th>
              <th className={cx('violation')}>Vị trí</th>
              <th className={cx('editAndDelete')}></th>
            </tr>
          </thead>
          <tbody>
            {mainData.map((item, index) => {
              return (
                <tr key={index}>
                  <td onClick={() => openModal(item)} className={cx("contentStt")}>
                    {totalPage > 0 && (
                      <td
                        className={cx('contentStt')}
                      >
                        {paginateSearch === 1
                          ? index + 1
                          : index + 1 + 10 * (paginateSearch - 1)}
                      </td>
                    )}
                    {totalPageSearch > 0 && (
                      <td
                        className={cx('contentStt')}
                      >
                        {paginate === 1
                          ? index + 1
                          : index + 1 + 10 * (paginate - 1)}
                      </td>
                    )}
                  </td>
                  <td onClick={() => openModal(item)} className={cx('violation1')}>
                    {item.FullName}
                  </td>
                  <td onClick={() => openModal(item)} className={cx('violation2')}>
                    {item.Username}
                  </td>
                  <td onClick={() => openModal(item)} className={cx('violation')}>
                    {convertRoleId(Number(item.RoleId))}
                  </td>
                  <td className={cx('editAndDelete')}>
                    {confirmDelete && (
                      <ModalConfirm
                        submitDelete={() => handleDeleteClick(idDelete)}
                        backgroundColor="rgba(3, 3, 3, 0.1)"
                        description="Bạn có chắc muốn xóa tài khoản này ? "
                        alertBtn={false}
                        deleteBtn={true}
                        closeModal={() => setConfirmDelete(false)}
                      />
                    )}
                    <AiOutlineDelete
                      className={cx('delete')}
                      onClick={() => handleOpenModalDelete(item.Id)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
          {mainData.length === 0 && !loading && <EmptyData colSpan={5} />}
          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className={cx('loadingArea')}>
                  <LoadingTable />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {mainData.length > 0 && totalPage > 1 && (
        <div className={cx('pagination')}>
          <PaginatedItems
            setPaginate={setPaginateSearch}
            totalPage={totalPage}
          />
        </div>
      )}
      {mainData.length > 0 && totalPageSearch > 1 && (
        <div className={cx('pagination')}>
          <PaginatedItems
            setPaginate={setPaginate}
            totalPage={totalPageSearch}
          />
        </div>
      )}
    </div >
  );
}

export default memo(Register);
