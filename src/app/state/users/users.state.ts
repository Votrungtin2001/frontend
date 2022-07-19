import { User } from "src/app/model/user.model";

export class UsersGroupByTitle {
  titleId: number;
  users: User[];
}
export interface UsersState {
  users: User[];
  usersGroupByTitle: UsersGroupByTitle[]
}

export const initialState: UsersState = {
  users: [],
  usersGroupByTitle: []
}
