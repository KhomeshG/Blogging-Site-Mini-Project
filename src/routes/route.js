const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const loginController = require("../controllers/loginController");

//middleware
//const middleware = require("../middleware/auth");
const newMiddleware = require("../middleware/auth");

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

//creating Authors API
router.post("/authors", authorController.authors);

//creating Blogs API
router.post("/blogs", newMiddleware.authentication, blogController.blogs);

// Fetching blogsByFilter
router.get("/blogs", newMiddleware.authentication, blogController.getblogs);

//Updating Blogs
router.put(
  "/blogs/:blogId",
  newMiddleware.authentication,
  newMiddleware.autharization,
  blogController.blogsUpdate
);

// Deleted by blogId
router.delete(
  "/blogsby/:blogId",
  newMiddleware.authentication,
  newMiddleware.autharization,
  blogController.deleteBlogById
);

// Delete by blog queryparams
router.delete(
  "/blogs",
  newMiddleware.authentication,
  newMiddleware.autharization,
  blogController.deleteblog
);

// login author
router.post("/login", loginController.login);

module.exports = router;
