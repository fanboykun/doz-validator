import { Rule, Validate } from "../src/main.ts";

const validation = new Validate({
    name: Rule.string("Josh"),
    age: Rule.number(17, { min: 0, max: 100 }),
    isAdmin: Rule.boolean(true),
    hobbies: Rule.array(["reading", "coding"], { minLength: 1, maxLength: 5 }),
    email: Rule.email("josh@example.com"),
    address: Rule.object({ street: "123 Main St", city: "Anytown", state: "CA", zip: "12345" }),
    birthdate: Rule.date("1990-01-01"),
    password: Rule.password("P@ssw0rd", { minLength: 8, maxLength: 100 }),
    regex: Rule.regex("123-45-678", /^\d{3}-\d{2}-\d{3}$/),
    dateBetween: Rule.dateBetween("2020-01-01", { start: "2019-01-01", end: "2021-01-01" }),
    file: Rule.file(new File(["file content"], "example.txt")),
    url: Rule.url("https://example.com"),
    mime: Rule.mime(new File(["file content"], "example.txt"), ["text/plain"]),
    arrayIncludes: Rule.arrayIncludes(["reading", "coding", "gaming"], ["reading", "coding"]),
    arrayOf: Rule.arrayOf(["reading", "coding", "gaming"], (item) => Rule.string(item)),
    hasProperties: Rule.hasProperties({ street: "123 Main St", city: "Anytown", state: "CA", zip: "12345" }, ["street", "city", "state", "zip"]),
    shape: Rule.shape({ street: "123 Main St", city: "Anytown", state: "CA", zip: "12345" }, {
      street: (value) => Rule.string(value),
      city: (value) => Rule.string(value),
      state: (value) => Rule.string(value),
      zip: (value) => Rule.string(value),
    }),
});
console.log({validation})