import { createAction, props } from "@ngrx/store";
import { User } from "src/app/model/user.model";
import { UsersGroupByTitle } from "./users.state";

export const GET_INITIAL_USERS_ACTION = '[users page] get initial users';
export const GET_INITIAL_USERS_BY_TITLE_ACTION = '[users page] get initial users by title';
export const ADD_USER_ACTION = '[user page] add user';
export const DELETE_USER_ACTION = '[user page] delete user';
export const UPDATE_USER_ACTION = '[user page] update user'

export const getInitialUsers = createAction(GET_INITIAL_USERS_ACTION, props<{users: User[]}>());
export const getInitialUsersByTitle = createAction(GET_INITIAL_USERS_BY_TITLE_ACTION, props<{usersGroupByTitle: UsersGroupByTitle[]}>());
export const addUser = createAction(ADD_USER_ACTION, props<{user: User}>());
export const updateUser = createAction(UPDATE_USER_ACTION, props<{user: User}>());
export const deleteUser = createAction(DELETE_USER_ACTION, props<{userId: number}>());

