
import React from "react";
import { Skeleton } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';



export const SkeletonUsers = () => {

  return (
    <>
      {([...new Array(5)].map((user, index) => (<ListItemButton key={index} >
        <ListItemIcon>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemIcon>
        <Skeleton variant="text" sx={{ fontSize: '20rem' }} />
      </ListItemButton>)))}

    </>
  )
}
