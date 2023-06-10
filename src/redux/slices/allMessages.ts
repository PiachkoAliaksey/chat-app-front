import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



const REACT_APP_API_URL = 'http://localhost:4444';
const instance = axios.create({
  baseURL: REACT_APP_API_URL
});
//process.env.REACT_APP_API_URL

instance.interceptors.request.use((config)=>{
  config.headers.Authorization=window.localStorage.getItem('token');
  return config;
})



export const fetchAllMessages = createAsyncThunk('message/fetchAllMessages', async (params:{from:string,to:string}) => {
  const { data } = await instance.post('/getallmsg',params);
  return data;
})



export interface IInitialStateAllMessages {
    messages: {
      fromSelf:string,
      message:string,
      created:string,
    }[]|[],
    status: string
}
const initialState = {
    messages: [],
    status: 'loading'

}as IInitialStateAllMessages;

const allMessagesSlice = createSlice({
  name: 'allMessages',
  initialState,
  reducers: {},
  extraReducers:(builder)=> {
    builder.addCase(fetchAllMessages.pending, (state) => {
      state.messages=[];
      state.status = 'loading';
    })
    builder.addCase(fetchAllMessages.fulfilled, (state, action) => {
      state.messages = action.payload
      state.status = 'loaded'
    })
    builder.addCase(fetchAllMessages.rejected, (state) => {
      state.messages=[];
      state.status = 'error'
    })

  }
})

export const allMessagesReducer = allMessagesSlice.reducer;
