import { createAction, props } from "@ngrx/store";
import { User } from "src/app/model/user.model";

export const GET_INITIAL_USERS_ACTION = '[users page] get initial users';
export const ADD_USER_ACTION = '[user page] add user';
export const DELETE_USER_ACTION = '[user page] delete user';
export const UPDATE_USER_ACTION = '[user page] update user'

export const getInitialUsers = createAction(GET_INITIAL_USERS_ACTION, props<{users: User[]}>());
export const addUser = createAction(ADD_USER_ACTION, props<{user: User}>());
export const updateUser = createAction(UPDATE_USER_ACTION, props<{user: User}>());
export const deleteUser = createAction(ADD_USER_ACTION, props<{userId: number}>());

