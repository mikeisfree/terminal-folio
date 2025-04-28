"use client";

import { useEffect, useState } from "react";
import { SplitTerminal } from "@/components/split-terminal";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import MeshBackground from '@/components/meshBackground';
// import { Ripple } from "@/components/magicui/ripple";
import VideoLoader from "../components/VideoLoader";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  const handleSkip = () => {
    setLoading(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ThemeProvider>
      {loading ? (
        <VideoLoader onLoadComplete={handleLoadComplete} onSkip={handleSkip} />
      ) : (
        <>
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            {/* <Ripple /> */}
            <MeshBackground />
          </div>
          <div className="max-h-screen flex flex-col overflow-hidden">
            <div className="scan-line"></div>
            <div className="crt-overlay"></div>
            <div className="vignette"></div>
            {/* <div className="scan-line1"></div> */}
            <div className="flicker"></div>
            {/* {/* <div className="scan-line2"></div> */}
            {/* <div className="scan-line3"></div> */}
            <header className="flex absolute top-0 w-full z-20 justify-between items-center bg-transparent px-4">
              <h1 className="text-xl font-bold text-green-500 terminal-text"></h1>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-main-text" />
                ) : (
                  <Moon className="h-5 w-5 text-black" />
                )}
              </Button>
            </header>
            <main className="flex-1 h-screen">
              <SplitTerminal />
            </main>
            <footer className="fixed bottom-0 w-full text-center p-2 text-xs text-gray-600">
              <p>⟊⫯⧔⦳⩑-⦾⩜⨐ ⩂⩏⦪⦼ ⬯⫰⦣⨎⩄⩑ ⦓⦵⩩⩂ ⦚⫽⦋⨝⬯⫪⦻⦴⩀⧑</p>
            </footer>
          </div>
        </>
      )}
    </ThemeProvider>
  );
}
