const passport = require('passport')
const router = require('express').Router()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const {User, Order} = require('../db/models')
module.exports = router

/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables like so:
 //  */

// HEROKU
// process.env.GOOGLE_CLIENT_ID =
//   '449126159282-ff34161e5udmc2ofp9rm592f2nradbqn.apps.googleusercontent.com'
// process.env.GOOGLE_CLIENT_SECRET = 'A_WWAIgK0Zf1OT31eZ7RQD6u'
// process.env.GOOGLE_CALLBACK = '/auth/google/callback'

//LOCAL
// process.env.GOOGLE_CLIENT_ID =
//   '449126159282-7bt3n4fgfopkdd0lpssbad9353fkesg9.apps.googleusercontent.com'
// process.env.GOOGLE_CLIENT_SECRET = '3eskchLypLthOQsb_CE0f5A2'
// process.env.GOOGLE_CALLBACK = '/auth/google/callback'

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Google client ID / secret not found. Skipping Google OAuth.')
} else {
  const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  }

  const strategy = new GoogleStrategy(
    googleConfig,
    async (token, refreshToken, profile, done) => {
      const googleId = profile.id
      const name = profile.displayName
      const email = profile.emails[0].value

      try {
        const user = await User.findOrCreate({
          where: {googleId},
          defaults: {email}
        })

        if (user[1]) {
          const cart = await Order.create({})
          user[0].addOrder(cart)
        }

        done(null, user[0])
      } catch (error) {
        done()
      }
    }
  )

  passport.use(strategy)

  router.get('/', passport.authenticate('google', {scope: 'email'}))

  router.get(
    '/callback',
    passport.authenticate('google', {
      successRedirect: '/home',
      failureRedirect: '/login'
    })
  )
}
