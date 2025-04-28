"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

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
        title: "Interface",
        description: "UI design",
        value: "Clean black & white interface",
      },
      {
        title: "API",
        description: "REST endpoints",
        value: "JSON & MD output formats",
      },
      {
        title: "Documents",
        description: "PDF support",
        value: "Remote PDF URL processing",
      },
      {
        title: "Reliability",
        description: "Error handling",
        value: "Automatic retry with backoff",
      },
      {
        title: "Intelligence",
        description: "Document processing",
        value: "AI-digestable restructuring",
      },
      {
        title: "Images",
        description: "Image processing",
        value: "Base64 image extraction",
      },
      {
        title: "Tables",
        description: "Table handling",
        value: "Complex table recognition",
      },
      {
        title: "Math",
        description: "Mathematical content",
        value: "Complex algebra parsing",
      },
      {
        title: "Analysis",
        description: "Document analysis",
        value: "Comprehensive text analysis",
      },
    ],
  },
  {
    id: "techstack",
    title: "Tech Stack",
    items: [
      {
        title: "Core",
        description: "Main technologies",
        value: "Python 3.x / Flask",
      },
      {
        title: "AI",
        description: "AI integration",
        value: "Mistrall API",
      },
      {
        title: "API",
        description: "API layer",
        value: "REST API",
      },
    ],
  },
];

export function OCRProject() {
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
              <div># Flask-based OCR tool powered by Mistral</div>
              <div>
                #
                -------------------------------------------------------------------------
              </div>
            </div>
            <div className="mt-4">
              Flask API made around Mistral OCR LLM for automation pipelines (process, scrape, interact). Supports PDF's with images (base64), tables, complex algebra, analysis.
              Deploy to selfhost/cloud(VPS/Render/PythonAnywhere etc...) 
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

          <div className="text-[#fe1d1d] pt-4">
            Learn more at:
            <div className="pl-4 text-sm">
              <div>→ https://docs.mistral.ai/capabilities/document/</div>
              <div>→ https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/structured_ocr.ipynb</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          <Image
            src="/terminal-folio/images/ocr1.png"
            alt="OCR Example 1"
            width={300}
            height={200}
            className="rounded-lg border border-[#fe1d1d]"
          />
          <Image
            src="/terminal-folio/images/ocr2.png"
            alt="OCR Example 2"
            width={300}
            height={200}
            className="rounded-lg border border-[#fe1d1d]"
          />
          <Image
            src="/terminal-folio/images/ocr3.png"
            alt="OCR Example 3"
            width={300}
            height={200}
            className="rounded-lg border border-[#fe1d1d]"
          />
          <Image
            src="/terminal-folio/images/ocr4.png"
            alt="OCR Example 4"
            width={300}
            height={200}
            className="rounded-lg border border-[#fe1d1d]"
          />
        </div>
      </div>

      <div className="mt-8 text-[#fe1d1d]">
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
