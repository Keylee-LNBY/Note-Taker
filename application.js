// dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// return index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// return notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// return saved notes
app.get("/api/notes", function (req,res) {
    return res.json(data);
});

// receive new note to save on the request body, add it to the `db.json` file, 
// and then return the new note to the client.
app.post("/api/notes", function (req,res) {
    data.push(req.body);
    fs.writeFile("./json/db.json", JSON.stringify(data), function(err) {
        if(err) throw err;
        console.log("Post Saved");
    });
    return res.json(data);
});

// remove note with given id
app.delete("/api/notes/:id", function (req,res) {
    data = data.filter(function (data) {
        if (req.params.id === data.id) {
            return false;
        }
        return true;
    });

    res.writeFile("./db/db.json", JSON.stringify(data), function(err){
        if(err) throw err;
        console.log("Note Deleted");
    });
    return res.json(data);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });