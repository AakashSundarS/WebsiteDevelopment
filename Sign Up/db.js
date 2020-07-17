let fs = require("fs");
function check() {
  //let name = document.getElementById("name").value;
  //let password = document.getElementById("password").value;
  let name = "Aakash";
  let password = "Password";
  let search = "./database/" + name + ".json";

  fs.readFile(search, function (err, data) {
    if (data === password) {
      console.log("WELCOME!");
      return true;
    } else if (err) {
      console.log("WRONG USERNAME!");
      //document.getElementById("wrong").innerHTML =
      //"The username is incorrect!, please try again...";
      return false;
    } else {
      console.log("WRONG PASSWORD!");
      console.log(data.password);
      //document.getElementById("wrong").innerHTML =
      //"The password is incorrect!, please try again...";
      return false;
    }
  });
}
check();
