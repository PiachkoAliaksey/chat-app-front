import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import './Header.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { logout } from '../../redux/slices/auth';
import { Typography } from '@mui/material';

export const Header = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const isLoading = userData.status === 'loading';
  const isAuth = Boolean(userData.data);

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout'))
      dispatch(logout())
    window.localStorage.removeItem('token')
  };

  return (
    <div className="nav-bar">
      <Container maxWidth="lg">
        <div className="inner">
          <Link className="logo" to="/">
            <div>Chat APP</div>
          </Link>
          <div className="buttons">
            {isAuth ? (
              <>
              {isLoading?<Typography></Typography>:<Typography variant="h5" sx={{color:'blueviolet',display:'flex',alignItems:'center'}}>Hello,{userData.data.fullName}!</Typography>}
              <Button onClick={onClickLogout} variant="contained" color="error">
                    Log out
                  </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="contained">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
