const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./config/mongoose-connection");
require("dotenv").config();
const User = require("./models/userModel");
const Message = require("./models/messageModel");
const verifyToken = require("./middlewares/verifyToken");


const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Register route
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Username already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      })
      .json({
        message: "Login successful",
        userId: user._id,
        username: user.username,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Logout route
app.post("/api/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logout successful" });
});

// Get all users
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "_id username");
    res.json(users.filter((user) => user._id.toString() !== req.user._id));
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get messages between two users
app.get("/api/messages/:userId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .sort("timestamp")
      .populate("sender", "username")
      .populate("receiver", "username");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

// Send message
app.post("/api/messages", verifyToken, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const newMessage = new Message({
      content,
      sender: req.user._id,
      receiver: receiverId,
    });
    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "username")
      .populate("receiver", "username");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
});

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/build")));

app.get("*",(req,res)=>{
  res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"))
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
