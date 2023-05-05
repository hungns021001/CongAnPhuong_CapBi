import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "./authSlice";
import { apiServer } from "../constant";
import BaseAxios from "./setUpAxios";

export const loginHandle = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const url = apiServer.auth.login;
        const res = await BaseAxios.post(url, user);
        dispatch(loginSuccess(res.data));

        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("fullname", res.data.fullname);
        localStorage.setItem("roleId", res.data.roleId);

        sessionStorage.setItem("token", res.data.accessToken);
        sessionStorage.setItem("username", res.data.username);
        sessionStorage.setItem("fullname", res.data.fullname);
        sessionStorage.setItem("roleId", res.data.roleId);

        navigate.push("/so-theo-doi-gui-kiem-dinh");
    } catch (error) {
        dispatch(loginFailed());
        return error.response.data;
    }
};
