const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log(`connecting to DB ${url}...`);
  })
  .catch((error) => {
    console.log(" Error connecting to DB", error);
  });

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  published: {
    type: Boolean,
  },
});

tutorialSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    (returnedObject.id = returnedObject._id.toString()),
      delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Tutorial", tutorialSchema);
