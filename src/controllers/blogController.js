const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null)
    return false;
  //   if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//Create a blog document from request body. Get authorId in request body only
exports.blogs = async function (req, res) {
  try {
    let blogBody = req.body;
    //Validating Empty Document Case
    if (Object.keys(blogBody).length == 0) {
      return res.status(400).send({ status: false, msg: "data is required" });
    }

    //Validating Title(Madatory)

    if (!isValid(blogBody.title)) {
      return res.status(400).send({ status: false, msg: "title is required" });
    }

    //Validating body(Madatory)
    if (!isValid(blogBody.body)) {
      return res.status(400).send({ status: false, msg: "body is required" });
    }

    //Validating authorId(Madatory)
    if (!isValid(blogBody.authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "authorId is required" });
    }

    //Validating Tags(Madatory)
    if (!isValid(blogBody.tags)) {
      return res.status(400).send({ status: false, msg: "tags is required" });
    }

    //Validating Category(Madatory)
    if (!isValid(blogBody.category)) {
      return res
        .status(400)
        .send({ status: false, msg: "category is required" });
    }

    //Validating AuthorId(Matched/Not)

    let checkAuthorId = await authorModel.findById(req.body.authorId);
    if (!checkAuthorId) {
      return res.status(400).send({ msg: "Please Enter Valid AuthorId" });
    }
    //if all Fine
    else {
      let blogData = await blogModel.create(blogBody);
      res.status(201).send({ data: blogData });
    }
  } catch (err) {
    res.status(500).send({ ErrorName: err.name, ErrorMsg: err.message });
  }
};

//

// if (!isValid(blogBody.subcategory)) {
//     return res
//       .status(400)
//       .send({ status: false, msg: "subcategory is required" });
//   }

//   if (!isValid(blogBody.isPublished)) {
//     return res
//       .status(400)
//       .send({ status: false, msg: "isPublished is required" });
//   }

//   if (!isValid(blogBody.publishedAt)) {
//     return res
//       .status(400)
//       .send({ status: false, msg: "publishedAt is required" });
//   }

//   if (!isValid(blogBody.isDeleted)) {
//     return res
//       .status(400)
//       .send({ status: false, msg: "isDeleted is required" });
//   }

//   if (!isValid(blogBody.deletedAt)) {
//     return res
//       .status(400)
//       .send({ status: false, msg: "deletedAt is required" });
//   }
