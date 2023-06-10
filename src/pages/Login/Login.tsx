import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import { useDispatch,useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { AnyAction } from "redux";
import { fetchUserData} from "../../redux/slices/auth";
import { RootState } from "redux/store";
import "./Login.scss";

export const Login:React.FC = () => {
  const isAuth = useSelector((state:RootState) => Boolean(state.auth.userData.data))
  const dispatch:ThunkDispatch<{fullName: string}, void, AnyAction> = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: ''
    },
    mode:'onChange'
  })

  const onSubmit = async(values: { fullName: string}) => {
    console.log(values);
    const data = await dispatch(fetchUserData(values));
    if(!data.payload){
      return alert('Please, write Full Name correct')
    }

    if('token' in data.payload){
      window.localStorage.setItem('token',data.payload.token)
    }
  }

  if(isAuth){
    return <Navigate to='/'></Navigate>
  }

  return (
    <Paper classes={{ root: "registration-bar"}}>
      <Typography classes={{ root: "title" }} variant="h5">
        Enter to account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className="field"
          label="FullName"
          type='text'
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'fullName' })}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Enter
        </Button>
      </form>
    </Paper>
  );
};
