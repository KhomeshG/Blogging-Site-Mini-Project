const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");

//authentication Part

exports.authentication = async function (req, res, next) {
  let headerCheck = req.headers["x-api-key"];
  try {
    if (!headerCheck) {
      return res.status(400).send({
        status: false,
        msg: "header is madatory/maybe user is not logIn",
      });
    }

    try {
      var tokenVerify = jwt.verify(headerCheck, "FunctionUP-Project1-Group30");
    } catch (err) {
      return res
        .status(404)
        .send({ status: false, msg: "Token is Not Valid !!" });
    }

    //storing authorId in headers(key,value)
    req.headers["authorId"] = tokenVerify.UserId;
    // console.log(req);
    next();
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "Server error 500 auth !!" });
  }
};

//Autharization Part

exports.autharization = async function (req, res, next) {
  try {
    if (req.params.blogId == ":blogId") {
      return res
        .status(403)
        .send({ status: false, msg: "BlogId can't Be Empty !!" });
    }
    let checkBlogId = await blogModel.findOne({ _id: req.params.blogId });
    if (checkBlogId) {
      if (!checkBlogId) {
        return res
          .status(403)
          .send({ status: false, msg: "blogid is Incorrect !!" });
      }
      try {
        if (checkBlogId.authorId != req.headers["authorId"]) {
          return res
            .status(403)
            .send({ status: false, msg: "Not an Authorised User !!" });
        }
      } catch (err) {
        return res.status(404).send({ status: false, error: err.message });
      }

      return next();
    }
    //for Query
    else {
      if (Object.keys(req.query).length == 0) {
        return res
          .status(400)
          .send({ status: false, msg: "Need Atleast One Filter!!" });
      }
      //Query Part(Filteration Part)
      let checkByfilter = await blogModel.findOne(req.query);
      if (!checkByfilter) {
        return res.status(403).send({ status: false, msg: "No data Found!!" });
      }
      try {
        if (checkByfilter.authorId != req.headers.authorId) {
          return res
            .status(403)
            .send({ status: false, msg: "Not an Authorised User !!" });
        }
      } catch {
        return res
          .status(404)
          .send({ status: false, msg: "Token Is Not Valid!!" });
      }
      //storing authorId in headers(key,value)
      req.headers["authorId"] = req.headers.authorId;
      next();
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      Eroor: err.message,
      msg: "Server Error 500  !",
    });
  }
};
