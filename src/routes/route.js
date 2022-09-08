const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const loginController = require("../controllers/loginController");
const middleware = require("../middleware/auth");

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

//creating Authors API
router.post("/authors", authorController.authors);

//creating Blogs API
router.post("/blogs", blogController.blogs);

// Fetching blogsByFilter
router.get(
  "/blogs",
  middleware.headerCheck,
  middleware.authentication,
  blogController.getblogs
);

//Updating Blogs
router.put(
  "/blogs/:blogId",
  middleware.headerCheck,
  middleware.blogIdPlusAuthorIdCheck,
  blogController.blogsUpdate
);

// Deleted by blogId
router.delete(
  "/blogsby/:blogId",
  middleware.headerCheck,
  middleware.blogIdPlusAuthorIdCheck,
  blogController.deleteBlogById
);

// Delete by blog queryparams
router.delete(
  "/blogs",
  middleware.headerCheck,
  middleware.authentication,
  blogController.deleteblog
);

// login author
router.post("/login", loginController.login);

module.exports = router;
