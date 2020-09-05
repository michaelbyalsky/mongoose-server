const express = require("express");
const app = express();
const morgan = require("morgan");
const Tutorial = require("./models/Tutorial");

app.use(express.json());

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.get("/api/tutorials", async (req, res) => {
  try {
    if (req.query.title) {
      let title = req.query.title;
      console.log(title);
      const tutorials = await Tutorial.find({ title : title });
      res.json(tutorials);
    } else {
      const tutorials = await Tutorial.find({});
      res.json(tutorials);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/tutorials", async (req, res) => {
  body = req.body;
  console.log(body);
  const tutorial = new Tutorial({
    title: body.title,
    author: body.author,
    date: Date.now(),
    published: body.published,
  });
  try {
    const newTutorial = await tutorial.save();
    res.json(newTutorial);
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/tutorials/:id", async (req, res) => {
  let id = req.params.id;
  let body = req.body;
  const tutorial = {
    title: body.title,
    author: body.author,
    date: Date.now(),
    published: body.published,
  };
  try {
    const newTutorial = await Tutorial.findByIdAndUpdate(id, tutorial, {
      new: true,
    });
    console.log(newTutorial);
    res.json(newTutorial);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/tutorials/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let deleted = await Tutorial.findByIdAndDelete(id);
    //   res.status(204).end()
    res.send(`${deleted.title} deleted successfully`);
  } catch (err) {
    res.send(err);
  }
});

app.delete("/api/tutorials", async (req, res) => {
  try {
    await Tutorial.remove();
    res.send("all items remove")
  } catch (err) {
    res.send(err);
  }
});

app.get("/api/tutorials/published", async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ published: true });
    res.json(tutorials);
  } catch (err) {
    res.send(err);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
