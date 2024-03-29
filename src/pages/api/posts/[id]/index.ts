import { createEndpoint } from "@app/endpoint";
import { DisplayedError, NotFound } from "@app/exceptions";
import { JWT } from "@app/jwt";
import { prisma } from "@app/prisma";
import { editPostSchema } from "@schemas/posts";

export default createEndpoint({
  GET: async (req, res) => {
    const post = await prisma.post.findFirst({
      where: { id: req.query.id as string },
    });

    if (!post) {
      throw new NotFound("post");
    }

    res.json(post);
  },
  DELETE: async (req, res) => {
    const user = JWT.parseRequest(req);
    const id = req.query.id as string;

    if (!user) {
      throw new NotFound("user");
    }

    const post = await prisma.post.findFirst({
      where: { id },
    });

    if (!post) {
      throw new NotFound("post");
    }

    if (post.authorId !== user.id) {
      throw new DisplayedError(400, "You cannot delete a post you do not own");
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({ success: true });
  },
  PATCH: async (req, res) => {
    const user = JWT.parseRequest(req);

    if (!user) {
      throw new Error("Unknown User");
    }

    const postId = req.query.id as string;
    const { caption } = editPostSchema.parse(req.body);

    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFound("post");
    }

    if (post.authorId !== user.id) {
      throw new DisplayedError(400, "You cannot update a post you do not own");
    }

    await prisma.post.update({
      where: { id: postId },
      data: { caption },
    });

    res.json({ success: true });
  },
});
