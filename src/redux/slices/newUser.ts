import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface IInitialState {
  userData:{
    data: {
      _id: string,
      fullName: string,
      token: string,
      createdAt: string,
      updatedAt: string,
      __v: number
    }|null,
    status: string
  }
}



const REACT_APP_API_URL = 'http://localhost:4444';

const instance = axios.create({
  baseURL: REACT_APP_API_URL
});


export const fetchNewUser = createAsyncThunk('fetch/newUser', async (params:{fullName:string}) => {
  const { data } = await instance.post('/auth/newUser',params);
  return data;
})

const initialState = {
  userData:{
    data: null,
    status: 'loading'
  }

} as IInitialState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userData.data = null;
    }
  },
  extraReducers: (builder) => {

    builder.addCase(fetchNewUser.pending, (state) => {
      state.userData.status = 'loading';
      state.userData.data = null;
    })
    builder.addCase(fetchNewUser.fulfilled, (state, action) => {
      state.userData.status = 'loaded'
      state.userData.data = action.payload
    })
    builder.addCase(fetchNewUser.rejected, (state) => {
      state.userData.status = 'error';
      state.userData.data = null;
    })
  }

})
export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions
