// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "The posts information could not be retrieved",
      });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "The post information could not be retrieved",
      });
    });
});

router.post("/", (req, res) => {
  const post = req.body;
  if (!post.title || !post.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.insert(post)
      .then(async ({ id }) => {
        const newPost = await Posts.findById(id);
        res.status(201).json(newPost);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
          err: err.message,
        });
      });
  }
});

router.put("/:id", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.update(req.params.id, req.body)
      .then(async (stuff) => {
        const updatedPost = await Posts.findById(req.params.id);
        if (stuff) {
          res.status(200).json(updatedPost);
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "The post information could not be modified",
        });
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      await Posts.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "the post could not be removed",
      err: err.message,
      stack: err.stack,
    });
  }
});

////////not working completely, the 13th test isn't passing//////
//   Posts.remove(req.params.id)
//     .then((count) => {
//       console.log("THIS IS THE REQ", req);
//       if (count > 0) {
//         res.status(200).json({ message: "The post has been deleted" });
//       } else {
//         res.status(404).json({ message: "The post with the specified ID does not exist" });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({
//         message: "The post could not be removed",
//       });
//     });
// });

router.get("/:id/comments", (req, res) => {
  if (!req.params.id) {
    res.status(404).json({
      message: "The post with the specified ID does not exist",
    });
  }
  Posts.findPostComments(req.params.id)
    .then((comments) => {
      if (!comments) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(comments);
      }
      console.log(comments);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "The comments information could not be retrieved",
      });
    });
});

module.exports = router;
