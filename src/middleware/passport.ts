import passport from "passport"
import { UserModel } from '../schemas/user.model'
import LocalStrategy from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use('local', new LocalStrategy(async (username, password, done) => {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
        return done(null, false);
    } else {
        if (user.password === password) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
}));

passport.use(new GoogleStrategy({
        clientID: "792762828783-igdjlch4ds82e0b9sqs0vm7q3a9j9jjs.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            let existingUser = await UserModel.findOne({ 'google.id': profile.id });
            // if user exists return the user
            if (existingUser) {
                return done(null, existingUser);
            }
            // if user does not exist create a new user
            console.log('Creating new user...');
            const newUser = new UserModel({
                google: {
                    id: profile.id,
                },
                username: profile.emails[0].value,
                password: null
            });
            await newUser.save();
            console.log(newUser, 'newUser')
            return done(null, newUser);
        } catch (error) {
            return done(null, false)
        }
    }
));

export default passport;