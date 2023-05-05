import { createSlice } from "@reduxjs/toolkit";


const toastSlice = createSlice({
    name:'toastSlice',
    initialState:{
       isToastMsg:false
    },
    reducers:{
        setOpenToast: (state) => {
            state.isToastMsg = true
        },
        setHideToast: (state) => {
            state.isToastMsg = false
        }
    }
})

export const {
    setOpenToast,setHideToast
} = toastSlice.actions

export default toastSlice.reducer