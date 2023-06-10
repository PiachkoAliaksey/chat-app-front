import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "redux/store";
import { useForm } from "react-hook-form";
import { fetchRegister } from '../../redux/slices/auth';
import { Navigate } from "react-router-dom";

import './Registration.scss';

export const Registration: React.FC = () => {
  const isAuth = useSelector((state: RootState) => Boolean(state.auth.userData.data))
  const dispatch: ThunkDispatch<{fullName: string }, void, AnyAction> = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: ''
    },
    mode: 'onSubmit'
  })

  const onSubmit = async (values: {fullName: string }) => {
    console.log(values);
    const data = await dispatch(fetchRegister(values));
    console.log(data);
    if (!data.payload) {
      return alert('Not available registration, user exist, please choose other Full Name ')
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to='/'></Navigate>
  }

  return (
    <Paper classes={{ root: "registration-bar" }}>
      <Typography classes={{ root: "title" }} variant="h5">
        Enter in chat application
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Write fullName' })} sx={{mb: 3}} className="registration-field" label="Full name" fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Enter
        </Button>
      </form>
    </Paper>
  );
};
