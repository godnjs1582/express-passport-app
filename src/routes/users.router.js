const express = require("express");
const passport = require("passport");
const User = require("../models/users.model");
const sendMail = require("../mail/mail");
const usersRouter = express.Router();

usersRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ mgs: info });
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/posts");
    });
  })(req, res, next);
});

usersRouter.post("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

usersRouter.post("/signup", async (req, res) => {
  //user 객체를 생성합니다
  const user = new User(req.body);
  //user 컬렉션에 user를 저장
  try {
    await user.save();
    //이메일 보내기
    sendMail("godnjs123474@gmail.com", "권해원", "welcome");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
});

usersRouter.get("/google", passport.authenticate("google"));
usersRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);
usersRouter.get("/kakao", passport.authenticate("kakao"));
usersRouter.get("/kakao/callback", passport.authenticate("kakao", {
  successReturnToOrRedirect: "/posts",
  failureRedirect: "/login",
}));

module.exports = usersRouter;
