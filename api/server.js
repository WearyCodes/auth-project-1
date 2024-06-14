const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

// Session configuration
const sessionConfig = {
  name: "chocolatechip",
  secret: "keep it secret, keep it safe",
  resave: false,
  saveUninitialized: false, // Only save sessions for authenticated users
  cookie: {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    maxAge: 1000 * 60 * 10, // Cookie expiration in milliseconds (10 minutes for example)
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  },
};

// Initialize Express app
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// Use session middleware
server.use(session(sessionConfig));

server.use("/api/auth", authRouter);

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
