const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
//Checking Header-Value in (Present/Not)
exports.headerCheck = function (req, res, next) {
  try {
    let headerData = req.headers["x-api-key"];
    if (headerData === undefined) {
      return res.send({ msg: "Header Is Madtory" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({ msg: "Server Error 500" });
  }
};

//Authentication Part
exports.authentication = function (req, res, next) {
  try {
    let Token = req.headers["x-api-key"];
    if (!Token)
      return res.status(400).send({ status: false, msg: "login is requred" });

    let tokenVerify = jwt.verify(Token, "FunctionUP-Project1-Group30");

    if (req.query.authorId) {
      if (tokenVerify.userId !== req.query.authorId) {
        return res
          .status(403)
          .send({ status: false, msg: "User is not logged in" });
      } else {
        return next();
      }
    }

    //for create blog
    if (req.body.authorId) {
      if (tokenVerify.userId !== req.body.authorId) {
        return res.status(403).send({
          status: false,
          msg: "author was not created and authorId is invaild !!!",
        });
      } else {
        return next();
      }
    }
    return next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: "Server Error 500" });
  }
};

//Only For Path And Delete

exports.blogIdPlusAuthorIdCheck = async function (req, res, next) {
  try {
    let Token = req.headers["x-api-key"];
    //
    let tokenVerify = jwt.verify(Token, "FunctionUP-Project1-Group30");
    if (tokenVerify.UserId !== req.query.authorId) {
      return res.status(404).send({ msg: "User is Imposter" });
    }
    //First  Checking BlogID(Valid/Not)
    if (req.params.blogId == ":blogId") {
      return res.status(400).send({ msg: "BlogID Cant Be Empty" });
    }
    let checkBlogId = await blogModel.findById(req.params.blogId);
    if (!checkBlogId) {
      return res.status(400).send({ msg: "Blog Id is Invalid" });
    }

    //Second Verifying User BY theri AUTHORID
    else {
      if (req.query.authorId != checkBlogId.authorId) {
        return res.status(404).send({ msg: "AuthorID is Not Matched" });
      } else {
        next();
      }
    }
  } catch (err) {
    return res.status(500).send({ msg: "Server Error 500" });
  }
};
