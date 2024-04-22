export default () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESHSECRET,
    jwtResetSecret: process.env.JWT_RESETSECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID
})