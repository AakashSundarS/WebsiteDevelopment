let fs = require("fs");
fs.appendFile("./database/newfile.txt", "Hello content!", function (err) {
  if (err) throw err;
  console.log("Saved!");
});
