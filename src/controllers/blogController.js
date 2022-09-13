const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const moment = require("moment");

//Globals

let dateToday = moment();

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null)
    return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//Create a blog document from request body. Get authorId in request body only
exports.blogs = async function (req, res) {
  try {
    let blogBody = req.body;
    blogBody.publishedAt = dateToday.format("YYYY-MM-DD");
    blogBody.isPublished = true;

    //Validating empty Doc
    if (Object.keys(blogBody).length == 0) {
      return res.status(400).send({ status: false, msg: "data is required" });
    }

    //Validating title (Madatory)
    if (!isValid(blogBody.title)) {
      return res.status(400).send({ status: false, msg: "title is required" });
    }

    //Validating body (Madatory)
    if (!isValid(blogBody.body)) {
      return res.status(400).send({ status: false, msg: "body is required" });
    }

    //Validating authorId (Madatory)
    if (!isValid(blogBody.authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "authorId is required" });
    }

    //Validating tags (Madatory)
    if (!isValid(blogBody.tags)) {
      return res.status(400).send({ status: false, msg: "tags is required" });
    }

    //Validating category (Madatory)
    if (!isValid(blogBody.category)) {
      return res
        .status(400)
        .send({ status: false, msg: "category is required" });
    }

    //Checking authorId(present/Not)
    let checkAuthorId = await authorModel.findById(req.body.authorId);
    if (!checkAuthorId) {
      return res.status(400).send({ msg: "Please Enter Valid AuthorId" });
    }

    //all Working Fine (then else)
    else {
      let blogData = await blogModel.create(blogBody);
      res.status(201).send({ data: blogData });
    }
  } catch (err) {
    res.status(500).send({ ErrorName: err.name, ErrorMsg: err.message });
  }
};
// ------------get blogs---------------

const getblogs = async function (req, res) {
  try {
    let obj = { isDeleted: false, isPublished: true };
    // by author Id
    let authorId = req.query.authorId;
    let category = req.query.category;
    let tags = req.query.tags;
    let subcategory = req.query.subcategory;

    // applying filters
    if (authorId) {
      obj.authorId = authorId;
    }
    if (category) {
      obj.category = category;
    }
    if (tags) {
      obj.tags = tags;
    }
    if (subcategory) {
      obj.subcategory = subcategory;
    }

    let savedData = await blogModel.find(obj);
    if (savedData.length == 0) {
      return res.status(404).send({ status: false, msg: "blogs not found" });
    }
    return res.status(200).send({ data: savedData });
  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

// --------update blogs --------------
exports.blogsUpdate = async function (req, res) {
  try {
    //If param value is undefined
    let blogBody = req.body;
    if (req.params.blogId == ":blogId") {
      return res.status(400).send({ msg: "ID is madatory" });
    }

    //Validating Empty Document(Doc Present/Not)
    if (Object.keys(blogBody) == 0) {
      return res.status(400).send({ msg: "Cant Update Empty document" });
    }

    //Validating BlogId(Present/Not)

    let checkBlogId = await blogModel.findById(req.params.blogId);
    if (!checkBlogId) {
      return res.status(400).send({ msg: "Blog Id is Invalid" });
    }

    //Allowing Only Whose Document Is Not Delected

    if (checkBlogId.isDeleted == true) {
      return res.status(400).send({ msg: "This Document is Already Deleted" });
    }

    //All Validation Working

    //Upadting user Changes
    else {
      let blogUpdateData = await blogModel.findByIdAndUpdate(
        {
          _id: checkBlogId._id,
        },

        {
          $addToSet: { tags: blogBody.tags, subcategory: blogBody.subcategory },
          $set: {
            title: blogBody.title,
            body: blogBody.body,
            authorId: blogBody.authorId,
            category: blogBody.category,
            isPublished: true,
            isDeleted: blogBody.isDeleted,
            deletedAt: blogBody.deletedAt,
          },
          $currentDate: { publishedAt: dateToday.format("YYYY-MM-DD") },
        },

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

// -------------DELETE BY BOLGID ---------------
const deleteBlogById = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let blog = await blogModel.findById(blogId);
    let data = blog.isDeleted;
    //console.log(data);

    if (data == true) {
      return res.status(404).send("blog document doesn't exist");
    } else {
      //New Changes (Remove this Comment After Doing Changes )
      let markDelete = await blogModel.updateOne(
        { _id: blog._id },
        { isDeleted: true },
        { new: true }
        //
      );
      res.status(200).send({ status: true, status: 200 });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: false, ErrorName: err.name, ErrorMsg: err.message });
  }
};

// -------------DELETE BY QUERY PARAMS --------------
const deleteblog = async function (req, res) {
  try {
    if (req.query == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "Filter is required !!" });
    }

    //updating Document
    let isDeletedTrue = await blogModel.updateMany(
      {
        $and: [{ authorId: req.headers.authorId }, { isDeleted: false }],

        $or: [
          { category: req.query.category },
          { tags: req.query.tags },
          { subcategory: req.query.subcategory },
          { isPublished: req.query.isPublished },
          { authorId: req.query.authorId },
        ],
      },
      { isDeleted: true, deletedAt: dateToday.format("YYYY-MM-DD") }
    );
    return res.status(200).send({ status: true, data: isDeletedTrue });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.getblogs = getblogs;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteblog = deleteblog;
