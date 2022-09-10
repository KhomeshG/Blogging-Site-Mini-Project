const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
//const logInController = require("../controllers/logInController");

//for Token
const logInController = require("../controllers/logInController");
//Checking Header-Value in (Present/Not)
exports.headerCheck = function (req, res, next) {
  try {
    let headerData = req.headers["x-api-key"];

    if (headerData === undefined) {
      return res.status(400).send({ status: false, msg: "Header Is Madtory" });
    } else {
      next();
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: "Server Error 500" });
  }
};

//Authentication Part
exports.authentication = function (req, res, next) {
  try {
    let Token = req.headers["x-api-key"];

    try {
      var tokenVerify = jwt.verify(Token, "FunctionUP-Project1-Group30");
    } catch (err) {
      return res.status(404).send({ status: false, msg: "Token is Not Valid" });
    }

    if (tokenVerify.UserId != req.query.authorId) {
      return res
        .status(403)
        .send({ status: false, msg: "AuthorId is not Matched" });
    } else {
      next();
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: "Server Error 500" });
  }
};

//Only For Path And Delete

exports.blogIdPlusAuthorIdCheck = async function (req, res, next) {
  try {
    let Token = req.headers["x-api-key"];
    //
    try {
      var tokenVerify = jwt.verify(Token, "FunctionUP-Project1-Group30");
    } catch (err) {
      return res.status(404).send({ status: false, msg: "Token is Not Valid" });
    }
    //
    if (!tokenVerify) {
      return res.status(401).send({ status: false, msg: "Token is invalide" });
    }
    //
    if (tokenVerify.UserId !== req.query.authorId) {
      return res
        .status(403)
        .send({ status: false, msg: "User is not Autherized" });
    }
    //First  Checking BlogID(Valid/Not)
    if (req.params.blogId == ":blogId") {
      return res
        .status(400)
        .send({ status: false, msg: "BlogID Cant Be Empty" });
    }
    let checkBlogId = await blogModel.findById(req.params.blogId);
    if (!checkBlogId) {
      return res.status(400).send({ status: false, msg: "Blog Id is Exist" });
    }

    //Second Verifying User BY theri AUTHORID
    else {
      if (req.query.authorId != checkBlogId.authorId) {
        return res
          .status(403)
          .send({ status: true, msg: "AuthorID is Not Matched" });
      } else {
        next();
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: "Server Error 500" });
  }
};
