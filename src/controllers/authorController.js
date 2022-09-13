const authorModel = require("../models/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null)
    return false;
  //if (typeof value === "string" && value.trim().length === 0) return false
  return true;
};

const authors = async function (req, res) {
  try {
    let data = req.body;

    //Validating Empty Document
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "data is required" });
    }

    //Validating fname(Madtory)
    if (!isValid(data.fname)) {
      return res.status(400).send({ status: false, msg: "fname is required" });
    }

    //Validating lname(Madtory)
    if (!isValid(data.lname)) {
      return res.status(400).send({ status: false, msg: "lname is required" });
    }

    //Validating title(Madtory)
    if (!isValid(data.title)) {
      return res.status(400).send({ status: false, msg: "title is required" });
    }

    //Validating Email using regex(Madtory)
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(data.email)) {
      res.status(400).send({
        status: false,
        message: "Email should be a valid email address",
      });
      return;
    }
    let emailCheck = await authorModel.findOne(req.email);
    if (emailCheck) {
      res
        .status(409)
        .send({ status: false, msg: "This email already exists." });
    }

    //Validating password(Madtory)
    if (!isValid(data.password)) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    }
    //If All Working Fine
    else {
      let savedData = await authorModel.create(data);
      return res.status(201).send({ msg: savedData });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ ErrorName: err.name, ErrorMessage: err.message });
  }
};

module.exports.authors = authors;
