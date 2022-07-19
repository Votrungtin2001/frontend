import { createReducer, on } from "@ngrx/store"
import { UsersListComponent } from "src/app/dashboard/users-list/users-list.component";
import { addUser, deleteUser, updateUser, getInitialUsers, getInitialUsersByTitle } from "./users.action";
import { initialState, UsersGroupByTitle } from "./users.state";

const _usersReducer = createReducer(
  initialState,
  on(getInitialUsers, (state, action) => {
    let users = action.users;
    return {
      ...state,
      users: users,
    };
  }),

  on(getInitialUsersByTitle, (state, action) => {
    let usersByTitle = action.usersGroupByTitle;
    return {
      ...state,
      usersGroupByTitle: usersByTitle,
    };
  }),

  on(addUser, (state, action) => {
    let newUser = {...action.user};
    const usersGroupByTitle = Object.assign([], state.usersGroupByTitle);
    let results = [];
    usersGroupByTitle.map((element) => {
      if(element.titleId === action.user.UserTitleId) {
        let users = [];
        element.users.map((u) => users.push(u));
        users.push(newUser);
        const usersGroupByTitleModel: UsersGroupByTitle = {
          titleId: action.user.UserTitleId,
          users: users
        }
        results.push(usersGroupByTitleModel);
      }
      else results.push(element);
    })
    return {
      ...state,
      users: [...state.users, newUser],
      usersGroupByTitle: results,
    };
  }),

  on(updateUser, (state, action) => {
    const updated_users = state.users.map((user) => {
      return action.user.UserId === user.UserId ? action.user : user;
    })

    let usersByTitle: UsersGroupByTitle[] = [];
    updated_users.map((user) => {
      if(usersByTitle.length == 0) {
        const object: UsersGroupByTitle = {
          titleId: user.UserTitleId,
          users: []
        }
        usersByTitle.push(object);
      }

      const existingObject = usersByTitle.find((element) => element.titleId === user.UserTitleId);
      if(existingObject === undefined) {
        const object: UsersGroupByTitle = {
          titleId: user.UserTitleId,
          users: []
        }
        usersByTitle.push(object);
      }

      usersByTitle.map((element) => {
        if(element.titleId === user.UserTitleId) element.users.push(user);
        return element;
      })
    });

    return {
      ...state,
      users: updated_users,
      usersGroupByTitle: usersByTitle
    };
  }),

  on(deleteUser, (state, action) => {
    const updated_users = state.users.filter((user) => {
      return user.UserId !== action.userId;
    })

    let usersByTitle: UsersGroupByTitle[] = [];
    updated_users.map((user) => {
      if(usersByTitle.length == 0) {
        const object: UsersGroupByTitle = {
          titleId: user.UserTitleId,
          users: []
        }
        usersByTitle.push(object);
      }

      const existingObject = usersByTitle.find((element) => element.titleId === user.UserTitleId);
      if(existingObject === undefined) {
        const object: UsersGroupByTitle = {
          titleId: user.UserTitleId,
          users: []
        }
        usersByTitle.push(object);
      }

      usersByTitle.map((element) => {
        if(element.titleId === user.UserTitleId) element.users.push(user);
        return element;
      })
    });

    return {
      ...state,
      users: updated_users,
      usersGroupByTitle: usersByTitle
    };
  }),
);

export function usersReducer(state, action) {
  return _usersReducer(state, action);
}
