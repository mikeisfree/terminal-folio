"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { processCommand } from "@/lib/command-processor";
import {
  logUserInput,
  getOrCreateUser,
  initializeDatabase,
} from "@/lib/database-manager";
import { checkScenarios } from "@/lib/scenario-manager";
import { triggerEvent } from "@/lib/event-manager";
import {
  loadCommandsFromYaml,
  loadScenariosFromYaml,
  defaultCommandsYaml,
  defaultScenariosYaml,
} from "@/lib/config-loader";
import { asciiArt } from "@/lib/ascii-art";
import { GitHubPulse } from "./github-pulse";
import { componentRegistry } from "@/lib/component-registry";

interface LogEntry {
  type: "input" | "output" | "error" | "system";
  content: string;
  timestamp: Date;
  isHtml?: boolean;
  componentName?: string; // Add this field
}

interface TerminalProps {
  isEmbedded?: boolean;
}

export function Terminal({ isEmbedded = false }: TerminalProps) {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [consecutiveErrorCount, setConsecutiveErrorCount] = useState(0);
  const [currentUser, setCurrentUser] = useState({ id: 1, accessLevel: 1 });
  const [commands, setCommands] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showGitHubPulse, setShowGitHubPulse] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize the terminal
  useEffect(() => {
    if (!mounted) return; // Don't initialize until component is mounted

    const initTerminal = async () => {
      try {
        // Initialize database
        const dbInitialized = await initializeDatabase();

        // Even if database initialization fails, continue with local functionality
        if (!dbInitialized) {
          console.warn(
            "Database initialization failed, continuing with local functionality only"
          );
        }

        // Get or create user (will use fallback if database operations fail)
        const user = await getOrCreateUser("terminal_user");
        setCurrentUser(user);

        // Load commands and scenarios from YAML
        const loadedCommands = await loadCommandsFromYaml(defaultCommandsYaml);
        const loadedScenarios = await loadScenariosFromYaml(
          defaultScenariosYaml
        );

        setCommands(loadedCommands);
        setScenarios(loadedScenarios);

        // Add initial system messages
        setLog([
          {
            type: "system",
            content: isEmbedded ? "§§> Terminal ready" : asciiArt.logo,
            timestamp: new Date(),
          },
          {
            type: "system",
            content: "§§> ALIEN-OS Terminal v1.0.3 initialized",
            timestamp: new Date(),
          },
          {
            type: "system",
            content: "§§> Enter 'help' for available commands",
            timestamp: new Date(),
          },
        ]);

        setIsInitialized(true);
      } catch (error) {
        console.error("Terminal initialization error:", error);
        // Add error message to log
        setLog([
          {
            type: "error",
            content:
              "§§> Terminal initialization failed. Some features may be unavailable.",
            timestamp: new Date(),
          },
          {
            type: "system",
            content: "§§> Enter 'help' for available commands",
            timestamp: new Date(),
          },
        ]);
        setIsInitialized(true); // Still allow terminal to be used
      }
    };

    initTerminal();
  }, [isEmbedded, mounted]);

  // Auto-scroll to bottom of log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const addToLog = (
    type: LogEntry["type"],
    content: string,
    isHtml: boolean = false,
    componentName?: string
  ) => {
    setLog((prev) => [
      ...prev,
      {
        type,
        content,
        timestamp: new Date(),
        isHtml,
        componentName,
      },
    ]);
  };

  const updateLastLog = (type: LogEntry["type"], content: string) => {
    setLog((prev) => {
      const newLog = [...prev];
      if (newLog.length > 0) {
        newLog[newLog.length - 1] = {
          ...newLog[newLog.length - 1],
          type,
          content,
          timestamp: new Date(),
        };
      }
      return newLog;
    });
  };

  const simulateTyping = (text: string) => {
    const baseDelay = 50;
    const variableDelay = 30;
    setIsTyping(true);

    const characters = text.split("");
    let currentText = "";
    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < characters.length) {
        const char = characters[currentIndex];
        currentText += char;

        // Update the log with current text
        setLog((prevLog) => {
          const newLog = [...prevLog];
          if (newLog.length > 0) {
            newLog[newLog.length - 1] = {
              type: "system",
              content: currentText,
              timestamp: new Date(),
            };
          }
          return newLog;
        });

        currentIndex++;

        // Calculate delay based on character
        let delay = baseDelay;
        if ([".", "!", "?"].includes(char)) delay += 400;
        else if (char === ",") delay += 200;
        else if (char === "\n") delay += 300;

        // Add random variation
        delay += Math.random() * variableDelay;

        setTimeout(typeNextCharacter, delay);
      } else {
        setIsTyping(false);
      }
    };

    // Start with empty log entry
    addToLog("system", "");
    // Begin typing
    typeNextCharacter();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !isInitialized) return;

    const commandText = input.trim();
    setInput("");

    // Log user input
    addToLog("input", `§§> ${commandText}`);

    // Special handling for "npm start" command
    if (commandText.toLowerCase() === "npm start") {
      addToLog("system", "Starting GitHub Pulse dashboard...");
      setTimeout(() => {
        setShowGitHubPulse(true);
      }, 1000);
      return;
    }

    // Special handling for "pip install" command
    if (commandText.toLowerCase() === "pip install") {
      addToLog("system", "Installing Python packages...");
      addToLog("system", "", false, "PipInstall");
      return;
    }

    // Special handling for "race" command
    if (commandText.toLowerCase() === "npm run dev") {
      addToLog("system", "Starting Neon Racer...");
      addToLog("system", "", false, "RacingGame"); // Add this line
      return;
    }


    try {
      // Log to database (this will handle errors internally now)
      await logUserInput(currentUser.id, currentUser.accessLevel, commandText);

      // Rest of the function remains the same...
    } catch (error) {
      console.error("Command processing error:", error);
      addToLog("error", "An error occurred while processing your command");
    }

    // Check for secret code (simple example)
    if (commandText.toLowerCase() === "xeno-override") {
      triggerEvent("UPGRADE_USER", "5", {
        addToLog,
        setCurrentUser,
        currentUser,
        simulateTyping,
        setIsTyping,
      });
      return;
    }

    // Process command
    const result = processCommand(
      commandText,
      currentUser.accessLevel,
      commands
    );

    if (result.success) {
      // Format response with dynamic data
      const response = result.response
        .replace("{userLevel}", currentUser.accessLevel.toString())
        .replace("{userId}", currentUser.id.toString())
        .replace("{args}", commandText.split(" ").slice(1).join(" "));

      // Add this to handle component rendering in response
      if (result.success && result.response && result.componentName) {
        addToLog("system", result.response, false, result.componentName);
        return;
      }

      // Handle special commands
      if (result.triggerEvent === "CLEAR_TERMINAL") {
        setLog([]);
        addToLog("system", "§§> Terminal cleared");
      } else if (result.response) {
        // Normal command response
        addToLog("output", response);
      }

      // Trigger any event associated with the command
      if (result.triggerEvent) {
        triggerEvent(
          result.triggerEvent,
          commandText.split(" ").slice(1).join(" "),
          {
            addToLog,
            setCurrentUser,
            currentUser,
            simulateTyping,
            setIsTyping,
            setShowGitHubPulse,
          }
        );
      }

      // Reset error count on success
      setConsecutiveErrorCount(0);

      // Check for COMMAND_SUCCESS scenarios
      const triggeredScenarios = checkScenarios(
        "COMMAND_SUCCESS",
        parseInt(commandText.split(" ")[0]) || 0, // Convert string to number or default to 0
        currentUser.accessLevel,
        scenarios
      );

      // Handle triggered scenarios
      triggeredScenarios.forEach((scenario) => {
        triggerEvent(scenario.event, scenario.params, {
          addToLog,
          setCurrentUser,
          currentUser,
          simulateTyping,
          setIsTyping,
          setShowGitHubPulse,
        });
      });
    } else {
      // Command failed
      addToLog("error", result.response);

      // Increment error count
      const newErrorCount = consecutiveErrorCount + 1;
      setConsecutiveErrorCount(newErrorCount);

      // Check if any scenarios are triggered
      const triggeredScenarios = checkScenarios(
        "ERROR_COUNT",
        newErrorCount,
        currentUser.accessLevel,
        scenarios
      );

      // Handle triggered scenarios
      triggeredScenarios.forEach((scenario) => {
        triggerEvent(scenario.event, scenario.params, {
          addToLog,
          setCurrentUser,
          currentUser,
          simulateTyping,
          setIsTyping,
          setShowGitHubPulse,
        });
      });
    }
  };

  const renderContent = (content: string, componentName?: string) => {
    if (componentName) {
      const Component =
        componentRegistry[componentName as keyof typeof componentRegistry];
      if (Component) {
        return <Component />;
      }
    }
    return content;
  };

  // If GitHub Pulse is active, show that instead of the terminal
  if (showGitHubPulse) {
    return (
      <div className="h-full relative">
        <GitHubPulse />
        <button
          className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700"
          onClick={() => setShowGitHubPulse(false)}
        >
          Back to Terminal
        </button>
      </div>
    );
  }

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`terminal-container overflow-hidden flex flex-col ${
        isEmbedded ? "h-full" : "h-screen"
      } border-[var(--main-text)] rounded-md relative`}
      tabIndex={-1} // Prevent container from receiving focus
    >
      {/* Enhanced CRT and scanline effects */}
      {!isEmbedded && (
        <>
          <div className="scan-line"></div>
          <div className="crt-overlay"></div>
          <div className="vignette"></div>
          <div className="scan-line1"></div>
          <div className="flicker"></div>
          <div className="scan-line2"></div>
          <div className="scan-line3"></div>
        </>
      )}

      <div className="flex-1 p-4 overflow-hidden relative z-0">
        <div className="space-y-2">
          {log.map((entry, i) => (
            <div
              key={i}
              className={`
                ${
                  entry.type === "input"
                    ? "text-[var(--destructive-foreground)] neon-red"
                    : ""
                }
                ${
                  entry.type === "output"
                    ? "text-[var(--destructive-foreground)] terminal-text"
                    : ""
                }
                ${
                  entry.type === "error"
                    ? "text-[var(--destructive-foreground)] terminal-text"
                    : ""
                }
                ${
                  entry.type === "system"
                    ? "text-[var(--main-text)] terminal-text"
                    : ""
                }
                whitespace-pre-wrap
                animation-text-flicker
              `}
              style={{
                animation: "text-flicker 1s infinite",
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {entry.isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: entry.content }} />
              ) : entry.componentName ? (
                <div className="component-wrapper">
                  {renderContent(entry.content, entry.componentName)}
                </div>
              ) : (
                entry.content
              )}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 w-full border-t border-[var(---main-text)] z-10"
        tabIndex={-1}
      >
        <div className="flex">
          <span className="text-cyan-400 terminal-text-cyan mr-2">§§&gt;</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none text-[var(--main-text)] terminal-text focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter command..."
            disabled={isTyping}
            autoFocus // Auto focus the input when component mounts
          />
          <Button
            type="submit"
            variant="ghost"
            className="ml-2 text-white terminal-text hover:text-red-500 hover:bg-gray-900"
            disabled={isTyping}
          >
            Execute
          </Button>
        </div>
      </form>
    </div>
  );
}
