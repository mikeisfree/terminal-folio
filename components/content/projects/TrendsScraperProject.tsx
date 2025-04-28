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
    id: "features",
    title: "Features",
    items: [
      {
        title: "Categories",
        description: "Multiple category support",
        value: "Business, Politics, News, Sports",
      },
      {
        title: "Articles",
        description: "Related articles extraction",
        value: "Auto-fetch related content",
      },
      {
        title: "Output",
        description: "Multiple formats",
        value: "Markdown and JSON support",
      },
      {
        title: "Reliability",
        description: "Fallback mechanisms",
        value: "Robust data collection",
      },
      {
        title: "Dynamic",
        description: "Dynamic content",
        value: "Selenium WebDriver support",
      },
    ],
  },
  {
    id: "stack",
    title: "Tech Stack",
    items: [
      {
        title: "Python",
        description: "Core language",
        value: "Python 3.11+",
      },
      {
        title: "Packages",
        description: "Required packages",
        value: "requests, beautifulsoup4",
      },
      {
        title: "Browser",
        description: "Web automation",
        value: "ChromeDriver integration",
      },
    ],
  },
];

const cliExample = `python run_agent.py --region US --category business --output results.json`;

const jsonExample = `{
  "timestamp": "2025-03-03 04:45:12",
  "region": "US",
  "category": "Business & Finance",
  "keywords": [
    {
      "keyword": "xrp price",
      "search_volume": "200K+",
      "articles": [
        "https://edition.cnn.com/2025/03/02/business/trump-cryptocurrency-market-spike/index.html",
        "https://finance.yahoo.com/video/crypto-prices-jump-trump-sets-025315985.html"
      ]
    }
  ]
}`;

export function TrendsScraperProject() {
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
              <div># Google Trends Agent</div>
              <div>
                #
                -------------------------------------------------------------------------
              </div>
            </div>
            <div className="mt-4">
              This agent retrieves top trending keywords from Google Trends across categories for 15 Countries and finds related article links for each keyword.
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
        </div>

        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <div className="text-[#fe1d1d] mb-2">CLI Usage:</div>
            <pre className="scrollbar-custom bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code>{cliExample}</code>
            </pre>
          </div>

          <div>
            <div className="text-[#fe1d1d] mb-2">Example Output:</div>
            <pre className="scrollbar-custom bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code>{jsonExample}</code>
            </pre>
          </div>
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
