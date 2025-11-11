// backend/src/config/passport.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../modules/users/user.model";
import { verifyPassword } from "../utils/hash";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ username });

        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
