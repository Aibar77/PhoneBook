const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Person = require("./models/phonebook");
// const requestLogger = (req, res, next) => {
//   console.log("Method:", req.method);
//   console.log("Path: ", req.path);
//   console.log("Body: ", req.body);
//   console.log("---");
//   next();
// };

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
morgan.token("data", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : " ";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/", (req, res) => {
  res.send("<h1>Its Alive!</h1>");
});
app.get("/info", (req, res, next) => {
  Person.countDocuments()
    .then((result) => {
      res.send(`
  <p>PhoneBook has info for ${result} people</p>
  
  <p>${new Date()}</p>
  `);
    })
    .catch((err) => next(err));
});
app.get("/api/persons", (req, res) => {
  Person.find({}).then((phones) => {
    res.json(phones);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }
  //  else if (persons.find((person) => person.name === body.name)) {
  //   return res.status(409).json({
  //     error: "User is already exists",
  //   });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};
app.use(unknownEndpoint);
app.use(errorHandler);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
