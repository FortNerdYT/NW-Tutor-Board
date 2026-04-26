const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.RENDER_EXTERNAL_URL 
        ? `${process.env.RENDER_EXTERNAL_URL}/api/auth/google/callback`
        : '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        // Domain restriction (commented out for testing)
        // if (!email.endsWith('@nw.sparcc.org')) {
        //   return done(null, false, { message: 'Email domain not allowed' });
        // }

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            google_id: profile.id,
            email: email,
            name: profile.displayName,
            role: 'student' // Default to student, admin can promote to teacher
          })
          .select()
          .single();

        if (insertError) {
          return done(insertError);
        }

        return done(null, newUser);
      } catch (error) {
        console.error('OAuth error:', error);
        return done(error);
      }
    }
  )
);
