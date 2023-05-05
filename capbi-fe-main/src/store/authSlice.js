import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:'auth',
    initialState:{
        login:{
            currentUser:null,
            isFetching:false,
            error:false,
            token:undefined,
            errMsg:"",
        }
    },
    reducers:{
        loginStart:(state) => {
            state.login.isFetching = true
        },
        loginSuccess:(state,action) => {
            state.login.isFetching = false
            state.login.error = false
            state.login.currentUser = action.payload
            state.login.token = action.payload.accessToken
        },
        loginFailed: (state,action) => {
            state.login.isFetching = false
            state.login.error = true
            state.login.errMsg = action.payload
        }
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailed
} = authSlice.actions

export default authSlice.reducer