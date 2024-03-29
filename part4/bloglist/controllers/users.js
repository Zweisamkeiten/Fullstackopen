const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;
  if (!body.username || !body.password) {
    return response
      .status(400)
      .json({ error: "Both username and password must be given" });
  }

  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "Password must be at least of 3 characters of length" });
  }

  const { username, name, password } = body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: "username must be unique" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, name, passwordHash });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
