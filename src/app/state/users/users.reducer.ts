import { createReducer, on } from "@ngrx/store"
import { addUser, deleteUser, updateUser, getInitialUsers } from "./users.action";
import { initialState } from "./users.state";

const _usersReducer = createReducer(
  initialState,
  on(addUser, (state, action) => {
    let newUser = {...action.user};
    return {
      ...state,
      users: [...state.users, newUser],
    };
  }),

  on(deleteUser, (state, action) => {

    const updated_users = state.users.filter((user) => {
      return user.id !== action.userId
    })

    return {
      ...state,
      users: updated_users,
    };
  }),

  on(updateUser, (state, action) => {

    const updated_user = state.users.map((user) => {
      return action.user.id === user.id ? action.user : user;
    })

    return {
      ...state,
      users: updated_user,
    };
  }),

  on(getInitialUsers, (state, action) => {
    let users = action.users;
    return {
      ...state,
      users: users,
    };
  }),
);

export function usersReducer(state, action) {
  return _usersReducer(state, action);
}
