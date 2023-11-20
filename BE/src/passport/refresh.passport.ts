import { UserModel } from '../models/users.model';
import passport from 'passport';
import { ExtractJwt, Strategy} from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();

passport.use('jwt-refresh', new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_REFRESH_SECRET,
}, async (payload, done) => {
  try {
    const user = await UserModel.findById(payload.id)
    return done(null, user);
  } catch(err) {
    return done(err);
  }
}))