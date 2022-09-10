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
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter Valid AuthorId" });
    }

    //all Working Fine (then else)
    else {
      let blogData = await blogModel.create(blogBody);
      res.status(201).send({ status: true, data: blogData });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: false, ErrorName: err.name, ErrorMsg: err.message });
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
    console.log(authorId);
    // applying filters
    //Returns all blogs in the collection that aren't deleted and are published
    if (authorId) {
      obj.authorId = authorId; //if authorID (present) then  creating object(key ,value pair) inside obj
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
      return res.status(404).send({
        status: false,
        msg: "blog not found / Maybe Bcz (its deleted or Not Published)",
      });
    }
    return res.status(200).send({ Status: true, data: savedData });
  } catch (err) {
    return res
      .status(500)
      .send({ msg: "Server Error 500", error: err.message });
  }
};

// --------update blogs --------------
exports.blogsUpdate = async function (req, res) {
  try {
    //If param value is undefined
    let blogBody = req.body;
    // if (req.params.blogId == ":blogId") {
    //   return res.status(400).send({ msg: "ID is madatory" });
    // }

    //Validating Empty Document(Doc Present/Not)
    if (Object.keys(blogBody) == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Cant Update Empty document" });
    }

    //Validating BlogId(Present/Not)

    let checkBlogId = await blogModel.findById(req.params.blogId);
    if (!checkBlogId) {
      return res.status(400).send({ status: false, msg: "Blog Id is Invalid" });
    }

    //Allowing Only Whose Document Is Not Delected

    if (checkBlogId.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, msg: "This Document is Already Deleted" });
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
          },
          $currentDate: { publishedAt: dateToday.format("YYYY-MM-DD") },
        },

        { new: true }
      );
      return res.status(201).send({ status: true, data: blogUpdateData });
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
    //new---------------new--------new
    let blogData = await blogModel.find({
      $or: [
        {
          authorId: req.query.authorId,
        },
        { category: req.query.category },
        { tags: req.query.tags },
        { subcategory: req.query.subcategory },
        { isPublished: req.query.isPublished },
      ],
    });
    if (blogData == 0) {
      return res.status(400).send({ status: false, msg: "No Data Matched" });
    }
    let isDeletedTrue = await blogModel.updateMany(
      { blogData },
      { isDeleted: true },
      { new: true }
    );

    return res.status(200).send({ status: true, data: isDeletedTrue });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
  //new---------------new--------new
  //new---------------new--------new
};

module.exports.getblogs = getblogs;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteblog = deleteblog;

// let authorId = req.query.authorId;
//     let categoryname = req.query.category;
//     let tagname = req.query.tags;
//     let subcategoryname = req.query.subcategory;
//     let unpublished = req.query.isPublished;

// let Blog = await blogModel.findById(authorId);

// if (authorId) {
//   let isDeletedTrue = await blogModel.updateMany(
//     { authorId: authorId },
//     { isDeleted: true },
//     { new: true }
//   );

//   //return res.status(200).send({ status: true, data: deleteblog });
// }

// if (categoryname) {
//   let isDeletedTrue = await blogModel.updateMany(
//     { category: categoryname },
//     { isDeleted: true },
//     { new: true }
//   );

//   //return res.status(200).send({ status: true, data: deleteblog });
// }

// if (tagname) {
//   let isDeletedTrue = await blogModel.updateMany(
//     { tags: tagname },
//     { isDeleted: true },
//     { new: true }
//   );
// }
// // return res.status(200).send({ status: true, data: deleteblog });

// if (subcategoryname) {
//   let isDeletedTrue = await blogModel.updateMany(
//     { subcategory: categoryname },
//     { isDeleted: true },
//     { new: true }
//   );

//   //return res.status(200).send({ status: true, data: deleteblog });
// }

// if (unpublished) {
//   let isDeletedTrue = await blogModel.updateMany(
//     { isPublished: unpublished },
//     { isDeleted: true },
//     { new: true }
//   );
// }
