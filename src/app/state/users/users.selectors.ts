import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "./users.state";

export const USERS_STATE_NAME = 'users'

const getUsersState = createFeatureSelector<UsersState>(USERS_STATE_NAME);

export const getInitialUsers = createSelector(getUsersState, (state) => {
  return state.users;
})



