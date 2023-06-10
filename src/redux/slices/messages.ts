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



export const fetchAddMessage = createAsyncThunk('message/fetchAddMessage', async (params:{from:string,to:string,message:string,title:string}) => {
  const { data } = await instance.post('/addmsg',params);
  return data;
})



interface IInitialState {
    messages: {
      _id:string,
      message:{},
      users:string[],
      sender:string,
      createdAt:string,
      updatedAt:string,
      __v:number
    }|{},
    status: string
}
const initialState = {
    messages: {},
    status: 'loading'

}as IInitialState;

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers:(builder)=> {
    builder.addCase(fetchAddMessage.pending, (state) => {
      state.messages={};
      state.status = 'loading';
    })
    builder.addCase(fetchAddMessage.fulfilled, (state, action) => {
      state.messages = action.payload
      state.status = 'loaded'
    })
    builder.addCase(fetchAddMessage.rejected, (state) => {
      state.messages={};
      state.status = 'error'
    })

  }
})

export const messagesReducer = messagesSlice.reducer;
