import cn from 'classnames'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './index.module.css'
import { AiOutlineMenu,AiOutlineCloseCircle } from 'react-icons/ai';

function Header() {

    const [userName,setUserName] = useState("")
    const [roleId,setRoleId] = useState("")

    const [modalMobile,setModalMobile] = useState(false)
    const [openNav1,setOpenNav1] = useState(false)
    const [openNav2,setOpenNav2] = useState(false)
    const [openNav3,setOpenNav3] = useState(false)

    useEffect(()=>{
        setUserName(window.localStorage.getItem('fullname'));
        setRoleId(window.localStorage.getItem('roleId'));
    },[])
    
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("roleId")
        localStorage.removeItem("fullname")

        sessionStorage.removeItem("token")
        sessionStorage.removeItem("username")
        sessionStorage.removeItem("roleId")
        sessionStorage.removeItem("fullname")
    }
    
    console.log(userName)
    console.log(roleId)
    const handleSetNav1 = () => {
        setOpenNav1(!openNav1)
        setOpenNav2(false)
        setOpenNav3(false)
    }

    const handleSetNav2 = () => {
        setOpenNav2(!openNav2)
        setOpenNav1(false)
        setOpenNav3(false)
    }

    const handleSetNav3 = () => {
        setOpenNav3(!openNav3)
        setOpenNav1(false)
        setOpenNav2(false)
    }

    return (
        <div className={cn(styles.header)}>
           {/* <div>
            {userName && <p className={cn(styles.textHeader)}>Xin chào, {userName}</p>}
           </div>
            <div onClick={()=>setModalMobile(true)} className={cn(styles.mobileMenu)}>
                <AiOutlineMenu/>
            </div>
           <div className={cn(styles.groupBtn)}>
            <ul className={cn(styles.navList)}>
              {
                roleId === "6" && <li>
                <Link href="/dang-ky">Đăng ký</Link>
            </li>
              }
                <li>
                    <Link href="/home">Trang chủ</Link>
                </li>
                <li className={cn(styles.navItem1)}>Nhóm tổng hợp
                    <ul className={cn(styles.subNav1)}>
                        <li>
                            <Link href="/so-truc-ban">Sổ trực ban</Link>
                        </li>
                        <li>
                            <Link href="/so-tinh-hinh">Sổ tình hình</Link>
                        </li>
                        <li>
                            <Link href="/so-tiep-nhan-cong-van">Sổ tiếp nhận công văn</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-van-ban-di">Sổ theo dõi văn bản đi</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-xac-nhan-nhan-than">Sổ theo dõi xác nhận nhân thân</Link>
                        </li>
                        <li>
                            <Link href="/so-dang-ky-nguoi-nuoc-ngoai">Sổ đăng ký người nước ngoài</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-cong-dan-lam-ho-chieu">Sổ Theo dõi công dân làm hộ chiếu</Link>
                        </li>
                    </ul>
                </li>
                <li className={cn(styles.navItem2)}>Nhóm cảnh sát trật tự 
                    <ul className={cn(styles.subNav2)}>
                        <li>
                            <Link href="/so-theo-doi-xu-phat">Sổ theo dõi xử phạt</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-gui-kiem-dinh">Sổ theo dõi gửi kiểm định</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-khong-xu-ly">Sổ theo dõi không xử lý</Link>
                        </li>
                    </ul>
                </li>
                <li className={cn(styles.navItem3)}>Nhóm phòng chống tội phạm
                     <ul className={cn(styles.subNav3)}>
                        <li>
                            <Link href="/so-theo-doi-quyet-dinh-xu-phat">Sổ theo dõi quyết định xử phạt</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-xu-ly-vu-viec">Sổ theo dõi xử lý vụ việc</Link>
                        </li>
                    </ul>
                </li>
            </ul>
             <a onClick={handleLogout} href='/dang-nhap' className={cn(styles.logoutBtn)}>Đăng xuất</a>
           </div>

          { modalMobile && <div className={cn(styles.navMobile)}>
              <div className={cn(styles.navBox)}>
                <div onClick={()=>setModalMobile(false)} className={cn(styles.closeNavMb)}>
                    <AiOutlineCloseCircle/>
                </div>
                <ul>
                {
                roleId === "6" && <li className={cn(styles.itemMobile)}>
                <Link href="/dang-ky">Đăng ký</Link>
            </li>
              }
              <li className={cn(styles.itemMobile)}>
                    <Link href="/home">Trang chủ</Link>
                </li>
                  <li onClick={handleSetNav1} className={cn(styles.itemMobile)}>Nhóm tổng hợp
                    {
                        openNav1 && <ul className={cn(styles.subnav1Mobile)}>
                        <li>
                                <Link href="/so-truc-ban">Sổ trực ban</Link>
                            </li>
                            <li>
                                <Link href="/so-tinh-hinh">Sổ tình hình</Link>
                            </li>
                            <li>
                                <Link href="/so-tiep-nhan-cong-van">Sổ tiếp nhận công văn</Link>
                            </li>
                            <li>
                                <Link href="/so-theo-doi-van-ban-di">Sổ theo dõi văn bản đi</Link>
                            </li>
                            <li>
                                <Link href="/so-theo-doi-xac-nhan-nhan-than">Sổ theo dõi xác nhận nhân thân</Link>
                            </li>
                            <li>
                                <Link href="/so-dang-ky-nguoi-nuoc-ngoai">Sổ đăng ký người nước ngoài</Link>
                            </li>
                            <li>
                                <Link href="/so-theo-doi-cong-dan-lam-ho-chieu">Sổ Theo dõi công dân làm hộ chiếu</Link>
                            </li>
                        </ul>
                    }
                  </li>
                  <li onClick={handleSetNav2} className={cn(styles.itemMobile)}>Nhóm cảnh sát trật tự
                    {
                        openNav2 &&  <ul className={cn(styles.subnav1Mobile)}>
                        <li>
                            <Link href="/so-theo-doi-xu-phat">Sổ theo dõi xử phạt</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-gui-kiem-dinh">Sổ theo dõi gửi kiểm định</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-khong-xu-ly">Sổ theo dõi không xử lý</Link>
                        </li>
                    </ul>
                    }
                  </li>
                  <li onClick={handleSetNav3} className={cn(styles.itemMobile)}>Nhóm phòng chống tội phạm
                    {
                        openNav3 &&  <ul className={cn(styles.subnav1Mobile)}>
                        <li>
                            <Link href="/so-theo-doi-quyet-dinh-xu-phat">Sổ theo dõi quyết định xử phạt</Link>
                        </li>
                        <li>
                            <Link href="/so-theo-doi-xu-ly-vu-viec">Sổ theo dõi xử lý vụ việc</Link>
                        </li>
                    </ul>
                    }
                  </li>

                </ul>
                <a style={{display:'block',textAlign:'center'}} onClick={handleLogout} href='/dang-nhap' className={cn(styles.logoutBtn,styles.logoutMb)}>Đăng xuất</a>
              </div>
           </div> } */}
        </div>
    );
}

export default Header;