const url = require("url");
const fs = require("fs");
const path = require("path");
const cats = require("../data/cats.json");

let filePath = path.normalize(path.join(__dirname, "../views/home/index.html"));

module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;
  console.log(pathname);

  if (pathname === "/" && req.method === "GET") {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, {
          "Content-Type": "text/plain",
        });
        res.write("404 not found!");
        res.end();
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(data);
      res.end();
    });
  } else {
    return true;
  }
};
