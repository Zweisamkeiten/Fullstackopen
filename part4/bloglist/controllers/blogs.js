const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  // get user from request object
  const user = request.user;

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  // get user from request object
  const user = request.user;

  const blogToDelete = await Blog.findById(request.params.id);

  // 要删除的不存在
  if (!blogToDelete) {
    return response.status(404).json({ error: "not exists" });
  }

  // 只允许创建该blog的用户删除
  if (blogToDelete.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response
      .status(403)
      .json({ error: "You do not have permission to delete this blog" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const newblog = request.body;
  if (!newblog.likes) {
    return response.status(400).json({ error: "likes missing" });
  }

  const { likes } = newblog;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: "query" }
  );
  response.status(204).json(updatedBlog);
});

module.exports = blogsRouter;
