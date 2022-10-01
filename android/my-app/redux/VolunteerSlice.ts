import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface VolunteerState {
    EMAIL_ID: String,
    PASSWORD:String,
    NAME:String,
    ADDRESS:String,
    PHONE_NUMBER:Number,
    CURRECT_ORDER:Boolean,
    LAST_SEEN:any,
    LAST_FETCHED_LOCATION:any,
    LOGGED_IN:boolean,
    PROFILE_URL:String,
    ORDER_DONE:Number
  }

  const initialState: VolunteerState = {
    EMAIL_ID: "",
    ADDRESS: "",
    PASSWORD:"",
    NAME:"",
    PHONE_NUMBER:0,
    CURRECT_ORDER:false,
    LAST_SEEN:'',
    LAST_FETCHED_LOCATION:'',
    LOGGED_IN:false,
    PROFILE_URL:'',
    ORDER_DONE:0
  }

  export const volunteerSlice = createSlice({
    name: 'volunteer',
    initialState,
    reducers: {
      setEmailPass: (state,action:PayloadAction<{
        EMAIL:String,
        PASSWORD:String
      }>) => {
        state.EMAIL_ID=action.payload.EMAIL
        state.PASSWORD=action.payload.PASSWORD
      },
      setProfileUrl:(state,action:PayloadAction<String>)=>{
        state.PROFILE_URL = `https://ui-avatars.com/api/?background=random&name=${action.payload.replace((/ /g),'+')}`
      },
      setAuthentication: (state,action:PayloadAction<boolean>)=>{
        state.LOGGED_IN=action.payload
      },
      setVolunteerInfo: (state, action: PayloadAction<{
        NAME:String,
        ADDRESS:String,
        PHONE_NUMBER:Number,
      }>) => {
        state.NAME=action.payload.NAME
        state.PHONE_NUMBER=action.payload.PHONE_NUMBER
        state.ADDRESS= action.payload.ADDRESS;
      },
    },
  })

  export const { setEmailPass, setVolunteerInfo,setProfileUrl,setAuthentication } = volunteerSlice.actions

export default volunteerSlice.reducer