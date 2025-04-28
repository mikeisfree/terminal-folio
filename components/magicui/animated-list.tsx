"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children],
    );

    useEffect(() => {
      if (index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
        }, delay);

        return () => clearTimeout(timeout);
      }
    }, [index, delay, childrenArray.length]);

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse();
      return result;
    }, [index, childrenArray]);


    interface Item {
      name: string;
      description: string;
      icon: string;
      color: string;
      time: string;
    }

    let notifications = [
      {
        name: "Payment received",
        description: "Magic UI",
        time: "15m ago",
     
        icon: "💸",
        color: "#00C9A7",
      },
      {
        name: "User signed up",
        description: "Magic UI",
        time: "10m ago",
        icon: "👤",
        color: "#FFB800",
      },
      {
        name: "New message",
        description: "Magic UI",
        time: "5m ago",
        icon: "💬",
        color: "#FF3D71",
      },
      {
        name: "New event",
        description: "Magic UI",
        time: "2m ago",
        icon: "🗞️",
        color: "#1E86FF",
      },
    ];
     
    notifications = Array.from({ length: 10 }, () => notifications).flat();

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";
