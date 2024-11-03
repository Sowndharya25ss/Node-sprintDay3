const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
app.use(express.json());

const { PORT, DB_USERNAME, DB_PWD } = process.env;

const dbUrl = `mongodb+srv://${DB_USERNAME}:${DB_PWD}@cluster0.qmx8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(dbUrl)
  .then(function () {
    console.log("Connection Success");
  })
  .catch((err) => console.log(err.message));

const userSchemaRules = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
    validate: function () {
      return this.password == this.confirmPassword;
    },
  },
  createaAt: {
    type: Date,
    default: Date.now(),
  },
};


const userSchema = new mongoose.Schema(userSchemaRules);

const UserModel = mongoose.model("userModel", userSchema);

/** API Methods*/
app.post("/api/user", createUser);

app.get("/api/user", getAllUser);

/** API Handlers */
async function createUser(req, res) {
  try {
    const userDetails = req.body;
    const user = await UserModel.create(userDetails);
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: "failure",
      error: err.message,
    });
  }
}

function getAllUser(req, res) {
  res.status(200).json({
    status: "success",
    message: "hi",
  });
}

/** Default function */
app.use(function (req, res) {
  res.status(200).json({
    status: "success",
    message: "Default function",
  });
});

/** Initialize server */
app.listen(PORT, function (req, res) {
  console.log(`Server is running at ${PORT}`);
});
