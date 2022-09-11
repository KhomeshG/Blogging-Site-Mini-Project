const authorModel = require("../models/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null)
    return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

// Global Function

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

    const titleValidation = function (value) {
      if (value === "Mr" || value === "Mrs" || value === "Miss") {
        return false;
      }
      return true;
    };
    if (titleValidation(data.title)) {
      return res.status(400).send({
        status: false,
        msg: "Accept Mr/Mrs/Miss Only",
      });
    }
    //Validating title(Madtory)
    if (!isValid(data.title)) {
      return res.status(400).send({
        status: false,
        msg: "title is required (with Mr/Mrs/Miss) Only",
      });
    }

    //Validating Email using regex(Madtory)
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(data.email)) {
      res.status(400).send({
        status: false,
        message: `Email should be a valid email address`,
      });
      return;
    }

    //Validating password(Madtory)
    if (!/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,15}$/.test(data.password)) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    }
    //If All Working Fine
    else {
      let savedData = await authorModel.create(data);
      res.status(201).send({ status: true, msg: savedData });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, ErrorName: err.name, ErrorMessage: err.message });
  }
};

module.exports.authors = authors;
