"use client";

import { useEffect, useState } from "react";
import { SplitTerminal } from "@/components/split-terminal";
import { ThemeProvider } from "@/components/theme-provider";
// import { Moon, Sun } from "lucide-react";
import MeshBackground from '@/components/meshBackground';
import HydraPreloader from '@/components/HydraPreloader';


export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ThemeProvider>
{!loaded && <HydraPreloader onComplete={() => setLoaded(true)} />}
{loaded && (
        <>

            <div className="absolute h-full w-full overflow-hidden">
              <MeshBackground />
            </div>
            <div className="max-h-screen flex flex-col overflow-hidden">
              <div className="crt-overlay"></div>
              <div className="vignette"></div>
              {/* <header className="flex absolute top-0 w-full z-20 justify-between items-center bg-transparent px-4">
                <h1 className="text-xl font-bold text-green-500 terminal-text"></h1>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-main-text" />
                  ) : (
                    <Moon className="h-5 w-5 text-black" />
                  )}
                </Button>
              </header> */}
              <main className="flex-1 h-screen">
                <SplitTerminal />
              </main>
              <footer className="fixed bottom-0 w-full text-center p-2 text-xs">
                <p>⟊⫯⧔⦳⩑-⦾⩜⨐ ⩂⩏⦪⦼ ⬯⫰⦣⨎⩄⩑ ⦓⦵⩩⩂ ⦚⫽⦋⨝⬯⫪⦻⦴⩀⧑</p>
              </footer>
              </div>

      </>
      )}
    </ThemeProvider>
  );
}
