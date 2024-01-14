const http = require("http");
const port = 4000;
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const breedsFile = require("./data/breed.json");

const views = {
  home: "./views/home/index.html",
  style: "./views/site.css",
  addCat: "./views/addCat.html",
  addBreed: "./views/addBreed.html",
  cat: "./views/partials/cat.html",
};

const cats = [
  {
    id: 1,
    name: "Lucy",
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/06/19/14/20/cat-814952_1280.jpg",
    breed: "Persian Cat",
    description: "The best cat ever!",
  },
  {
    id: 2,
    name: "Simba",
    imageUrl:
      "https://cdn.pixabay.com/photo/2018/08/08/05/12/cat-3591348_1280.jpg",
    breed: "Bombay Cat",
    description: "The best cat ever!",
  },
  {
    id: 3,
    name: "Cleo",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg",
    breed: "Bengal Cat",
    description: "The best cat ever!",
  },
];

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    render(views.cat, cats, (err, catResult) => {
      if (err) {
        res.statusCode = 404;
        return res.end();
      }

      render(views.home, [{ cats: catResult }], (err, result) => {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });
        res.write(result);
        res.end();
      });
    });
  } else if (req.url === "/styles/site.css") {
    fs.readFile(views.style, "utf-8", (err, data) => {
      if (err) {
        res.statusCode = 404;
        return res.end();
      }
      res.writeHead(200, {
        "Content-Type": "text/css",
      });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/cats/add-cat" && req.method === "GET") {
    let filePath = path.normalize(path.join(__dirname, "./views/addCat.html"));
    const input = fs.createReadStream(filePath);

    input.on("data", (data) => {
      let catBreedPlaceholder = breedsFile
        .map((breed) => `<option value="${breed}">${breed}</option>`)
        .join("");
      let modifiedData = data
        .toString()
        .replace("{{catBreeds}}", catBreedPlaceholder);
      res.write(modifiedData);
    });
    input.on("end", () => res.end());
    input.on("error", (err) => console.log(err));
  } else if (req.url === "/cats/add-cat" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("close", () => {
      const parseBody = qs.parse(body);
      parseBody.id = cats[cats.length - 1].id + 1;

      cats.push(parseBody);

      res.writeHead(301, {
        location: "/",
      });
      res.end();
    });
  } else if (req.url === "/cats/add-breed" && req.method === "GET") {
    fs.readFile(views.addBreed, "utf-8", (err, result) => {
      if (err) {
        res.statusCode = 404;
        return res.end();
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(result);
      res.end();
    });
  } else if (req.url === "/cats/add-breed" && req.method === "POST") {
    let formData = "";

    req.on("data", (data) => {
      formData += data;
    });

    req.on("close", () => {
      let body = qs.parse(formData);

      fs.readFile("./data/breed.json", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        let breeds = JSON.parse(data);
        console.log(body.breed);
        breeds.push(body.breed);
        let json = JSON.stringify(breeds.sort());
        fs.writeFile("./data/breed.json", json, () => {
          console.log("The breed was uploaded successfully!");
        });
      });
      res.writeHead(301, { location: "/" });
      res.end();
    });
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.write("<h1>404</h1>");
    res.end();
  }
});

function render(view, dataArr, callback) {
  fs.readFile(view, "utf-8", (err, result) => {
    if (err) {
      return callback(err);
    }

    const htmlResult = dataArr
      .map((data) => {
        return Object.keys(data).reduce((acc, key) => {
          const pattern = new RegExp(`{{${key}}}`, "g");

          return acc.replace(pattern, data[key]);
        }, result);
      })
      .join("\n");

    callback(null, htmlResult);
  });
}

server.listen(port);
console.log(`Server is listening to port ${port} ...`);
