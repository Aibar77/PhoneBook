const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to ", url);

mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to mongodb");
  })
  .catch((err) => console.log("error message:", err.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d+/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    minLength: 8,
    required: [true, "User phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (doc, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
