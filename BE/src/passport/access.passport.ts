import { UserModel } from '../models/users.model';
import passport from 'passport';
import { ExtractJwt, Strategy} from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();


passport.use('jwt-access', new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET,
}, async (payload, done) => {
  try {
    const user = await UserModel.findById(payload.id)
    return done(null, {
      id: user?._id,
      username: user?.username,
    });
  } catch(err) {
    return done(err);
  }
}))