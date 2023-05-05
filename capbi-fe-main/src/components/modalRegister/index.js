import styles from './index.module.css'
import classNames from 'classnames/bind';


import { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
    apiServer,
    Text,
} from "../../constant";
import BaseAxios from "@/store/setUpAxios";
import { notifyError, notifySuccess } from '@/notify';
import Loading from '../loadingComponent';

const cx = classNames.bind(styles)
function ModalRegister({ data, handleCloseModal, handleUpdate }) {
    const [readOnly, setReadOnly] = useState(false)
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [roles, setRoles] = useState([]);
    const [roleId, setRoleId] = useState("0");
    const [errorFullName, setErrorFullName] = useState(false);
    const [errorUserName, setErrorUserName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [errRoleId, setErrorRoleId] = useState(false);
    const [checkConfirmPassword, setCheckConfirmPassword] = useState(false);
    const [hidePass, setHidePass] = useState(false);
    const [hidePasss, setHidePasss] = useState(false);
    const [roleText, setRoleText] = useState()
    const checkIfDataIsEmpty = (data) => {
        let allValuesData = Object.values(data);
        for (let i in allValuesData) {
            if (allValuesData[i].toString()?.trim().length === 0) {
                return false;
            }
        }

        return true;
    };

    const inputRef = useRef()

    const checkPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return false;
        }
        return true;
    };

    const checkRoleId = (id) => {
        if (id === Text.noRole) {
            return false;
        }

        return true;
    };

    const checkDataRegister = (dataRegister) => {
        let checkEmpty = checkIfDataIsEmpty(dataRegister);
        let comparePassword = checkPassword(password, confirmPassword);
        let checkedRoleId = checkRoleId(dataRegister.roleId);
        if (checkEmpty && comparePassword && checkedRoleId) return true;
        return false;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        let dataRegister = {
            username: userName,
            password,
            confirmPassword,
            fullname: fullName,
            roleId,
        };
        if (
            fullName === "" ||
            userName === "" ||
            password === "" ||
            confirmPassword === "" ||
            roleId === "0"
        ) {
            if (fullName === "") {
                const fullnameId = document.getElementById("fullName");
                fullnameId.style.border = "1px solid var(--background-button-color)";
                setErrorFullName(true);
            }
            if (userName === "") {
                const userNameId = document.getElementById("userName");
                userNameId.style.border = "1px solid rgb(255, 177, 177)";
                setErrorUserName(true);
            }
            if (password === "") {
                const passwordId = document.getElementById("password");
                passwordId.style.border = "1px solid rgb(255, 177, 177)";
                setErrorPassword(true);
            }
            if (confirmPassword === "") {
                const confirmPasswordId = document.getElementById("confirmPassword");
                confirmPasswordId.style.border = "1px solid rgb(255, 177, 177)";
                setErrorConfirmPassword(true);
            }
            if (roleId === "0") {
                setErrorRoleId(true);
            }
        } else {
            if (confirmPassword !== password) {
                setCheckConfirmPassword(true);
            } else {
                BaseAxios({
                    method: "POST",
                    url: apiServer.auth.register,
                    data: dataRegister,
                })
                    .then((res) => {
                        handleUpdate()
                        setFullName("");
                        setUserName("");
                        setPassword("");
                        setConfirmPassword("");
                        setRoleId("0");
                        notifySuccess("Tạo tài khoản thành công");
                        handleCloseModal()
                    })
                    .catch((err) => {
                        setFullName("");
                        setUserName("");
                        setPassword("");
                        setConfirmPassword("");
                        setRoleId("0");
                        handleCloseModal()
                        notifyError("Có lỗi xảy ra,vui lòng thử lại");
                    });
            }
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const dataEdit = {
            username: userName,
            roleId: roleId,
            fullName: fullName
        }
        if (
            fullName === "" ||
            userName === "" ||
            roleId === "0"
        ) {
            if (fullName === "") {
                const fullnameId = document.getElementById("fullName");
                fullnameId.style.border = "1px solid var(--background-button-color)";
                setErrorFullName(true);
            }
            if (userName === "") {
                const userNameId = document.getElementById("userName");
                userNameId.style.border = "1px solid rgb(255, 177, 177)";
                setErrorUserName(true);
            }
            if (roleId === "0") {
                setErrorRoleId(true);
            }
        } else {
            BaseAxios({
                method: "PATCH",
                url: `api/admin/accounts/${data.Id}`,
                data: dataEdit,
            })
                .then((res) => {
                    handleUpdate()
                    setFullName("");
                    setUserName("");
                    setPassword("");
                    setConfirmPassword("");
                    setRoleId("0");
                    notifySuccess("Tạo tài khoản thành công");
                    handleCloseModal()
                })
                .catch((err) => {
                    setFullName("");
                    setUserName("");
                    setPassword("");
                    setConfirmPassword("");
                    setRoleId("0");
                    handleCloseModal()
                    notifyError("Có lỗi xảy ra,vui lòng thử lại");
                });
        }
    }

    useEffect(() => {
        inputRef.current.focus()
        if (data) {
            setReadOnly(true)
            setFullName(data.FullName)
            setUserName(data.Username)
            setRoleText(convertRoleId(Number(data.RoleId)))
        }
        BaseAxios({
            method: "POST",
            url: apiServer.roles.get,
        })
            .then((res) => {
                setRoles(res?.data?.data);
            })
            .catch(() => {
                notifyError("Có lỗi xảy ra !!!");
            });
    }, []);

    const changeRole = (e) => {
        setErrorRoleId(false);
        setRoleId(e.target.value);
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

    const handleKeyDown = (e) => {
        console.log('aaaaa');
        if (e.keyCode === 13) {
            if (data) {
                handleEditSubmit(e)
            } else {
                handleRegister(e)
            }
        }
    }

    return (
        <div className={cx('content')}>
            <div className={cx('contentbody')}>
                <div className={cx('bgLogin')}>
                    <div className={cx('boxLogin')}>
                        <div className={cx('loginForm')}>
                            <form className={cx('formTag')}>
                                {/* <h2 className={cx('titlePage')}>{data ? "Chỉnh sửa tài khoản" : "Tạo Tài Khoản Mới"}</h2> */}
                                <div className={cx('inputGroup')}>
                                    <div id="fullName" className={cx('password')}>
                                        <label className={cx('label-input')}>{Text.placeHolder.dataRegister.fullName}<span>*</span></label>
                                        <input
                                            onKeyDown={(e) => handleKeyDown(e)}
                                            ref={inputRef}
                                            readOnly={readOnly}
                                            onChange={(e) => {
                                                setErrorFullName(false);
                                                const fullName = document.getElementById("fullName");
                                                fullName.style.borderColor = "var(--border-color)";
                                                return setFullName(e.target.value);
                                            }}
                                            type="text"
                                            value={fullName}
                                        />
                                        {errorFullName ? (
                                            <span className={cx('errorFullName')}>
                                                Vui lòng nhập vào tên đầy đủ
                                            </span>
                                        ) : null}
                                    </div>

                                    <div id="userName" className={cx('password')}>
                                        <label className={cx('label-input')}>{Text.placeHolder.dataRegister.userName}<span>*</span></label>
                                        <input
                                            onKeyDown={(e) => handleKeyDown(e)}
                                            readOnly={readOnly}
                                            type="text"
                                            value={userName}
                                            onChange={(e) => {
                                                setErrorUserName(false);
                                                const userName = document.getElementById("userName");
                                                userName.style.borderColor = "var(--border-color)";
                                                return setUserName(e.target.value);
                                            }}
                                        />
                                        {errorUserName ? (
                                            <span className={cx('errorFullName')}>
                                                Vui lòng nhập vào tên đăng nhập
                                            </span>
                                        ) : null}
                                    </div>
                                    {!data && (
                                        <>
                                            <div id="password" className={cx('password')}>
                                                <label className={cx('label-input')}>{Text.placeHolder.dataRegister.password}<span>*</span></label>
                                                <input
                                                    onKeyDown={(e) => handleKeyDown(e)}
                                                    readOnly={readOnly}
                                                    value={password}
                                                    onChange={(e) => {
                                                        setErrorPassword(false);
                                                        const password = document.getElementById("password");
                                                        password.style.borderColor = "var(--border-color)";
                                                        setPassword(e.target.value);
                                                    }}
                                                    type={hidePass ? "text" : "password"}
                                                />
                                                {hidePass ? (
                                                    <AiFillEyeInvisible
                                                        onClick={() => setHidePass(!hidePass)}
                                                        className={cx('iconShowPass')}
                                                    />
                                                ) : (
                                                    <AiFillEye
                                                        onClick={() => setHidePass(!hidePass)}
                                                        className={cx('iconShowPass')}
                                                    />
                                                )}
                                                {errorPassword ? (
                                                    <span className={cx('errorFullName')}>
                                                        Vui lòng nhập vào mật khẩu
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div id="confirmPassword" className={cx('password')}>
                                                <label className={cx('label-input')}>{Text.placeHolder.dataRegister.confirmPassword}<span>*</span></label>
                                                <input
                                                    onKeyDown={(e) => handleKeyDown(e)}
                                                    readOnly={readOnly}
                                                    type={hidePasss ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value);
                                                        setErrorConfirmPassword(false);
                                                        setCheckConfirmPassword(false);
                                                        const confirmPasswordId =
                                                            document.getElementById("confirmPassword");
                                                        confirmPasswordId.style.borderColor =
                                                            "var(--border-color)";
                                                    }}
                                                />
                                                {hidePasss ? (
                                                    <AiFillEyeInvisible
                                                        onClick={() => setHidePasss(!hidePasss)}
                                                        className={cx('iconShowPass')}
                                                    />
                                                ) : (
                                                    <AiFillEye
                                                        onClick={() => setHidePasss(!hidePasss)}
                                                        className={cx('iconShowPass')}
                                                    />
                                                )}
                                                {errorConfirmPassword ? (
                                                    <span className={cx('errorFullName')}>
                                                        Vui lòng nhập vào xác nhận mật khẩu
                                                    </span>
                                                ) : null}
                                                {checkConfirmPassword ? (
                                                    <span className={cx('errorFullName')}>
                                                        Mật khẩu xác nhận chưa đúng
                                                    </span>
                                                ) : null}
                                            </div>
                                        </>
                                    )}
                                    {readOnly && (
                                        <div className={cx('password')}>
                                            <label className={cx('label-input')}>Vị trí<span>*</span></label>
                                            <input
                                                readOnly={readOnly}
                                                type="text"
                                                value={roleText}
                                            />
                                        </div>
                                    )}
                                    {!readOnly && (<>
                                        <div id="fullName" className={cx('password')}>
                                            <select
                                                className={cx('select')}
                                                value={roleId}
                                                onChange={changeRole}
                                            >
                                                <option value="0">Chọn vai trò</option>
                                                {roles.map((role) => {
                                                    return (
                                                        <option
                                                            key={role.roleuser_Id}
                                                            value={role.roleuser_Id}
                                                        >
                                                            {role.roleuser_Name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {errRoleId ? (
                                                <span className={cx('errorFullName')}>
                                                    Vui lòng chọn quyền cho tài khoản
                                                </span>
                                            ) : null}
                                        </div>
                                    </>)}
                                </div>
                                {!data && (
                                    <div className={cx('btnGroup')}>
                                        <div className={cx("setText")}>
                                            <span className={cx("validatorText")}>{Text.inputRequired}</span>
                                        </div>
                                        <button onClick={handleCloseModal} className={cx("btn-cancel")}>Hủy</button>
                                        <button className={cx("btn-create")} onClick={handleRegister}>Tạo</button>
                                    </div>
                                )
                                }
                                {data && (
                                    <div className={cx('btnGroup')}>
                                        <div className={cx("setText")}>
                                            <span className={cx("validatorText")}>{Text.inputRequired}</span>
                                        </div>
                                        <button onClick={handleCloseModal} className={cx("btn-cancel")}>Hủy</button>
                                        {readOnly && <button className={cx("btn-create")}
                                            onClick={() => {
                                                setReadOnly(false)
                                                inputRef.current.focus()
                                            }} >
                                            Sửa
                                        </button>}
                                        {!readOnly && <button className={cx("btn-create")} onClick={handleEditSubmit} >Xong</button>}
                                    </div>
                                )
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalRegister;