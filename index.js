const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
// const requestLogger = (req, res, next) => {
//   console.log("Method:", req.method);
//   console.log("Path: ", req.path);
//   console.log("Body: ", req.body);
//   console.log("---");
//   next();
// };
app.use(express.json());
app.use(cors());
morgan.token("data", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : " ";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Its Alive!</h1>");
});
app.get("/info", (req, res) => {
  res.send(`
  <p>PhoneBook has info for ${persons.length} people</p>
  
  <p>${new Date()}</p>
  `);
});
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return res.status(409).json({
      error: "User is already exists",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 125),
  };
  persons = persons.concat(person);
  res.json(person);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
