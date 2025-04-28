import { asciiArt } from "./ascii-art";
import { updateUserAccessLevel, getUserInputHistory } from "./database-manager";
import { getImagePath, getVideoPath, getSoundPath } from "./utils";

// Event handler functions
export function triggerEvent(
  eventName: string,
  params: string,
  app: any
): void {
  console.log(`[EVENT] Triggering event: ${eventName} with params: ${params}`);

  // In a real implementation, this would call the appropriate handler
  switch (eventName) {
    case "PLAY_AUDIO":
      handlePlayAudio(params, app);
      break;
    case "PRINT_IMAGE":
      handlePrintImage(params, app);
      break;
    case "PLAY_VIDEO": // Added case for PLAY_VIDEO
      handlePlayVideo(params, app);
      break;
    case "PRINT_ASCII":
      handlePrintAscii(params, app);
      break;
    case "KILL_TERMINAL":
      handleKillTerminal(params, app);
      break;
    case "SIMULATE_TYPING":
      handleSimulateTyping(params, app);
      break;
    case "SHOW_HISTORY":
      handleShowHistory(params, app);
      break;
    case "UPGRADE_ACCESS":
      handleUpgradeAccess(params, app);
      break;
    case "UPGRADE_USER":
      handleUpgradeUser(params, app);
      break;
    default:
      console.log(`[ERROR] Unknown event: ${eventName}`);
  }
}

function handlePlayAudio(params: string, app: any): void {
  // In a browser environment, we can play audio using the Web Audio API
  try {
    const soundFile = params || "beep.mp3";
    const audio = new Audio(getSoundPath(soundFile));
    audio.play();
    app.addToLog("system", "🔊 Playing audio sequence...");
  } catch (error) {
    console.error("Error playing audio:", error);
    app.addToLog("error", "Error playing audio");
  }
}

// function handlePrintImage(params: string, app: any): void {
//   // For simplicity, we'll just display the alien ASCII art
//   app.addToLog("system", asciiArt.alien)
// }

function handlePrintImage(params: string, app: any): void {
  app.addToLog("system", "Rendering image...");
  const imagePath = getImagePath(params || "default.png");
  const imageHtml = `<div><img src="${imagePath}" alt="Terminal Image" class="terminal-image" /></div>`;
  app.addToLog("system", imageHtml, true, null); // Pass null for componentName
}

function handlePlayVideo(params: string, app: any): void {
  app.addToLog("system", "Loading video...");
  // Use params as the video source if provided, otherwise default to a fallback
  const videoPath = getVideoPath(params || "loader.mp4");
  // Construct video HTML with controls and a class, basic width/height
  const videoHtml = `<div><video src="${videoPath}" controls autoplay loop class="terminal-video" width="50%"></video></div>`;
  app.addToLog("system", videoHtml, true, null); // Add to log as HTML
}

function handlePrintAscii(params: string, app: any): void {
  // Display ASCII art based on the params
  const art = asciiArt[params as keyof typeof asciiArt] || asciiArt.logo;
  app.addToLog("system", art);
}

function handleKillTerminal(params: string, app: any): void {
  app.addToLog("error", params);
  app.setIsTyping(true); // Lock the terminal

  // Display a warning ASCII art
  app.addToLog("error", asciiArt.access_denied);

  // In a real application, you might want to redirect or reload after a delay
  setTimeout(() => {
    window.location.reload();
  }, 5000);
}

function handleSimulateTyping(params: string, app: any): void {
  let index = 0;
  const chars = params.split("");
  let displayText = "";

  app.setIsTyping(true);
  app.addToLog("system", ""); // Create initial empty log entry

  function typeNextChar() {
    if (index < chars.length) {
      displayText += chars[index];

      // Update the last log entry instead of creating a new one
      app.updateLastLog("system", displayText);

      // Calculate delay for next character
      let delay = 50;
      const char = chars[index];
      if ([".", "!", "?"].includes(char)) delay = 400;
      else if (char === ",") delay = 200;
      else if (char === "\n") delay = 300;
      delay += Math.random() * 30;

      index++;
      setTimeout(typeNextChar, delay);
    } else {
      app.setIsTyping(false);
    }
  }

  typeNextChar();
}

// function handlePlayVideo(params: string, app: any): void {
//   app.addToLog("system", "Video playback is not supported in this environment.")
// }

async function handleShowHistory(params: string, app: any): Promise<void> {
  try {
    const history = await getUserInputHistory(app.currentUser.id, 10);

    if (history.length === 0) {
      app.addToLog("system", "No command history found.");
      return;
    }

    app.addToLog("system", "Command History:");
    history.forEach((entry, index) => {
      const timestamp = new Date(entry.timestamp).toLocaleString();
      app.addToLog(
        "system",
        `${index + 1}. [${timestamp}] ${entry.command_text}`
      );
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    app.addToLog("error", "Error retrieving command history");
  }
}

function handleUpgradeAccess(params: string, app: any): void {
  // This is a placeholder for a more complex access upgrade system
  // In a real application, you might want to implement a password challenge

  if (app.currentUser.accessLevel >= 10) {
    app.addToLog("system", "You already have maximum access level.");
    return;
  }

  // Simulate a challenge
  app.addToLog("system", "Access upgrade requires authentication.");
  app.simulateTyping(
    "Enter the secret code in your next command to upgrade access level."
  );
}

async function handleUpgradeUser(params: string, app: any): Promise<void> {
  const newLevel = Number.parseInt(params, 10);

  if (isNaN(newLevel) || newLevel < 1) {
    app.addToLog("error", "Invalid access level specified.");
    return;
  }

  try {
    const success = await updateUserAccessLevel(app.currentUser.id, newLevel);

    if (success) {
      app.setCurrentUser({
        ...app.currentUser,
        accessLevel: newLevel,
      });

      app.addToLog("system", `Access level upgraded to ${newLevel}`);
      app.addToLog("system", asciiArt.access_granted);
    } else {
      app.addToLog("error", "Failed to upgrade access level");
    }
  } catch (error) {
    console.error("Error upgrading user:", error);
    app.addToLog("error", "Error upgrading access level");
  }
}
