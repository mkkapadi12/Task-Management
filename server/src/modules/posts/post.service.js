import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.middleware.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import cloudinary from "../../config/cloudinary.js";

// ─── helper: upsert tags, return tag ids ─────────────────────────────────────
const upsertTags = async (tagNames) => {
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name: name.toLowerCase().trim() },
        update: {},
        create: { name: name.toLowerCase().trim() },
      }),
    ),
  );
  return tags.map((t) => ({ id: t.id }));
};

// ─── POST SELECT shape ────────────────────────────────────────────────────────
const postSelect = {
  id: true,
  title: true,
  content: true,
  coverImage: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  tags: { select: { id: true, name: true } },
  author: {
    select: { id: true, name: true, avatar: true, email: true },
  },
};

const PostService = {
  // ─── CREATE ───────────────────────────────────────────────────────────────────
  createPost: async ({ body, file, userId }) => {
    const { title, content, status, tags = [] } = body;

    let coverImage = null;
    let coverPublicId = null;

    if (file) {
      const uploaded = await uploadToCloudinary(file.buffer);
      coverImage = uploaded.secure_url;
      coverPublicId = uploaded.public_id;
    }

    const tagConnects = tags.length ? await upsertTags(tags) : [];

    const post = await prisma.post.create({
      data: {
        title,
        content,
        status,
        coverImage,
        coverPublicId,
        authorId: userId,
        tags: { connect: tagConnects },
      },
      select: postSelect,
    });

    return post;
  },

  // ─── GET ALL (paginated) ──────────────────────────────────────────────────────
  getAllPosts: async ({ page = 1, limit = 10, status, tag }) => {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};
    if (status) where.status = status;
    if (tag) {
      where.tags = { some: { name: tag.toLowerCase().trim() } };
    }

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          ...postSelect,
          content: true,
          id: true,
          title: true,
          coverImage: true,
          status: true,
          createdAt: true,
          tags: { select: { id: true, name: true } },
          author: {
            select: { id: true, name: true, avatar: true, email: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    if (posts.length === 0) throw new AppError("No posts found.", 404);

    return {
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // ─── GET SINGLE ───────────────────────────────────────────────────────────────
  getPostById: async (id) => {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: postSelect,
    });
    if (!post) throw new AppError("Post not found.", 404);
    return post;
  },

  // ─── UPDATE ───────────────────────────────────────────────────────────────────
  updatePost: async ({ id, body, file, userId }) => {
    const existing = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) throw new AppError("Post not found.", 404);
    if (existing.authorId !== userId) throw new AppError("Not your post.", 403);

    const { title, content, status, tags } = body;

    let coverImage = existing.coverImage;
    let coverPublicId = existing.coverPublicId;

    if (file) {
      // delete old image from Cloudinary first
      if (existing.coverPublicId) {
        await cloudinary.v2.uploader.destroy(existing.coverPublicId);
      }
      const uploaded = await uploadToCloudinary(file.buffer);
      coverImage = uploaded.secure_url;
      coverPublicId = uploaded.public_id;
    }

    const tagConnects = tags?.length ? await upsertTags(tags) : undefined;

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(status && { status }),
        coverImage,
        coverPublicId,
        ...(tagConnects && { tags: { set: [], connect: tagConnects } }),
        // set: [] first → clears old tags, then reconnects new ones
      },
      select: postSelect,
    });

    return post;
  },

  // ─── DELETE ───────────────────────────────────────────────────────────────────
  deletePost: async ({ id, userId }) => {
    const existing = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) throw new AppError("Post not found.", 404);
    if (existing.authorId !== userId) throw new AppError("Not your post.", 403);

    if (existing.coverPublicId) {
      await cloudinary.v2.uploader.destroy(existing.coverPublicId);
    }

    await prisma.post.delete({ where: { id: Number(id) } });
    return { message: "Post deleted." };
  },
};
export default PostService;
