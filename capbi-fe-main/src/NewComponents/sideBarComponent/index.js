import { toggleBody } from "@/store/paddingSlice";
import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import styles from "./index.module.css";

function SideBarComponent() {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const [translateX, setTranslateX] = useState(0);
  const [displayNone, setDisplayNone] = useState("block");
  const [openSideBar1, setOpenSideBar1] = useState(false);
  const [openSideBar2, setOpenSideBar2] = useState(false);
  const [openSideBar3, setOpenSideBar3] = useState(false);
  const [openSideBar4, setOpenSideBar4] = useState(false);

  const handleSetSideBar1 = () => {
    setOpenSideBar1(!openSideBar1);
    setOpenSideBar2(false);
    setOpenSideBar3(false);
    setOpenSideBar4(false);
  };

  const handleSetSideBar2 = () => {
    setOpenSideBar2(!openSideBar2);
    setOpenSideBar1(false);
    setOpenSideBar3(false);
    setOpenSideBar4(false);
  };

  const handleSetSideBar3 = () => {
    setOpenSideBar3(!openSideBar3);
    setOpenSideBar1(false);
    setOpenSideBar2(false);
    setOpenSideBar4(false);
  };

  const handleSetSideBar4 = () => {
    setOpenSideBar4(!openSideBar3);
    setOpenSideBar1(false);
    setOpenSideBar2(false);
    setOpenSideBar3(false);
  };

  const handleToggleClose = () => {
    setTranslateX(-212);
    setIsOpen(false);
    dispatch(toggleBody(40));
    setDisplayNone("none");
    setOpenSideBar1(false);
    setOpenSideBar2(false);
    setOpenSideBar3(false);
  };

  const handleToggleOpen = () => {
    setTranslateX(0);
    setIsOpen(true);
    dispatch(toggleBody(252));
    setDisplayNone("block");
  };

  return (
    <div
      className={cn(styles.wrapper)}
      style={{ transform: `translateX(${translateX}px)` }}
    >
      <ul
        style={{ display: `${displayNone}` }}
        className={cn(styles.listItems)}
      >
        <li className={cn(styles.item)}>
          <Link href="/home" className={cn(styles.anchorSidebar)}>
            <span className={cn(styles.itemName)}>Trang chủ</span>
          </Link>
        </li>
        <li className={cn(styles.item)}>
          <Link
            className={cn(styles.itemRegisterBtn)}
            href="/quan-ly-tai-khoan"
          >
            <span className={cn(styles.itemName)}>Quản lý tài khoản</span>
          </Link>
        </li>

        {/* Tổng hợp */}
        <li className={cn(styles.item1, styles.item)}>
          <span className={cn(styles.itemName)}>
            Tổng hợp <RiArrowDropDownLine className={cn(styles.iconDropdown)} />
          </span>

          <ul className={cn(styles.subMenu1, styles.subMenu)}>
            {/* <li className={cn(styles.subMenuItem)}>
                                <p>Coming Soon...</p>
                            </li> */}
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-truc-ban">
                <p>Sổ trực ban</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-tinh-hinh">
                <p>Sổ tình hình</p>
              </Link>
            </li>

            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-phan-cong-chot-giao-thong">
                <p>Sổ phân công chốt giao thông</p>
              </Link>
            </li>

            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-phan-cong-truc-tuan">
                <p>Sổ phân công trực tuần</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-tiep-nhan-cong-van">
                <p>Sổ theo dõi công văn đến</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-van-ban-di">
                <p>Sổ theo dõi văn bản đi</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-xac-nhan-nhan-than">
                <p>Sổ theo dõi xác nhận nhân thân</p>
              </Link>
            </li>

            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-tinh-hinh-trong-ngay">
                <p>Sổ theo dõi tình hình trong ngày</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-lich-bao-ve-su-kien">
                <p>Sổ lịch bảo vệ sự kiện</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-cong-dan-lam-ho-chieu">
                <p>Sổ theo dõi công dân làm hộ chiếu</p>
              </Link>
            </li>
          </ul>
        </li>

        {/* Cảnh sát trật tự */}
        <li className={cn(styles.item2, styles.item)}>
          <span className={cn(styles.itemName)}>
            Cảnh sát trật tự{" "}
            <RiArrowDropDownLine className={cn(styles.iconDropdown)} />{" "}
          </span>
          <ul className={cn(styles.subMenu2, styles.subMenu)}>
            {/* <li className={cn(styles.subMenuItem)}>
                            <li className={cn(styles.subMenuItem)}>
                                <Link href="/so-theo-doi-tinh-hinh-trong-ngay">
                                    <p>Sổ theo dõi tình hình trong ngày</p>
                                </Link>
                            </li>
                            <li className={cn(styles.subMenuItem)}>
                                <Link href="/so-lich-bao-ve-su-kien">
                                <p>Sổ lịch bảo vệ sự kiện</p>
                                </Link>
                            </li>
                            <li className={cn(styles.subMenuItem)}>
                                <Link href='/so-theo-doi-cong-dan-lam-ho-chieu'>
                                    <p>Sổ theo dõi công dân làm hộ chiếu</p>
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li onClick={handleSetSideBar2} className={cn(styles.item)}>
                    <span className={cn(styles.itemName)}>
                        Cảnh Sát Trật Tự <RiArrowDropDownLine className={cn(styles.iconDropdown)} />{" "}
                    </span>
                    {openSideBar2 && (
                        <ul className={cn(styles.subMenu)}>
                            {/* <li className={cn(styles.subMenuItem)}>
                                <p>Coming Soon...</p>
                            </li> */}
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-xu-ly-trong-ngay">
                <p>Sổ theo dõi xử lý trong ngày</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-xu-phat">
                <p>Sổ theo dõi xử phạt</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-gui-kiem-dinh">
                <p>Sổ theo dõi gửi kiểm định</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-khong-xu-ly">
                <p>Sổ theo dõi không xử lý</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-tam-giu">
                <p>Sổ theo dõi tạm giữ, giấy tờ</p>
              </Link>
            </li>
          </ul>
        </li>

        {/* Phòng chống tội phạm */}
        <li className={cn(styles.item3, styles.item)}>
          <p className={cn(styles.itemName)}>
            Phòng chống tội phạm{" "}
            <RiArrowDropDownLine className={cn(styles.iconDropdown)} />{" "}
          </p>

          <ul className={cn(styles.subMenu3, styles.subMenu)}>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-quyet-dinh-xu-phat">
                <p>Sổ theo dõi quyết định xử phạt</p>
              </Link>
            </li>

            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-van-ban-hanh-chinh">
                <p>Sổ theo dõi văn bản hành chính</p>
              </Link>
            </li>
            {/* <li className={cn(styles.subMenuItem)}>
                                <p>Sổ theo dõi xử lý vụ việc</p>
                            </li> */}
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-tam-giu-xu-ly-phuong-tien">
                <p>Sổ theo dõi tạm giữ, xử lý phương tiện</p>
              </Link>
            </li>
            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-theo-doi-xu-ly-vu-viec">
                <p>Sổ theo dõi xử lý vụ việc</p>
              </Link>
            </li>
            {/* <li className={cn(styles.subMenuItem)}>
                               <Link href='/so-theo-doi-tam-giu-xu-ly-phuong-tien'>
                               <p>Sổ theo dõi tạm giữ,xử lý phương tiện</p>
                               </Link>
                            </li> */}
          </ul>
        </li>

        {/* Cảnh sát khu vực */}
        <li className={cn(styles.item4, styles.item)}>
          <span className={cn(styles.itemName)}>
            Cảnh sát khu vực{" "}
            <RiArrowDropDownLine className={cn(styles.iconDropdown)} />{" "}
          </span>

          <ul className={cn(styles.subMenu4, styles.subMenu)}>
            <li className={cn(styles.subMenuItem)}>
              <Link href="so-theo-doi-kiem-tra-cu-tru">
                <p>Sổ theo dõi kiểm tra cư trú</p>
              </Link>
            </li>

            <li className={cn(styles.subMenuItem)}>
              <Link href="/so-dang-ky-nguoi-nuoc-ngoai">
                <p>Sổ đăng ký người nước ngoài</p>
              </Link>
            </li>
          </ul>
        </li>

        <li className={cn(styles.item, styles.itemMobile)}>
          <Link className={cn(styles.itemName)} href="/dang-nhap">
            Đăng xuất
          </Link>
        </li>
      </ul>
      <div className={cn(styles.toggleBtn)}>
        {isOpen && (
          <IoIosArrowBack
            className={cn(styles.iconToggle)}
            onClick={handleToggleClose}
          />
        )}
        {!isOpen && (
          <IoIosArrowForward
            className={cn(styles.iconToggle)}
            onClick={handleToggleOpen}
          />
        )}
      </div>
    </div>
  );
}

export default SideBarComponent;
