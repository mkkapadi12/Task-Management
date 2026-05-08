import PostService from "./post.service.js";

const createPost = async (req, res, next) => {
  try {
    const post = await PostService.createPost({
      body: req.body,
      file: req.file,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const data = await PostService.getAllPosts(req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await PostService.getPostById(req.params.id);
    res.status(200).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await PostService.updatePost({
      id: req.params.id,
      body: req.body,
      file: req.file,
      userId: req.user.id,
    });
    res.status(200).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const data = await PostService.deletePost({
      id: req.params.id,
      userId: req.user.id,
    });
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
export { createPost, getAllPosts, getPostById, updatePost, deletePost };
