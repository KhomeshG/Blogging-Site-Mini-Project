const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

//Create a author document from request body. Endpoint: BASE_URL/authors

router.post("/authors", authorController.authors);

//Create a Blogs document from request body. Endpoint: BASE_URL/blogs

router.post("/blogs", blogController.blogs);

//Create put API

router.put("/blogs/:blogId", blogController.blogsUpdate);

//deleteApi
router.delete("/blogs", blogController.deletedByQuery);
module.exports = router;
