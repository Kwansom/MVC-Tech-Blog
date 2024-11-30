const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", (req, res) => {
  Comment.findAll({})
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create new comment // THIS IS FIRING AND WORKING
router.post("/:id", async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    // console.log("Post ID from params:", req.params.id);

    const newComment = await Comment.create({
      content: req.body.comment_body,
      post_id: req.params.id,
      user_id: req.session.user_id,
    });
    // console.log("New Comment created:", newComment);
    res.status(200).json({ message: "Comment posted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating comment");
  }
});

router.put("/:id", withAuth, (req, res) => {
  Comment.update(
    {
      comment_body: req.body.comment_body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((commentData) => {
      if (commentData) {
        res.status(404).json({ message: "No comment found with this id!" });
        return;
      }
      res.json(commentData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete by user
router.delete("/:id", withAuth, async (req, res) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findByPk(req.params.id);

    // If comment doesn't exist, return 404
    if (!comment) {
      return res.status(404).json({ message: "No comment found with this ID" });
    }

    // Check if the logged-in user is the author of the comment
    if (comment.user_id !== req.session.user_id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    // Delete the comment
    await comment.destroy();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting comment" });
  }
});

module.exports = router;
