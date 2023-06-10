import { Store } from "redux"
import { configureStore} from "@reduxjs/toolkit";

import { usersTableReducer } from "./slices/usersTable";
import { authReducer } from "./slices/auth";
import{messagesReducer} from "./slices/messages"
import {allMessagesReducer} from "./slices/allMessages"



export const store:Store = configureStore({
  reducer: {
    users:usersTableReducer,
    auth:authReducer,
    messages:messagesReducer,
    allMessages:allMessagesReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
