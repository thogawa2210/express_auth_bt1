import express from "express";
const router = express.Router();
import passport from "passport";
import multer from 'multer';

const upload = multer();

router.get("/login", (req, res) => {
    // this will render login.ejs file
    res.render("login");
});

router.post('/login', upload.none(), (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if(err){
            return next(err)
        }
        if(!user){
            return res.send("Wrong email or password")
        }
        req.login(user, () => {
            res.send("You are authenticated")
        })
    })(req, res, next)
})

router.get('/login/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Retrieve user data using the access token received
router.get("/google/callback", passport.authenticate('google'), (req, res) => {
        res.send("You are authenticated")
    }
);

router.get('/home', (req, res) => {
    res.render('home');
})

export default router;