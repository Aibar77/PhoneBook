const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
if (process.argv.length > 5) {
  console.log("Name or Number with whitespace contains in quotes");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mambetaibar:${password}@cluster0.4f1v3qn.mongodb.net/phonebook`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  });

  person.save().then((res) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log("phoneBook: ");
    res.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
}
