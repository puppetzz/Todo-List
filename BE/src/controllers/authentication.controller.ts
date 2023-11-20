import { Request, Response } from 'express';
import { UserModel } from '../models/users.model';
import bcrypt from 'bcrypt';
import { generateToken, random, hash } from '../helper';
import { Payload } from '../types/payload.type';

export class AuthenticationController {
  constructor() {
    this.register = this.register.bind(this);
  }

  public async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const existingUser = await UserModel.findOne({ username: username });

      if (existingUser) return res.status(400).json({ message: "Username already exists" });
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);


      const userDto = {
        username: username,
        password: passwordHash,
        role: role || "user",
      }

      const newUser = await UserModel.create(userDto);
      
      const user = await UserModel.findById(newUser._id);

      return res.status(201).json(user);
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await UserModel.findOne({ username: username }).select("+password");

      if (!user) return res.status(400).json({ message: "Username or password is incorrect" });

      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) return res.status(400).json({ message: "Username or password is incorrect" });

      const payload: Payload = {
        id: user._id.toString(),
        username: user.username,
      }

      const token = generateToken(payload);

      const refreshToken = token.refreshToken;
      const refreshTokenSalt = await random();

      user.refreshToken = await hash(refreshTokenSalt, refreshToken);
      user.refreshTokenSalt = refreshTokenSalt;

      await user.save();
      
      return res.status(200).json({ 
        id: user._id,
        username: username,
        token: token, 
    });
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public refreshToken(req: Request, res: Response) {
    try {
      // user.refreshToken = undefined;
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }
}