import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from '../../pages/Home';


const REACT_APP_API_URL = 'http://localhost:4444';
const instance = axios.create({
  baseURL: REACT_APP_API_URL
});
//process.env.REACT_APP_API_URL

instance.interceptors.request.use((config)=>{
  config.headers.Authorization=window.localStorage.getItem('token');
  return config;
})

export const fetchUsersTable = createAsyncThunk('table/fetchUserTable', async (params:string) => {
  const { data } = await instance.get(`/allUsers/${params}`);
  return data;
})




interface IInitialState {
  users: {
    items: IUser[],
    status: string
  }
}
const initialState = {
  users: {
    items: [],
    status: 'loading'
  }
}as IInitialState;

const usersTableSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers:(builder)=> {
    builder.addCase(fetchUsersTable.pending, (state) => {
      state.users.items=[];
      state.users.status = 'loading';
    })
    builder.addCase(fetchUsersTable.fulfilled, (state, action) => {
      state.users.items = action.payload
      state.users.status = 'loaded'
    })
    builder.addCase(fetchUsersTable.rejected, (state) => {
      state.users.items=[];
      state.users.status = 'error'
    })

  }
})

export const usersTableReducer = usersTableSlice.reducer;


