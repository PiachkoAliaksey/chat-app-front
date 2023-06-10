import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { io, Socket } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux';
import Paper, { Button } from '@mui/material/';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import { RootState } from 'redux/store';
import { fetchUsersTable } from '../redux/slices/usersTable';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { stringAvatar } from '../utils/createNameAvatar';
import { useForm } from "react-hook-form";
import { fetchAddMessage } from "../redux/slices/messages"
import { fetchAllMessages } from "../redux/slices/allMessages"
import { IInitialStateAllMessages } from '../redux/slices/allMessages';
import { SkeletonUsers } from '../components/SkeletonUsers/SkeletonUsers';
import {SkeletonUser} from '../components/SkeletonUsers/SkeletonUser'

export interface IUser {
  _id: string,
  fullName: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}

interface IHome {
  socket: Socket,
  setStatePane: React.Dispatch<React.SetStateAction<{
    isPaneOpen: boolean;
    isPaneOpenLeft: boolean;
  }>>,
  statePane: {
    isPaneOpen: boolean;
    isPaneOpenLeft: boolean;
  },
  setMessageBack: React.Dispatch<React.SetStateAction<{
    fromUser: string;
    message: string;
  } | null>>
}


export const Home: React.FC<IHome> = ({ socket, setStatePane, statePane, setMessageBack }) => {
  const lastMessageRef = useRef<null | HTMLLIElement>(null);
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<IUser[], void, AnyAction> = useDispatch();
  const userData: { data: IUser, status: string } = useSelector((state: RootState) => state.auth.userData);
  const messagesData: IInitialStateAllMessages = useSelector((state: RootState) => state.allMessages)
  const { items, status }: { items: IUser[], status: string } = useSelector((state: RootState) => state.users.users)

  const isLoadingUser = userData.status === 'loading';
  const isAuth = Boolean(userData.data);
  const existMessages = messagesData.status === 'loading';
  const isTableUsersLoading = status === 'loading';

  const [currentSelectedChat, setCurrentSelectedChat] = useState<number | null>(null);
  const [chatChange, setChatChange] = useState<IUser>({ _id: '', fullName: '', createdAt: '', updatedAt: '', __v: 0 });
  const [msg, setMsg] = useState<string>('');
  const [msgTitle, setMsgTitle] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{
    fromSelf: boolean,
    title: string,
    message: string,
    created: string
  }[]>([]);
  const [chatMessagesArrival, setChatMessagesArrival] = useState<{
    fromSelf: boolean,
    title:string,
    message: string,
    created: string
  } | null>(null);
  const [userSenderMessages, setUserSenderMessages] = useState<string>('');



  const handleSendMessage = async (msg: { message: string, title: string }) => {
    if (chatChange._id.length > 0 && msg.message.length > 0 && msg.title.length > 0) {
      console.log(msg.title)
      await dispatch(fetchAddMessage({ "from": userData.data._id, "to": chatChange._id, "message": msg.message,"title":msg.title }));

      socket.emit('send-msg', {
        to: chatChange._id,
        from: userData.data._id,
        title: msg.title,
        message: msg.message,
        senderUser: userData.data.fullName
      })
      const messages = [...chatMessages];
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      messages.push({ fromSelf: true,title:msg.title, message: msg.message, created: time });
      setChatMessages(messages);
      setMsg('');
      setMsgTitle('');
    }
  }


  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    values: {
      message: msg,
      title: msgTitle
    },
    mode: 'onSubmit'
  })


  const handleChatChange = async (index: number, contact: IUser) => {
    setCurrentSelectedChat(index);
    setChatChange(contact);
  }

  useEffect(() => {
    if (isAuth) {
      socket.emit('add-user', userData.data._id)
    }
  }, [isAuth]);

  useEffect(() => {
    socket.on('msg-receive', (data) => {
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      setChatMessagesArrival({ fromSelf: false,title:data.title, message: data.message, created: time });
      setUserSenderMessages(data.senderUser);
    });
  }, []);

  useEffect(() => {
    chatMessagesArrival && setMessageBack({ fromUser: userSenderMessages, message: chatMessagesArrival.message });
    chatMessagesArrival && setChatMessages(prev => [...prev, chatMessagesArrival]);
    chatMessagesArrival && setStatePane({ ...statePane, isPaneOpen: true });
  }, [chatMessagesArrival]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (chatChange._id.length > 0) {
      (async () => {
        const data = await dispatch(fetchAllMessages({ "from": userData.data._id, "to": chatChange._id }));
        console.log(data.payload);
        setChatMessages(data.payload);
      })()
    }
  }, [chatChange])

  useEffect(() => {
    if (isAuth) {
      (async () => await dispatch(fetchUsersTable(userData.data._id)))()
    }
  }, [isAuth])

  return (
    <>
      {isAuth ? <div>
        <Box boxShadow='rgba(0, 0, 0, 0.16) 0px 1px 4px;'>
          <Grid container sx={{ width: '100%', background: 'white', color: 'black' }}>
            <Grid item xs={3} sx={{ borderRight: '1px solid #e0e0e0' }}>
              <List sx={{ overflowY: 'auto' }}>
                {isLoadingUser ? <SkeletonUser/> : (<ListItem key={userData.data.fullName}>
                  <ListItemIcon>
                    <Avatar {...stringAvatar(userData.data.fullName)} />
                  </ListItemIcon>
                  <ListItemText primary={userData.data.fullName}></ListItemText>
                  <Button size="small" variant="contained" onClick={() => handleChatChange(Number(userData.data._id.slice(0, 3)), userData.data)} >Self message</Button>
                </ListItem>)}
              </List>
              <Divider />
              <Divider />
              <List sx={{ overflowY: 'auto' }} >
                {!isTableUsersLoading ? (items.map((user, index) => (<ListItemButton onClick={() => handleChatChange(index, user)} key={user._id} sx={{ background: (currentSelectedChat === index ? 'blue' : 'none') }} >
                  <ListItemIcon>
                    <Avatar {...stringAvatar(user.fullName)} />
                  </ListItemIcon>
                  <ListItemText primary={user.fullName}>{user.fullName}</ListItemText>
                </ListItemButton>))) : <SkeletonUsers/>}
                <ListItemButton sx={{ backgroundColor: 'aquamarine' }} onClick={() => navigate('/chatnewuser')} >
                  <ListItemText sx={{ textAlign: 'center' }} primary='Chat a new user'>Chat a new user</ListItemText>
                </ListItemButton>
              </List>
            </Grid>
            <Grid item xs={9}>
              <List sx={{ height: '70vh', overflowY: 'auto' }} >
                {chatChange._id.length > 0 ? ((chatMessages.length > 0) ? (chatMessages.map((user, index) => {
                  return (
                    <>
                      {user.fromSelf ? (<ListItem key={uuidv4()} ref={lastMessageRef}>
                        <Grid container>
                          <Grid item xs={12}>
                            <Accordion>
                              <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>{user.title}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography sx={{ textAlign: 'right' }}>
                                  {user.message}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                          <Grid item xs={12}>
                            <ListItemText sx={{ textAlign: 'right' }} secondary={user.created}></ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>) : (<ListItem key={uuidv4()} ref={lastMessageRef} >
                        <Grid container>
                          <Grid item xs={12}>
                            <Accordion>
                              <AccordionSummary
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography sx={{ textAlign: 'left' }}>{user.title}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography sx={{ textAlign: 'left' }}>
                                  {user.message}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                          <Grid item xs={12}>
                            <ListItemText sx={{ textAlign: 'left' }} secondary={user.created}></ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>)}
                    </>
                  )
                })) : <Box sx={{ color: "blue", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Typography variant="h4">Start chat with this person</Typography></Box>) : (<Box sx={{ color: "blue", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Typography variant="h4">Choose person to start chatting</Typography></Box>)}

              </List>
              <Divider />
              <form onSubmit={handleSubmit(handleSendMessage)}>
                <Grid container style={{ padding: '20px' }}>
                  <Grid item xs={4}>
                    <TextField  {...register('title', { value: msgTitle })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setMsgTitle(e.currentTarget.value)} label="Write title..." fullWidth />
                  </Grid>
                  <Grid item xs={7}>
                    <TextField  {...register('message', { value: msg })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setMsg(e.currentTarget.value)} label="Write message..." fullWidth />
                  </Grid>
                  <Grid item xs={1}>
                    <Fab type="submit" color="primary" aria-label="add"><SendIcon /></Fab>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>

        </Box>

      </div> : ''}
    </>
  );
};
