import { createUserDto } from 'types/create-user.dto';
import { UserModel } from '../models/users.model';

export class UserService {
  constructor() {
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  public async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  public async getUserById(id: string) {
    const user = await UserModel.findById(id);
    return user; 
  }
  
  public async getUserByUsername(username: string) {
    const user = await UserModel.findOne({ username: username });
    return user;
  }

  public async createUser(user: createUserDto) {
    const newUser = await UserModel.create(user);
    return newUser;
  }

}