"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Video } from "@/components/ui/video";

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
    id: "features",
    title: "Features",
    items: [
      {
        title: "Post & Threads",
        description: "Post and threads support",
        value: "Built-in thread composition",
      },
      {
        title: "Attachments",
        description: "Attachments support",
        value: "Images and video clips",
      },
      {
        title: "AI Translation",
        description: "Gemini powered translation",
        value: "Cross-language communication",
      },
      {
        title: "AT Proto",
        description: "Direct connect to AT Proto account",
        value: "Seamless Bluesky integration",
      },
      {
        title: "Emoji",
        description: "Built-in emoji support",
        value: "Enhanced expression",
      },
    ],
  },
  {
    id: "stack",
    title: "Tech Stack",
    items: [
      {
        title: "Next.js",
        description: "Frontend framework",
        value: "React-based development",
      },
      {
        title: "Figma",
        description: "Design tool",
        value: "UI/UX prototyping",
      },
      {
        title: "Google Gemini",
        description: "AI model",
        value: "Translation service",
      },
      {
        title: "Chromium",
        description: "Browser extension",
        value: "Plugin platform",
      },
    ],
  },
];

export function TalkProject() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

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
    <div className="font-mono p-4" style={{ color: 'var(--main-text)' }}>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <div className="text-[#fe1d1d]">
              <div># TALK - Totally Amateur Linguistic Kommunicator</div>
              <div>
                #
                -------------------------------------------------------------------------
              </div>
            </div>
            <div className="mt-4">
              Little chromium plugin for seemeless publication of threads and posts to BLUESKY social app.
            </div>
          </div>

          <div className="space-y-8">
        {contentData.map((section, sectionIndex) => (
          <div key={section.id} className="pb-4">
            <div
              className="text-xl mb-4"
              style={{ color: 'var(--main-text)' }}
            >
              {section.title}
            </div>
            <div className="pb-4 flex flex-wrap gap-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={`${item.title}-${itemIndex}`}
                  className={`pl-4 w-full lg:w-[calc(50%-1rem)] ${
                    activeSectionIndex === sectionIndex &&
                    activeItemIndex === itemIndex
                      ? "bg-gray-900"
                      : ""
                  }`}
                >
                  <div className="flex items-start">
                    <ChevronRight className="h-4 w-4 mt-1 mr-2 text-[#fe1d1d]" />
                    <div className="flex-1">
                      <div className="text-[#fe1d1d]">{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

          <div className="mt-8 text-[var(--text-main)]">
            <div>
              #
              -------------------------------------------------------------------------
            </div>
            <div className="text-sm mt-2">
              Use arrow keys to navigate through sections and items.
            </div>
          </div>
        </div>

        <div className="w-full  lg:w-1/2 space-y-8">
          <Image
            src="/terminal-folio/images/talk.jpg"
            alt="TALK Project Screenshot"
            width={600}
            height={400}
            className="rounded-lg border border-[#fe1d1d] brightness-50 opacity-80 hover:brightness-100"
          />
          <Video
            src="talk.mp4"
            className="w-full rounded-lg border border-[#fe1d1d] brightness-50 opacity-80 hover:brightness-100"
            autoPlay
            muted
            loop
          />
        </div>
      </div>
    </div>
  );
}
