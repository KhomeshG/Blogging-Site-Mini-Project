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

//blog Update
exports.blogsUpdate = async function (req, res) {
  try {
    //If param value is undefined
    let blogBody = req.body;
    if (req.params.blogId == ":blogId") {
      return res.status(400).send({ msg: "ID is madatory" });
    }

    //Validating BlogId(Present/Not)

    let checkBlogId = await blogModel.findById(req.params.blogId);
    if (!checkBlogId) {
      return res.status(400).send({ msg: "Blog Id is Invalid" });
    }

    //Allowing Only Whose Document Is Not Delected
    if (checkBlogId.isDeleted == true) {
      return res
        .status(400)
        .send({ msg: "if deleted is true deletedAt will have a date" });
    }
    //All Validation Working
    //Upadting user Changes
    else {
      let blogUpdateData = await blogModel.findByIdAndUpdate(
        {
          _id: checkBlogId._id,
        },
        blogBody,
        { new: true }
      );
      return res.status(201).send({ data: blogUpdateData });
    }
  } catch (err) {
    res.status(500).send({
      msg: "HTTP 500 Server Error",
      ErrorName: err.name,
      ErrorMessage: err.message,
    });
  }
};

//deleted
exports.deletedBlogId = async function (req, res) {
  let paramData = req.params.blogId;

  //Validating Value (Present/Not)
  if (paramData == ":blogId") {
    res.status(400).send({ msg: "Blog Id Not be Empty" });
  }

  //Validating BlogId(matched/Not)
  let checkBlogId = await blogModel.findById(req.params.blogId);
  if (!checkBlogId) {
    return res.status(404).send({ msg: " blog document doesn't exist" });
  } else {
    //if its already deleted (if gonna Work)
    if (checkBlogId.isDeleted == true) {
      return res.status(400).send({ msg: "Blog-Id is already Deleted" });
    }

    //if All Working Fine
    else {
      let blogMarkDelete = await blogModel.findByIdAndUpdate(
        { _id: checkBlogId._id },
        { isDeleted: false },
        { new: true }
      );
      return res.status(201);
    }
  }
};

//4) Deleted

exports.deletedByQuery = async function (req, res) {
  try {
    let blogBody = req.query;

    let deletedByQuery = await blogModel.updateMany(
      blogBody,
      { isDeleted: true },
      { new: true }
    );
    res.status(201).send({ data: deletedByQuery });
  } catch (err) {
    res.status(500).send();
  }
};
//

//3

exports.getDetails = async function (req, res) {
  let bodyData = req.query;
  let findedData = await blogModel.find(req.query);
  if (findedData.isDeleted == true || findedData.isPublished == true) {
    return res.status(400).send({ msg: "" });
  }
  res.status(201).send({ data: findedData });
};

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

//------------------------------
// let checkBlogId = await blogModel.findById(req.params.blogId);
// // if (!checkBlogId) {
// //   return res.status(401).send({ msg: "Blog-Id is Invalid" });
// // }
// let category = req.query.category;
// let authorid = req.query.authorId;
// let tag = req.query.tag;
// let subcategory_name = req.query.subcategory_name;
// let published = req.query.published;
