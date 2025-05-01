"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { openAsBlob } from "fs";

interface Item {
  name: string;
  description: string;
  // icon: string;
  // color: string;
  time: string;

}

let notifications = [
  {
    name: "[Payment received]",
    description: "ACCEPTED",
    time: "",
    // time: "15m ago",
    // icon: "💸",
    // color: "#00C9A7",
  },
  {
    name: "[User signed up]",
    description: "ACCEPTED",
    time: "",
    // time: "10m ago",
    // icon: "👤",
    // color: "#FFB800",
  },
  {
    name: "[New message]",
    description: "FAILED",
    time: "",
    // time: "5m ago",
    // icon: "💬",
    // color: "#FF3D71",
  },
  {
    name: "[New event]",
    description: "ACCEPTED",
    time: "",
    // time: "2m ago",
    // icon: "🗞️",
    // color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

// const Notification = ({ name, description, icon, color, time }: Item) => {
  const Notification = ({ name, description, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl px-4",
        // animation styles
        "transition-all duration-100 ease-in-out hover:scale-[103%] hover:bg-[var(--main-accent-50)]",
        // light styles
        // "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        // "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex filter-contrast-20 flex-row items-center gap-1">
        {/* <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div> */}
        <div className="flex flex-col overflow-hidden">
          <figcaption className="m-0 leading-none flex flex-row items-center whitespace-pre ">
            <span className="text-sm uppercase text-[var(--main-accent)]">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          <p className="text-sm dark:text-[var(--main-text)]">
            {description}
          </p>
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListItems({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[300px] w-full flex-col overflow-hidden",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute bottom-0 h-1/8 "></div>
      {/* bg-gradient-to-t from-background -removed styles from up*/}
    </div>
  );
}
