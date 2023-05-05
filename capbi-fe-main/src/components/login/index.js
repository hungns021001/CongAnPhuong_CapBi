import cn from "classnames";
import styles from "./index.module.css";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useState, useEffect } from "react";
import { loginHandle } from "@/store/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Loading from "../loadingComponent";
import ModalConfirm from "@/NewComponents/modalConfirm";
import { Text, SubStrings } from "@/constant";

function Login() {
    const error = useSelector((state) => state.authSlice.login.error);
    const [loading, setLoading] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [hidePass, setHidePass] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorUserName, setErrorUserName] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const dispatch = useDispatch();
    const navigate = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        let dataForm = {
            username: userName,
            password: password,
        };
        setLoading(true);
        const returnErr = await loginHandle(dataForm, dispatch, navigate);
        if (returnErr?.error_code) {
            setLoading(false);
            if (returnErr.error_code === 4) {
                setModalConfirm(true);
                setErrorTitle("Tên đăng nhập không tồn tại, vui lòng thử lại");
            } else if (returnErr.error_code === 7) {
                setModalConfirm(true);
                setErrorTitle("Mật khẩu không chính xác, vui lòng thử lại");
            } else {
                setModalConfirm(true);
                setErrorTitle("Lỗi hệ thống, vui lòng thử lại sau");
            }
        }
    };
    const handleSetUserName = (e) => {
        const userNameId = document.getElementById("username");
        setUserName(e.target.value);
        userNameId.style.border = "1px solid #fff";
        setErrorUserName(false);
    };
    const handleBlurUserName = (e) => {
        const userNameId = document.getElementById("username");
        if (userName === "") {
            userNameId.style.border = Text.error.login
            setErrorUserName(true);
        }
    };
    const handleSetPassword = (e) => {
        const passwordId = document.getElementById("password");
        setPassword(e.target.value);
        passwordId.style.border = "1px solid #fff";
        setErrorPassword(false);
    };
    const handleBlurPassword = (e) => {
        const passwordId = document.getElementById("password");
        if (password === "") {
            passwordId.style.border = Text.error.login
            setErrorPassword(true);
        }
    };
    useEffect(() => {
        if (error) {
            alert("Đã xảy ra lỗi,vui lòng thử lại");
        }
    }, []);

    return (
        <div className={cn(styles.wrapper)}>
            {modalConfirm && (
                <ModalConfirm
                    backgroundColor="rgba(3, 3, 3, 0.7)"
                    closeModal={() => setModalConfirm(false)}
                    deleteBtn={false}
                    alertBtn={true}
                    description={errorTitle}
                />
            )}
            {loading ? <Loading /> : null}
            <div className={cn(styles.bgLogin)}>
                <div className={cn(styles.boxLogin)}>
                    <img className={cn(styles.sponsorLogo)} src={SubStrings.subDirection.imgs.policeLogo} alt="" />
                    <div className={cn(styles.loginForm)}>
                        <form onSubmit={handleSubmit}>
                            <div className={cn(styles.inputGroup)}>
                                <div className={cn(styles.labelAndInput)}>
                                    <label className={cn(styles.labelInput)} htmlFor="username">
                                        {Text.placeHolder.dataRegister.userName}:
                                    </label>
                                    <div id="username" className={cn(styles.userName)}>
                                        <input
                                            onBlur={handleBlurUserName}
                                            onChange={handleSetUserName}
                                            value={userName}
                                            type="text"
                                            placeholder={Text.placeHolder.dataRegister.userName}
                                        />
                                    </div>
                                    {errorUserName ? (
                                        <span className={cn(styles.errorUserName)}>
                                            Vui lòng nhập vào tên đăng nhập
                                        </span>
                                    ) : null}
                                </div>
                                <div className={cn(styles.labelAndInput)}>
                                    <label className={cn(styles.labelInput)} htmlFor="password">
                                        {Text.placeHolder.dataRegister.password}:
                                    </label>
                                    <div id="password" className={cn(styles.password)}>
                                        <input
                                            onBlur={handleBlurPassword}
                                            onChange={handleSetPassword}
                                            value={password}
                                            placeholder={Text.placeHolder.dataRegister.password}
                                            type={hidePass ? "text" : "password"}
                                        />
                                        {hidePass ? (
                                            <AiFillEyeInvisible
                                                onClick={() => setHidePass(!hidePass)}
                                                className={cn(styles.iconShowPass)}
                                            />
                                        ) : (
                                            <AiFillEye
                                                onClick={() => setHidePass(!hidePass)}
                                                className={cn(styles.iconShowPass)}
                                            />
                                        )}
                                    </div>
                                    {errorPassword ? (
                                        <span className={cn(styles.errorUserName)}>Vui lòng nhập vào mật khẩu</span>
                                    ) : null}
                                </div>
                            </div>
                            <div className={cn(styles.btnGroup)}>
                                <button
                                    className={
                                        userName === "" || password === ""
                                            ? cn(styles.disabled)
                                            : cn(styles.activeButton)
                                    }
                                    disabled={userName === "" || password === ""}
                                    type="submit"
                                >
                                    <span className={cn(styles.btnSubmitLogin)}>Đăng nhập</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;
