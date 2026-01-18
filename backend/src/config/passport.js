import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import supabaseAdmin from './database.js';
import dotenv from 'dotenv';

dotenv.config();

// GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            scope: ['user:email', 'repo', 'read:user']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                const { data: existingUser, error: fetchError } = await supabaseAdmin
                    .from('users')
                    .select('*')
                    .eq('email', profile.emails[0].value)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') {
                    return done(fetchError, null);
                }

                let user;

                if (existingUser) {
                    user = existingUser;
                } else {
                    // Create new user
                    const { data: newUser, error: createError } = await supabaseAdmin
                        .from('users')
                        .insert({
                            email: profile.emails[0].value,
                            name: profile.displayName || profile.username,
                            avatar_url: profile.photos[0]?.value,
                            github_username: profile.username
                        })
                        .select()
                        .single();

                    if (createError) {
                        return done(createError, null);
                    }

                    user = newUser;
                }

                // Store GitHub access token (will be encrypted in the service layer)
                return done(null, { user, accessToken });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const { data: user, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', payload.userId)
                .single();

            if (error || !user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;
