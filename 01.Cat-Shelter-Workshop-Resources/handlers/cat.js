const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
// const formidable = require("formidable");
const breeds = require("../data/breeds.json");
const cats = require("../data/cats.json");

module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname === "/cats/add-cat" && req.method === "GET") {
    let filePath = path.normalize(path.join(__dirname, "../views/addCat.html"));

    const input = fs.createReadStream(filePath);

    input.on("data", (data) => {
      res.write(data);
    });
    input.on("end", () => {
      res.end();
    });
    input.on("error", (err) => {
      console.log(err);
    });
  } else if (pathname === "/cats/add-breed" && req.method === "GET") {
    let filePath = path.normalize(
      path.join(__dirname, "../views/addBreed.html")
    );

    const input = fs.createReadStream(filePath);

    input.on("data", (data) => {
      res.write(data);
    });
    input.on("end", () => {
      res.end();
    });
    input.on("error", (err) => {
      console.log(err);
    });
  } else {
    return true;
  }
};
