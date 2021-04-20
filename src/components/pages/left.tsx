import { SafeUser } from "@components/post";
import { Dots } from "@components/svg/dots";
import { Home } from "@components/svg/home";
import React from "react";
import { Bell } from "../svg/bell";
import { Mail } from "../svg/mail";
import { Profile } from "../svg/profile";
import { Bookmark } from "../svg/bookmark";

interface LeftProps {
  user: SafeUser;
}

export function Left(props: LeftProps) {
  const profilePicture =
    "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

  return (
    <div className="sm:flex justify-center w-full py-8 z-50 hidden sm:col-span-3">
      <div className="fixed flex flex-col">
        <div className="flex flex-row gap-3 items-center">
          <img
            src={profilePicture}
            className="w-16 h-16 max-w-none object-cover rounded-md"
          />
          <div className="leading-tight">
            <h1 className="font-semibold">@{props.user.username}</h1>
            <h2>Joined 16th October</h2>
          </div>
          <Dots
            className="h-5 ml-2"
            onClick={() => console.log("profile settings")}
          />
        </div>
        <div className="flex flex-col gap-3 mt-16 ml-4">
          <div className="flex flex-row gap-2 items-center">
            <Home className="w-8" />
            <h1 className="font-semibold text-lg">Home</h1>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Bell className="w-8" />
            <h1 className="font-semibold text-lg">Notifications</h1>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Mail className="w-8" />
            <h1 className="font-semibold text-lg">Messages</h1>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Profile className="w-8" />
            <h1 className="font-semibold text-lg">Profile</h1>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Bookmark className="w-8" />
            <h1 className="font-semibold text-lg">Saved</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
