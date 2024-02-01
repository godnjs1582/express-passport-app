const cookieSession = require("cookie-session");
const express = require("express");
const { default: mongoose } = require("mongoose");
const passport = require("passport");
const app = express();
const path = require("path");

const config = require("config");
const serverConfig = config.get("server");
const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/users.router");
const postsRouter=require("./routes/posts.router");
const commentsRouter=require("./routes/comments.router");
const friendsRouter=require("./routes/friends.router");
const profileRouter=require("./routes/profile.router");
const likesRouter=require("./routes/likes.router");

const PORT = serverConfig.port;

require("dotenv").config();
app.use(
  cookieSession({
    name: "cookie-session-name",
    keys: [process.env.COOKIE_ENCRYPTION_KEY],
  })
);

app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(path.join(__dirname, "public")));

app.use("/", mainRouter);
app.use("/auth", usersRouter);
app.use("/posts",postsRouter);
app.use("/comments", commentsRouter);
app.use("/likes",likesRouter);
app.use("/friends", friendsRouter);
app.use("/likes",likesRouter);
app.use("/profile", profileRouter);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
