// '"use client";
//
// import { useEffect, useState } from "react";
// import { SplitTerminal } from "@/components/split-terminal";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Button } from "@/components/ui/button";
// import { Moon, Sun } from "lucide-react";
// import { Ripple } from "@/components/magicui/ripple";
// import VideoLoader from "../components/VideoLoader";

// // Configure load time in milliseconds
// const LOAD_DURATION = 20000; // 5 seconds

// export default function Home() {
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Set dark mode by default
//     document.documentElement.classList.add("dark");

//     // Setup loader timer
//     const timer = setTimeout(() => setLoading(false), LOAD_DURATION);

//     // Space bar skip handler
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (e.code === "Space" && loading) {
//         setLoading(false);
//         clearTimeout(timer);
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);

//     // Cleanup
//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [loading]);

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle("dark");
//   };
//   // disable right click menu

//   //   document.addEventListener("contextmenu", function (e){
//   //     e.preventDefault();
//   // }, true);

//   return (
//     <ThemeProvider>
//       {loading ? (
//         <div style={{ position: "relative" }}>
//           <VideoLoader />
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-50">
//             Press SPACE to skip
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="absolute inset-0 h-full w-full overflow-hidden">
//             <Ripple />
//           </div>
//           <div className="max-h-screen flex flex-col overflow-hidden">
//             <div className="scan-line"></div>
//             <div className="crt-overlay"></div>
//             <div className="vignette"></div>
//             <div className="scan-line1"></div>
//             <div className="flicker"></div>

//             <header className="flex absolute top-0 w-full z-20 justify-between items-center bg-transparent px-4">
//               <h1 className="text-xl font-bold text-green-500 terminal-text"></h1>
//               <Button variant="ghost" size="icon" onClick={toggleTheme}>
//                 {isDarkMode ? (
//                   <Sun className="h-5 w-5 text-main-text" />
//                 ) : (
//                   <Moon className="h-5 w-5 text-black" />
//                 )}
//               </Button>
//             </header>
//             <main className="flex-1 h-screen">
//               <SplitTerminal />
//             </main>
//             <footer className="text-center p-2 text-xs text-gray-600">
//               <p>⟊⫯⧔⦳⩑-⦾⩜⨐ ⩂⩏⦪⦼ ⬯⫰⦣⨎⩄⩑ ⦓⦵⩩ ⦚⫽⦋⨝⫪⦻⦴⩀⧑</p>
//             </footer>
//           </div>
//         </>
//       )}
//     </ThemeProvider>
//   );
// }
