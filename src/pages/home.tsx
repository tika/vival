import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { JWT, JWTPayload } from "@app/jwt";
import { prisma } from "@app/prisma";
import { extendedPost, PostElement } from "@components/post";
import { Feed } from "@components/pages/feed";
import { Left } from "@components/pages/left";
import { Right } from "@components/pages/right";

type HomeProps = {
  user: JWTPayload;
  posts: extendedPost[];
};

export default function Home(props: HomeProps) {
  const [isPosting, setIsPosting] = useState(false);
  const [commentingOnPost, setCommentingOnPost] = useState<extendedPost>();
  const router = useRouter();

  return (
    <div
      className="h-full flex flex-row justify-evenly"
      style={{
        width: "calc(100vw - 17px)",
      }}
    >
      <Left user={props.user} />
      <Feed
        posts={props.posts}
        user={props.user}
        setCommentingOnPost={(p) => setCommentingOnPost(p)}
      />
      <Right />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = JWT.parseRequest(ctx.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: { comments: true, likedBy: true },
  });

  let diffPosts: any[] = posts;
  diffPosts.map((p) => (p.createdAt = p.createdAt.toISOString()));

  return { props: { user, posts: JSON.parse(JSON.stringify(diffPosts)) } };
};