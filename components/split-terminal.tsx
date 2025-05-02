"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal } from "@/components/terminal";
import { asciiArt } from "@/lib/ascii-art";
import { menuData } from "@/lib/menu-data";
import { componentRegistry } from "@/lib/component-registry";
import { SystemInfoSidebar } from "@/components/ui/system-info-sidebar"; // Import the new sidebar
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import { AnimatedListItems } from "@/components/magicui/animated-list-items";  

import {
  AnimatedSpan,
  Terminal1,
  TypingAnimation,
} from "@/components/magicui/terminal"; // Uncommented import

const ELEMENTS = [
  {
    id: "1",
    isSelectable: true,
    name: "src",
    children: [
      {
        id: "2",
        isSelectable: true,
        name: "app",
        children: [
          {
            id: "3",
            isSelectable: true,
            name: "layout.tsx",
          },
          {
            id: "4",
            isSelectable: true,
            name: "page.tsx",
          },
        ],
      },
      {
        id: "5",
        isSelectable: true,
        name: "components",
        children: [
          {
            id: "6",
            isSelectable: true,
            name: "ui",
            children: [
              {
                id: "7",
                isSelectable: true,
                name: "button.tsx",
              },
            ],
          },
          {
            id: "8",
            isSelectable: true,
            name: "header.tsx",
          },
          {
            id: "9",
            isSelectable: true,
            name: "footer.tsx",
          },
        ],
      },
      {
        id: "10",
        isSelectable: true,
        name: "lib",
        children: [
          {
            id: "11",
            isSelectable: true,
            name: "utils.ts",
          },
        ],
      },
    ],
  },
];

export function SplitTerminal() {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState(0);
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [focusedSection, setFocusedSection] = useState<"menu" | "terminal">(
    "menu"
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const activeMenu = menuData[activeMenuIndex];
  const activeSubMenu = activeMenu.subItems?.[activeSubMenuIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setFocusedSection((prev) => (prev === "menu" ? "terminal" : "menu"));
      }

      if (focusedSection === "menu") {
        if (e.key === "ArrowUp") {
          if (showSubMenu && activeSubMenuIndex > 0) {
            setActiveSubMenuIndex((prev) => prev - 1);
          } else if (!showSubMenu && activeMenuIndex > 0) {
            setActiveMenuIndex((prev) => prev - 1);
          }
        } else if (e.key === "ArrowDown") {
          if (
            showSubMenu &&
            activeMenu.subItems &&
            activeSubMenuIndex < activeMenu.subItems.length - 1
          ) {
            setActiveSubMenuIndex((prev) => prev + 1);
          } else if (!showSubMenu && activeMenuIndex < menuData.length - 1) {
            setActiveMenuIndex((prev) => prev + 1);
          }
        } else if (e.key === "ArrowRight") {
          setShowSubMenu(true);
        } else if (e.key === "ArrowLeft") {
          setShowSubMenu(false);
        } else if (e.key === "Enter") {
          if (!showSubMenu) {
            setShowSubMenu(true);
            setActiveSubMenuIndex(0);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeMenuIndex,
    activeSubMenuIndex,
    showSubMenu,
    focusedSection,
    activeMenu.subItems,
  ]);

  // Auto-scroll to active menu item
  useEffect(() => {
    if (menuRef.current) {
      const activeElement = menuRef.current.querySelector(
        '[data-active="true"]'
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeMenuIndex, activeSubMenuIndex, showSubMenu]);

  // Handle menu item click
  const handleMenuItemClick = (index: number) => {
    setActiveMenuIndex(index);
    setActiveSubMenuIndex(0);
    setShowSubMenu(true);
    setFocusedSection("menu");
  };

  // Handle submenu item click
  const handleSubMenuItemClick = (index: number) => {
    setActiveSubMenuIndex(index);
    setFocusedSection("menu");
  };

  return (
    <div className=" flex h-screen w-full overflow-hidden">
      {/* Added background color for consistency */}
      {/* Left System Info Sidebar - 15% width (hidden on small screens) */}
      <SystemInfoSidebar />

      {/* Main Content Section - Adjusted width */}
      <div
        id="content-text"
        className="mt-4 left-[15%] mb-4 w-full pt-14 md:w-[65%] scrollbar-custom h-full terminal-text-red p-4 overflow-auto overflow-x-hidden relative"
      >
        {/* <div className="animated-box" />
        <div className="animated-box-glow" /> */}
        {/* Adjusted width to 65% on medium screens and up, full width on small */}
        {/* CRT effects */}
        {/* <div className="scan-line"></div>
              <div className="crt-overlay"></div>
              <div className="vignette"></div>
              <div className="scan-line1"></div>
              <div className="flicker"></div>
              <div className="scan-line2"></div>
              <div className="scan-line3"></div> */}
        {/* ASCII Art Display */}

        {/* <div className="whitespace-pre text-xl leading-none font-mono terminal-text-red">
          {asciiArt[activeMenu.asciiArt as keyof typeof asciiArt] ||
            asciiArt.logo}
        </div> */}

        <div className={`whitespace-pre text-xl leading-none font-mono ascii-art ${activeMenu.asciiArt}`}>
          {asciiArt[activeMenu.asciiArt as keyof typeof asciiArt] ||
           asciiArt.logo}
        </div>

        {/* Content Display */}
        <div className="mt-4 font-mono">
          <h2 className="text-green-100 mb-2">{activeMenu.title}</h2>
          <p className=" text-white mb-4">{activeMenu.subtitle}</p>

          {activeSubMenu && (
            <div className="mt-4">
              <h3 className="text-green-100 mb-2">{activeSubMenu.title}</h3>
              {activeSubMenu.contentComponent ? (
                <div className="component-wrapper">
                  {(() => {
                    const Component =
                      componentRegistry[
                        activeSubMenu.contentComponent as keyof typeof componentRegistry
                      ];
                    return Component ? <Component /> : null;
                  })()}
                </div>
              ) : (
                <p className="text-white mb-4">{activeSubMenu.content}</p>
              )}

              {/* {activeSubMenu.commands && activeSubMenu.commands.length > 0 && (
                <div className="mt-4">
                  <p className="text-green-100 mb-2">Example commands:</p>
                  {activeSubMenu.commands.map((cmd, i) => (
                    <div key={i} className="text-white mb-1">
                      <span className="text-green-100">&gt;</span> {cmd}
                    </div>
                  ))}
                </div>
              )} */}
            </div>
          )}

          {activeMenu.id === "terminal" && (
            <div
              ref={terminalRef}
              className={`mt-4 border ${
                focusedSection === "terminal"
                  ? "border-black"
                  : "border-[var(--main-text)] border-dashed"
              } rounded-sm p-4 h-full overflow-hidden`}
              tabIndex={0}
              onClick={() => setFocusedSection("terminal")}
            >
              <Terminal isEmbedded={true} />
            </div>
          )}
        </div>
      </div>

      {/* <div className="scan-line"></div>
      <div className="crt-overlay"></div>
      <div className="vignette"></div>

      <div className="flicker"></div>
      <div className="scan-line2"></div> */}
      {/* <div className="scan-line3"></div> */}
      {/* <div className="scan-line1"></div> */}

      {/* Right Menu Section - 20% width (fixed, hidden on small screens) */}
      <div
        ref={menuRef}
        className={`hidden md:flex fixed top-0 right-0 w-[20%] terminal-text-red flex-col h-full overflow-y-auto${
          focusedSection === "menu" ? "ring-green-500" : ""
        }`}
        tabIndex={0}
        onClick={() => setFocusedSection("menu")}
      >
        {/* Main Menu */}
        <div className="min-h-[200px] p-2 flex flex-row mb-10 w-full border-b-[2px] border-dashed border-[var(--main-accent-50)] bg-black/20 rounded-sm backdrop-blur-sm">
          <div className="min-w-1/2 w-1/2 h-[200px] flex-col items-center">
            {menuData.map((item, index) => (
              <div
                key={item.id}
                className={` flex mb-4 uppercase cursor-pointer transition-all duration-200 ${
                  activeMenuIndex === index
                    ? "neon-red text-md drop-shadow-[0_0_3px_var(--main-accent)]"
                    : "terminal-text-red text-sm hover:text-[var(--main-accent)]"
                }`}
                data-active={activeMenuIndex === index && !showSubMenu}
                onClick={() => handleMenuItemClick(index)}
              >
                <div className="font-mono flex items-center">
                  <span className={`mr-2 ${activeMenuIndex === index ? "text-[var(--main-accent)]" : "opacity-50"}`}>
                    {activeMenuIndex === index ? "█" : "▒"}
                  </span>
                  {item.title}
                </div>
                <div className="text-sm opacity-80">{item.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Submenu for active item */}
          {showSubMenu && activeMenu.subItems && (
            <div className="pt-4">
              {/* <div className="text-green-200 mb-4">{activeMenu.title}</div> */}
              {activeMenu.subItems.map((subItem, index) => (
                <div
                  key={subItem.id}
                  className={`mb-3 cursor-pointer uppercase transition-all duration-200 hover:text-[var(--main-accent)] ${
                    activeSubMenuIndex === index
                      ? "text-[var(--main-accent)] font-bold tracking-wider"
                      : "text-white"
                  }`}
                  data-active={
                    activeMenuIndex === activeMenuIndex &&
                    activeSubMenuIndex === index &&
                    showSubMenu
                  }
                  onClick={() => handleSubMenuItemClick(index)}
                >
                  <div className="flex text-xs items-center">
                    <span className={`mx-1 inline-block ${activeSubMenuIndex === index ? "text-[var(--main-accent)]" : "opacity-50"}`}>
                      {activeSubMenuIndex === index ? "►" : "•"}
                    </span>
                    <span className={`${activeSubMenuIndex === index ? "border-b text-sm border-[var(--main-accent)]" : ""}`}>
                      {subItem.title}
                    </span>
                  </div>
                  {/* <div className="text-xs opacity-70 ml-4">
                    {subItem.description}
                  </div> */}
                </div>
              ))}

              {/* {activeMenu.commands && activeMenu.commands.length > 0 && (
                <div className="mt-6 pt-4">
                  <div className="text-white mb-2">view all commands</div>
                  {activeMenu.commands.map((cmd, i) => (
                    <div key={i} className="text-gray-400 mb-1 ml-4">
                      {cmd}
                    </div>
                  ))}
                </div>
              )} */}
            </div>
          )}
        </div>

        <div className="w-full p-1 overflow-auto">
          <div className="relative flex flex-col items-center justify-center overflow-hidden">  
            <Tree
              className="overflow-hidden p-2"
              initialSelectedId="7"
              initialExpandedItems={[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
              ]}
              elements={ELEMENTS}
            >
              <Folder element="src" value="1">
                <Folder value="2" element="app">
                  <File value="3">
                    <p>layout.tsx</p>
                  </File>
                  <File value="4">
                    <p>page.tsx</p>
                  </File>
                </Folder>
                <Folder value="5" element="components">
                  <Folder value="6" element="ui">
                    <File value="7">
                      <p>button.tsx</p>
                    </File>
                  </Folder>
                  <File value="8">
                    <p>header.tsx</p>
                  </File>
                  <File value="9">
                    <p>footer.tsx</p>
                  </File>
                </Folder>
                <Folder value="10" element="lib">
                  <File value="11">
                    <p>utils.ts</p>
                  </File>
                </Folder>
              </Folder>
            </Tree>
          </div>

          <AnimatedListItems />
            
    
          <Terminal1 className="overflow-hidden">
            <AnimatedSpan delay={1500} className="text-[var(--main-text)]">
              <span>✔ Preflight checks.</span>
            </AnimatedSpan>
 
            <AnimatedSpan delay={2000} className="text-[var(--main-text)]">
              <span>✔ Verifying framework. Found Next.js.</span>
            </AnimatedSpan>

            <AnimatedSpan delay={2500} className="text-[var(--main-text)]">
              <span>✔ Validating Tailwind CSS.</span>
            </AnimatedSpan>

            <AnimatedSpan delay={4000} className="text-[var(--main-accent)]">
              <span>X Bad registry.</span>
            </AnimatedSpan>

            <AnimatedSpan delay={4500} className="text-[var(--main-text)]">
              <span>✔ Updating tailwind.config.ts</span>
            </AnimatedSpan>

            <AnimatedSpan delay={5000} className="text-[var(--main-text)]">
              <span>✔ Updating app/globals.css</span>
            </AnimatedSpan>

            <AnimatedSpan delay={6000} className="text-blue-500">
              <span>ℹ Updated 1 file:</span>
              <span className="pl-2">- lib/utils.ts</span>
            </AnimatedSpan>

            <AnimatedSpan delay={5500} className="text-[var(--main-text)]">
              <span>✔ Installing dependencies.</span>
            </AnimatedSpan>

            <AnimatedSpan delay={6000} className="text-blue-500">
              <span>ℹ Updated 1 file:</span>
              <span className="pl-2">- lib/utils.ts</span>
            </AnimatedSpan>
          </Terminal1>
   
        </div>
      </div>
    </div>
  );
}
