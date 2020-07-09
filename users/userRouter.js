const express = require('express');

const router = express.Router();

const Users = require('./userDb');
const Posts = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const newUser = req.body;
  Users.insert(newUser)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((data) => {
      res
        .status(500)
        .json({ message: "an error occurred while making your user" });
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
  // do your magic!
  const { id: user_id } = req.params;
  const newPost = { ...req.body, user_id };
  Posts.insert(newPost)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "an error occurred while making your post" });
    });
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "an error occurred while fetching users" });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  const { id: userId } = req.params;
  Posts.findByUserId(userId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((data) => {
      res
        .status(500)
        .json({ message: "an error occurred while retrieving a user's posts" });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then(() => {
      res.status(200).json({ message: "user successfully deleted" });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "an error occurred while deleting the user" });
    });

});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  // do your magic!
  const { body: user } = req;
  const { id } = req.params;
  console.log(user, id);
  Users.update(id, user)
    .then(() => {
      res.status(200).json({ message: "user updated successfully" });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "an error occurred while updating the user" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Users.getById(id)
    .then((data) => {
      req.user = data;
      next();
    })
    .catch(() => res.status(400).json({ message: "invalid user id" }));
}

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body;
  if (!user){
    res.status(400).json({ message: "missing user data" });
  } else if (!user.name){
    res.status(400).json({ message: "missing required name field" });
    } else next();
}

function validatePost(req, res, next) {
  // do your magic!
  const post = req.body;
  if (!post) {
    res.status(400).json({ message: "missing post data" });
  } else if (!post.text) { 
    res.status(400).json({ message: "missing required text field" });
    } else next();
}

module.exports = router;
