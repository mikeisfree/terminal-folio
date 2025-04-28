"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"

// Define the data structure for our stats
interface StatItem {
  label: string
  value: string
  color?: string
}

interface StatCategory {
  id: string
  title: string
  items: StatItem[]
}

interface StatSection {
  id: string
  title: string
  categories: StatCategory[]
}

// Mock data for the GitHub Pulse
const pulseData: StatSection[] = [
  {
    id: "global",
    title: "Global",
    categories: [
      {
        id: "state-of-things",
        title: "::State-of-things",
        items: [
          { label: "Total developers on GitHub", value: "94M", color: "text-yellow-400" },
          { label: "New developers in 2022", value: "28.5M", color: "text-yellow-400" },
          { label: "Fortune 100 companies using GitHub", value: "90%+", color: "text-yellow-400" },
          { label: "Total open source contributions", value: "413M", color: "text-yellow-400" },
          { label: "New projects started", value: "85M+", color: "text-yellow-400" },
        ],
      },
      {
        id: "core",
        title: "::Core /*",
        items: [
          { label: "Repositories created", value: "122M+", color: "text-yellow-400" },
          { label: "Active repositories", value: "28M+", color: "text-yellow-400" },
          { label: "Package downloads", value: "3.5B+", color: "text-yellow-400" },
        ],
      },
    ],
  },
  {
    id: "productivity",
    title: "Productivity",
    categories: [
      {
        id: "productivity",
        title: "::Productivity",
        items: [
          { label: "Pull requests merged", value: "227M+", color: "text-yellow-400" },
          { label: "Issues closed", value: "31M+", color: "text-yellow-400" },
          { label: "Automated jobs running on Actions", value: "263M", color: "text-yellow-400" },
          { label: "CI/CD minutes used", value: "7.2B+", color: "text-yellow-400" },
        ],
      },
    ],
  },
  {
    id: "social",
    title: "Social",
    categories: [
      {
        id: "interactions",
        title: "::Interactions",
        items: [
          { label: "Comments", value: "497M+", color: "text-yellow-400" },
          { label: "Code reviews", value: "31M+", color: "text-yellow-400" },
          { label: "Reactions", value: "2.38+", color: "text-yellow-400" },
          { label: "Starred repos", value: "1.98+", color: "text-yellow-400" },
        ],
      },
    ],
  },
  {
    id: "reactions",
    title: "Reactions",
    categories: [
      {
        id: "reactions",
        title: "::Reactions --all",
        items: [
          { label: "❤️", value: "967M", color: "text-yellow-400" },
          { label: "🚀", value: "95M", color: "text-yellow-400" },
          { label: "👀", value: "487M", color: "text-yellow-400" },
          { label: "👍", value: "723M", color: "text-yellow-400" },
          { label: "👎", value: "89M", color: "text-yellow-400" },
        ],
      },
    ],
  },
]

export function GitHubPulse() {
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const [activeLevel, setActiveLevel] = useState<"section" | "category" | "item">("section")

  // Refs for scrolling
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Simulate loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 500)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return

      switch (e.key) {
        case "ArrowRight":
          if (activeLevel === "section") {
            setActiveLevel("category")
          } else if (activeLevel === "category") {
            setActiveLevel("item")
          }
          break

        case "ArrowLeft":
          if (activeLevel === "item") {
            setActiveLevel("category")
          } else if (activeLevel === "category") {
            setActiveLevel("section")
          }
          break

        case "ArrowUp":
          if (activeLevel === "section") {
            setActiveSectionIndex((prev) => (prev > 0 ? prev - 1 : pulseData.length - 1))
            setActiveCategoryIndex(0)
            setActiveItemIndex(0)
          } else if (activeLevel === "category") {
            const categories = pulseData[activeSectionIndex].categories
            setActiveCategoryIndex((prev) => (prev > 0 ? prev - 1 : categories.length - 1))
            setActiveItemIndex(0)
          } else if (activeLevel === "item") {
            const items = pulseData[activeSectionIndex].categories[activeCategoryIndex].items
            setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
          }
          break

        case "ArrowDown":
          if (activeLevel === "section") {
            setActiveSectionIndex((prev) => (prev < pulseData.length - 1 ? prev + 1 : 0))
            setActiveCategoryIndex(0)
            setActiveItemIndex(0)
          } else if (activeLevel === "category") {
            const categories = pulseData[activeSectionIndex].categories
            setActiveCategoryIndex((prev) => (prev < categories.length - 1 ? prev + 1 : 0))
            setActiveItemIndex(0)
          } else if (activeLevel === "item") {
            const items = pulseData[activeSectionIndex].categories[activeCategoryIndex].items
            setActiveItemIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [loading, activeLevel, activeSectionIndex, activeCategoryIndex, activeItemIndex])

  // Scroll to active section
  useEffect(() => {
    if (!loading && sectionRefs.current[activeSectionIndex]) {
      sectionRefs.current[activeSectionIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [loading, activeSectionIndex])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-green-500 p-8">
        <div className="text-2xl mb-8 font-mono">Loading GitHub Pulse...</div>
        <div className="w-full max-w-md h-4 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <div className="mt-4 font-mono">{loadingProgress}%</div>
      </div>
    )
  }

  return (
    <div className="h-full bg-black text-white font-mono p-4 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="text-gray-500">
          <div># gh pulse --year 2022 --all</div>
          <div># -------------------------------------------------------------------------</div>
        </div>

        <div className="text-4xl my-4 text-white">The Pulse of Open Source</div>

        <div className="text-gray-500">
          <div># A few key stats about the Open Source world at GitHub</div>
          <div># -------------------------------------------------------------------------</div>
        </div>
      </div>

      {/* Stats Sections */}
      <div className="space-y-8">
        {pulseData.map((section, sectionIndex) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[sectionIndex] = el;
            }}
            className={`pb-4 flex justify-between flex-wrap lg:flex-row ${sectionIndex < pulseData.length - 1 ? "border-b border-gray-800" : ""}`}
          >
            <div
              className={`flex mb-2 ${
                activeLevel === "section" && activeSectionIndex === sectionIndex
                  ? "text-green-500 font-bold"
                  : "text-gray-400"
              }`}
            >
              <span className="mr-2">#</span>
              <span>{section.title}</span>
            </div>

            {section.categories.map((category, categoryIndex) => (
              <div key={category.id} className="ml-8 mb-4">
                <div
                  className={`text-blue-400 mb-2 ${
                    activeLevel === "category" &&
                    activeSectionIndex === sectionIndex &&
                    activeCategoryIndex === categoryIndex
                      ? "text-cyan-300 font-bold"
                      : ""
                  }`}
                >
                  {category.title}
                </div>

                <div className="space-y-1 ml-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={`${item.label}-${itemIndex}`}
                      className={`flex items-start ${
                        activeLevel === "item" &&
                        activeSectionIndex === sectionIndex &&
                        activeCategoryIndex === categoryIndex &&
                        activeItemIndex === itemIndex
                          ? "bg-gray-900"
                          : ""
                      }`}
                    >
                      <ChevronRight className="h-4 w-4 mt-1 mr-2 text-gray-500" />
                      <div className="flex-1">{item.label}</div>
                      <div className={item.color || "text-yellow-400"}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-gray-500">
        <div># -------------------------------------------------------------------------</div>
        <div className="text-sm mt-2">
          Press arrow keys to navigate. Left/Right to change levels, Up/Down to move between items.
        </div>
      </div>
    </div>
  )
}

