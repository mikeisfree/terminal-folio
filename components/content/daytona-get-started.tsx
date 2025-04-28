"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  value: string;
}

interface FeatureSection {
  id: string;
  title: string;
  items: FeatureItem[];
}

const contentData: FeatureSection[] = [
  {
    id: "installation",
    title: "Installation",
    items: [
      {
        title: "Quick Start",
        description: "Install via npm",
        value: "npm install daytona-cli -g",
      },
      {
        title: "Docker",
        description: "Pull Docker image",
        value: "docker pull daytona/daytona",
      },
    ],
  },
  {
    id: "setup",
    title: "Initial Setup",
    items: [
      {
        title: "Authentication",
        description: "Configure credentials",
        value: "daytona auth login",
      },
      {
        title: "Project Init",
        description: "Initialize new project",
        value: "daytona init",
      },
    ],
  },
];

export function DaytonaGetStarted() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setActiveItemIndex((prev) => {
            const currentSection = contentData[activeSectionIndex];
            return prev > 0 ? prev - 1 : currentSection.items.length - 1;
          });
          break;
        case "ArrowDown":
          setActiveItemIndex((prev) => {
            const currentSection = contentData[activeSectionIndex];
            return prev < currentSection.items.length - 1 ? prev + 1 : 0;
          });
          break;
        case "ArrowRight":
          setActiveSectionIndex((prev) =>
            prev < contentData.length - 1 ? prev + 1 : 0
          );
          setActiveItemIndex(0);
          break;
        case "ArrowLeft":
          setActiveSectionIndex((prev) =>
            prev > 0 ? prev - 1 : contentData.length - 1
          );
          setActiveItemIndex(0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSectionIndex, activeItemIndex]);

  return (
    <div className=" text-white font-mono p-4">
      <div className="mb-8">
        <div className="text-gray-500">
          <div># daytona get-started --guide</div>
          <div>
            #
            -------------------------------------------------------------------------
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {contentData.map((section, sectionIndex) => (
          <div key={section.id} className="pb-4">
            <div
              className={`text-xl mb-4 ${
                activeSectionIndex === sectionIndex
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              {section.title}
            </div>
            <div className="pb-4 flex justify-between flex-wrap lg:flex-row">
              {section.items.map((item, itemIndex) => (
                <div
                  key={`${item.title}-${itemIndex}`}
                  className={`pl-4 ${
                    activeSectionIndex === sectionIndex &&
                    activeItemIndex === itemIndex
                      ? "bg-gray-900"
                      : ""
                  }`}
                >
                  <div className="flex items-start">
                    <ChevronRight className="h-4 w-4 mt-1 mr-2 text-gray-500" />
                    <div className="flex-1">
                      <div className="text-yellow-400">{item.title}</div>
                      <div className="text-gray-400">{item.description}</div>
                      <div className="text-green-500 font-bold mt-1">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-gray-500">
        <div>
          #
          -------------------------------------------------------------------------
        </div>
        <div className="text-sm mt-2">
          Use arrow keys to navigate through sections and items.
        </div>
      </div>
    </div>
  );
}
