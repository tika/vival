import { Comment, Post, User } from ".prisma/client";
import React, { useState, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@app/fetcher";
import HashLoader from "react-spinners/HashLoader";
import { Chat } from "@components/svg/chat";
import { Heart } from "@components/svg/heart";
import { Bookmark } from "@components/svg/bookmark";
import { motion } from "framer-motion";
import { autoDatify } from "@app/timeutils";
import { Bullet } from "@components/svg/bullet";
import FastAverageColor from "fast-average-color";
import { Share } from "./svg/share";
import { useRouter } from "next/dist/client/router";
import copy from "copy-to-clipboard";
import { url } from "@app/constants";
import toast from "react-hot-toast";
import { Multiline } from "@app/elementutils";

export type SafeUser = Omit<User, "password" | "email">;

export type extendedPost = Post & {
  likedBy: User[];
  comments: Comment[];
  savedBy: User[];
};

export type extendedComment = Comment & {
  likedBy: User[];
  parentComment?: Comment;
  childComments: Comment[];
  author?: User;
};

interface PostProps {
  post: extendedPost;
  currentUser: SafeUser;
  onComment(): void;
}

type PassedProps = PostProps & {
  profilePicture: string;
  user: SafeUser;
  isLiked: boolean;
  isSaved: boolean;
  setIsSaved(x: boolean): void;
  setIsLiked(x: boolean): void;
};

export function PostElement(props: PostProps) {
  const { data, error } = useSWR<SafeUser>(
    `/users?id=${props.post.authorId}`,
    (url) => fetcher("GET", url)
  );

  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  const [isLiked, setIsLiked] = useState(
    props.post.likedBy.filter((u) => u.id === props.currentUser.id).length > 0
  );

  const [isSaved, setIsSaved] = useState(
    props.post.savedBy.filter((u) => u.id === props.currentUser.id).length > 0
  );

  const passProps: PassedProps = {
    profilePicture,
    user: data!,
    isLiked,
    isSaved,
    setIsSaved: (v) => setIsSaved(v),
    setIsLiked: (v) => setIsLiked(v),
    ...props,
  };

  return (
    <>
      {!data ? (
        <div className="flex flex-row justify-center items-center">
          <HashLoader color="#3B82F6" loading={!data} size={100} />
        </div>
      ) : (
        <div className="w-96" key={props.post.id}>
          {props.post.images && props.post.images.length > 0 ? (
            <ImagePost props={passProps} />
          ) : (
            <TextPost props={passProps} />
          )}
        </div>
      )}
    </>
  );
}

export function TextPost({ props }: { props: PassedProps }) {
  const router = useRouter();

  function share() {
    copy(`${url}/${props.post.id}`);
    toast.success("Copied link to clipboard!");
  }

  return (
    <div className="flex gap-2">
      <div
        className="max-w-full max-h-sm"
        onClick={() => router.push(`/profile/${props.user.id}`)}>
        <img
          src={props.profilePicture}
          className="w-16 h-16 max-w-none object-cover rounded-md"
        />
      </div>
      <div className="w-full">
        <div
          className="flex items-center justify-between w-full"
          onClick={() => router.push(`/post/${props.post.id}`)}>
          <h1 className="font-bold">@{props.user.username}</h1>
          <h2 className="text-gray-600 font-medium text-sm">
            {autoDatify(new Date(props.post.createdAt))}
          </h2>
        </div>
        <div onClick={() => router.push(`/post/${props.post.id}`)}>
          <Multiline text={props.post.caption!} lineclamp={1} expanded />
        </div>
        <div className="flex mt-2 justify-between w-full">
          <Heart
            className="h-6"
            isLiked={props.isLiked}
            onClick={() => {
              fetcher(
                props.isLiked ? "DELETE" : "PUT",
                `/posts/${props.post.id}/likes`
              );
              props.setIsLiked(!props.isLiked);
            }}
          />
          <Chat className="h-6" onClick={() => props.onComment()} />
          <Bookmark
            className="h-6 text-blue-400"
            isSaved={props.isSaved}
            onClick={() => {
              fetcher(
                props.isSaved ? "DELETE" : "PUT",
                `/posts/${props.post.id}/saves`
              );
              props.setIsSaved(!props.isSaved);
            }}
          />
          <Share onClick={share} className="h-6" />
        </div>
      </div>
    </div>
  );
}

export function ImagePost({ props }: { props: PassedProps }) {
  const [startPos, setStartPos] = useState(0);
  const [averageColor, setAverageColor] = useState<IFastAverageColorResult>();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const imgRef = useRef<any>();
  const router = useRouter();

  function onImageLoad(e: any) {
    new FastAverageColor()
      .getColorAsync(e.target)
      .then((color) => setAverageColor(color));
  }

  return (
    <>
      <div className="mb-4 relative">
        <div className="w-full absolute bottom-6 flex flex-row justify-between">
          <h1
            style={{ writingMode: "vertical-rl" }}
            className="font-bold text-white transform rotate-180 z-20">
            @{props.user.username}
          </h1>
          {props.post.images.length > 1 && (
            <div className="mr-2 px-1 py-3 z-20 flex flex-col gap-2 bg-gray-900 opacity-90 rounded-full">
              {props.post.images.map((x, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 transition ease-in-out duration-500 ${
                    i === index ? "bg-blue-300" : "bg-gray-600"
                  } rounded-full`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="relative w-full h-96 bg-gray-100 shadow-sm rounded-lg">
          <Bookmark
            className="absolute top-5 right-5 z-20 w-6 text-blue-400"
            color={averageColor?.isDark ? "text-white" : "text-dark"}
            isSaved={props.isSaved}
            onClick={() => {
              fetcher(
                props.isSaved ? "DELETE" : "PUT",
                `/posts/${props.post.id}/saves`
              );
              props.setIsSaved(!props.isSaved);
            }}
          />
          <div className="absolute top-0 z-10 left-0 w-96 h-96">
            <motion.img
              ref={imgRef}
              onLoad={onImageLoad}
              crossOrigin="anonymous"
              className="rounded-lg w-96 h-96 object-cover object-center"
              layout
              src={props.post.images[index]}
              drag={props.post.images.length > 1 ? "y" : false}
              dragMomentum={true}
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              onDragStart={(event, info) => setStartPos(info.point.y)}
              onDragEnd={(event, info) => {
                const required = 150;
                const newPos = info.point.y;

                if (newPos - startPos < -required) {
                  // Swipe up
                  setIndex(
                    index == props.post.images.length - 1 ? 0 : index + 1
                  );
                } else if (newPos - startPos > required) {
                  // Swipe down
                  setIndex((index == 0 ? props.post.images.length : index) - 1);
                }

                setStartPos(Math.abs(newPos + startPos - required));
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-96 flex flex-row items-start gap-4 self-center">
        <div
          className="max-w-full max-h-sm"
          onClick={() => router.push(`/profile/${props.user.id}`)}>
          <img
            src={props.profilePicture}
            className="w-20 h-20 max-w-none object-cover rounded-md"
          />
        </div>

        <div className="flex flex-col gap-1 w-full" style={{ width: "18rem" }}>
          <Multiline
            onClick={() => setExpanded(true)}
            text={props.post.caption!}
            lineclamp={3}
            expanded={expanded}
          />

          <div>
            <div className="flex items-center">
              <Heart
                className="h-6"
                isLiked={props.isLiked}
                onClick={() => {
                  fetcher(
                    props.isLiked ? "DELETE" : "PUT",
                    `/posts/${props.post.id}/likes`
                  );
                  props.setIsLiked(!props.isLiked);
                }}
              />
              <Chat className="h-6" onClick={() => props.onComment()} />
              <Bullet className="ml-1 mr-2" />
              <p className="font-semibold text-sm text-gray-600">
                {autoDatify(new Date(props.post.createdAt))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
