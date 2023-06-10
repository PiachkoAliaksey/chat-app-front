import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import { useDispatch,useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { useNavigate } from "react-router-dom";
import { AnyAction } from "redux";
import { RootState } from "redux/store";



export const ChatNewUser:React.FC = () => {
  const navigate = useNavigate();
  const currentUserData:{_id: string,
    fullName: string,
    token: string,
    createdAt: string,
    updatedAt: string,
    __v: number} = useSelector((state: RootState) => state.auth.userData.data)

  const dispatch: ThunkDispatch<{fullName: string,message:string }, void, AnyAction> = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: '',
      message:''
    },
    mode: 'onSubmit'
  })

  const onSubmit = async (values: {fullName: string,message:string }) => {
    return navigate('/');
  }

return(
  <Paper sx={{width:'400px',padding: '50px',border: '1px solid #dedede', margin: '50px auto'}}>
      <Typography sx={{color:'black', textAlign:'center', marginBottom:'20px'}} variant="h5">
        Chat a new User
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Write fullName' })} sx={{mb: 3}} label="Full name" fullWidth />
          <TextField
          error={Boolean(errors.message?.message)}
          helperText={errors.message?.message}
          {...register('message', { required: 'Write message' })} sx={{mb: 3}} label="Message" fullWidth/>
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Sent message
        </Button>
      </form>
    </Paper>
)
}
