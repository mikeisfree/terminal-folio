# ALIEN-OS Terminal Simulator

A retro-futuristic terminal simulator with customizable commands, events, and scenarios. This project simulates an alien operating system terminal interface with various interactive features.

![ALIEN-OS Terminal Screenshot](/screenshot.png)

## Features

- Retro terminal aesthetic with scanlines and CRT effects
- Command processing system with access level restrictions
- Event system for triggering special effects
- Scenario system for creating interactive sequences
- Database integration with Supabase for persistent user data and command history
- Customizable commands and responses
- ASCII art display capabilities
- Simulated typing effect

## Setup

### Prerequisites

- Node.js and npm
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env.local` file with your Supabase credentials:

Thought for 3 secondsI sincerely apologize for the frustration. Let me provide the complete guide directly in this response instead of as a markdown file:

# ALIEN-OS Terminal Simulator: Events and Scenarios Guide

## System Overview

The ALIEN-OS Terminal Simulator uses two main systems for creating interactive experiences:

1. **Events**: Actions that occur when triggered (play sound, display text, etc.)
2. **Scenarios**: Conditions that, when met, trigger specific events


These systems work together to create dynamic interactions:

```plaintext
Command → Process Command → Trigger Event → Check Scenarios → Trigger Additional Events
```

## File Structure

The key files for customizing events and scenarios are:

- `lib/config-loader.ts` - Contains YAML configurations for commands and scenarios
- `lib/event-manager.ts` - Contains event handler functions
- `lib/scenario-manager.ts` - Contains scenario checking logic
- `lib/command-processor.ts` - Processes user commands
- `lib/ascii-art.ts` - Contains ASCII art for display


## Event System

Events are actions that can be triggered by commands or scenarios. They are defined in `lib/event-manager.ts`.

### Available Events

| Event Name | Description | Parameters
|-----|-----|-----
| `PLAY_AUDIO` | Plays an audio file | Audio file name or path
| `PRINT_IMAGE` | Displays an image (ASCII art) | Image name from ascii-art.ts
| `PRINT_ASCII` | Displays ASCII art | Art name from ascii-art.ts
| `KILL_TERMINAL` | Locks terminal with message | Message to display
| `SIMULATE_TYPING` | Shows text typed character by character | Text to type
| `SHOW_HISTORY` | Displays command history | Number of entries (optional)
| `UPGRADE_ACCESS` | Prompts for access level upgrade | None
| `UPGRADE_USER` | Changes user's access level | New access level


### Adding New Events

To add a new event:

1. Add a case in the `triggerEvent` function switch statement in `lib/event-manager.ts`
2. Create a handler function for your event
3. Update commands or scenarios to use your new event


#### Example: Adding a "COUNTDOWN" Event

```typescript
// In lib/event-manager.ts

// Add to the switch statement in triggerEvent function
case "COUNTDOWN":
  handleCountdown(params, app);
  break;

// Add the handler function
function handleCountdown(params: string, app: any): void {
  const seconds = parseInt(params) || 10;
  app.addToLog("system", `Initiating countdown: ${seconds}`);
  
  let count = seconds;
  const interval = setInterval(() => {
    count--;
    app.addToLog("system", `${count}...`);
    
    if (count <= 0) {
      clearInterval(interval);
      app.addToLog("system", "Countdown complete!");
    }
  }, 1000);
}
```

### Event Examples

#### 1. Play Sound When Command Executed

```typescript
// In lib/config-loader.ts, add to defaultCommandsYaml
- name: alert
  min_access_level: 1
  response: "Alert sequence initiated."
  trigger_event: "PLAY_AUDIO"
```

This plays the default audio when the user types "alert".

#### 2. Display ASCII Art

```typescript
// In lib/config-loader.ts, add to defaultCommandsYaml
- name: logo
  min_access_level: 1
  response: ""
  trigger_event: "PRINT_ASCII"
```

When the user types "logo", it will display the default ASCII art.

To specify which ASCII art to display, modify the event handler:

```typescript
// In lib/event-manager.ts
function handlePrintAscii(params: string, app: any): void {
  // Display ASCII art based on the params
  const art = asciiArt[params as keyof typeof asciiArt] || asciiArt.logo;
  app.addToLog("system", art);
}
```

Then update the command:

```yaml
- name: alien
  min_access_level: 1
  response: ""
  trigger_event: "PRINT_ASCII"
  # The command name will be passed as params
```

#### 3. Simulate Typing Text

```typescript
// In lib/config-loader.ts, add to defaultCommandsYaml
- name: analyze
  min_access_level: 2
  response: ""
  trigger_event: "SIMULATE_TYPING"
```

In the event handler, you can use the command arguments as the text to type:

```typescript
function handleSimulateTyping(params: string, app: any): void {
  const text = params || "System analysis complete. No anomalies detected.";
  app.simulateTyping(text);
}
```

#### 4. Kill Terminal with Message

```typescript
// In lib/config-loader.ts, add to defaultCommandsYaml
- name: lockdown
  min_access_level: 10
  response: ""
  trigger_event: "KILL_TERMINAL"
```

Update the handler to use a specific message:

```typescript
function handleKillTerminal(params: string, app: any): void {
  const message = params || "SECURITY BREACH DETECTED. TERMINAL LOCKED.";
  app.addToLog("error", message);
  app.setIsTyping(true); // Lock the terminal
  
  // Display a warning ASCII art
  app.addToLog("error", asciiArt.access_denied);
  
  // In a real application, you might want to redirect or reload after a delay
  setTimeout(() => {
    window.location.reload();
  }, 5000);
}
```

## Scenario System

Scenarios are triggered based on specific conditions and can execute events. They are defined in YAML format in `lib/config-loader.ts`.

### Scenario Triggers

Currently, the system supports these trigger types:

| Trigger Type | Description | Value
|-----|-----|-----
| `ERROR_COUNT` | Triggered after X consecutive errors | Number of errors
| `COMMAND_SUCCESS` | Triggered when specific command succeeds | Command name


### Adding New Scenarios

To add a new scenario, edit the `defaultScenariosYaml` in `lib/config-loader.ts`:

```yaml
- trigger: TRIGGER_TYPE
  value: VALUE_TO_MATCH
  access_level: MINIMUM_ACCESS_LEVEL
  event: EVENT_TO_TRIGGER
  params: PARAMETERS_FOR_EVENT
```

### Scenario Examples

#### 1. Play Sound After 3 Errors

```yaml
- trigger: ERROR_COUNT
  value: 3
  access_level: 1
  event: PLAY_AUDIO
  params: "error.mp3"
```

This plays an error sound after the user makes 3 consecutive errors.

#### 2. Display Warning After 5 Errors

```yaml
- trigger: ERROR_COUNT
  value: 5
  access_level: 1
  event: PRINT_ASCII
  params: "warning"
```

This displays the "warning" ASCII art after 5 consecutive errors.

#### 3. Lock Terminal After 7 Errors

```yaml
- trigger: ERROR_COUNT
  value: 7
  access_level: 1
  event: KILL_TERMINAL
  params: "SECURITY BREACH DETECTED. TERMINAL LOCKED."
```

This locks the terminal after 7 consecutive errors.

#### 4. Upgrade Access Level After Command

```yaml
- trigger: COMMAND_SUCCESS
  value: upgrade
  access_level: 1
  event: UPGRADE_USER
  params: "2"
```

This upgrades the user to access level 2 when they successfully execute the "upgrade" command.

#### 5. Display ASCII Art After Command

```yaml
- trigger: COMMAND_SUCCESS
  value: scan
  access_level: 2
  event: PRINT_ASCII
  params: "alien"
```

This displays the "alien" ASCII art when a user with access level 2 or higher successfully executes the "scan" command.

## Advanced Customization

### Creating Event Chains

You can create chains of events by having one event trigger another. For example:

```typescript
// In lib/event-manager.ts
function handleScanSystem(params: string, app: any): void {
  app.addToLog("system", "🔍 Scanning system...");
  
  // First event in chain
  setTimeout(() => {
    app.addToLog("system", "Scan complete. Anomaly detected!");
    
    // Second event in chain
    setTimeout(() => {
      // Trigger the PRINT_ASCII event
      triggerEvent("PRINT_ASCII", "warning", app);
      
      // Third event in chain
      setTimeout(() => {
        app.simulateTyping("WARNING: System integrity compromised. Initiating countermeasures...");
        
        // Fourth event in chain
        setTimeout(() => {
          triggerEvent("PLAY_AUDIO", "", app);
        }, 2000);
      }, 1500);
    }, 1000);
  }, 2000);
}
```

### Interactive Sequences

You can create interactive sequences by combining commands, events, and scenarios:

1. Create a command that sets a state variable:


```typescript
// In components/terminal.tsx, add a state variable
const [securityOverrideActive, setSecurityOverrideActive] = useState(false);

// In lib/event-manager.ts, add a new event handler
function handleSecurityOverride(params: string, app: any): void {
  app.setSecurityOverrideActive(true);
  app.addToLog("system", "Security override activated. Enter authorization code.");
}
```

2. Add a command to trigger this event:


```yaml
- name: override
  min_access_level: 5
  response: "Initiating security override..."
  trigger_event: "SECURITY_OVERRIDE"
```

3. Modify the command processing to check for the override state:


```typescript
// In components/terminal.tsx, in the handleSubmit function
if (securityOverrideActive) {
  // Check if the input is the correct authorization code
  if (commandText === "XZ-427-ALPHA") {
    setSecurityOverrideActive(false);
    triggerEvent("UPGRADE_USER", "10", {
      addToLog,
      setCurrentUser,
      currentUser,
      simulateTyping,
      setIsTyping,
    });
    return;
  } else {
    addToLog("error", "Invalid authorization code. Security override deactivated.");
    setSecurityOverrideActive(false);
    return;
  }
}
```

### Custom Trigger Types

You can add new trigger types by modifying the `checkScenarios` function in `lib/scenario-manager.ts`:

```typescript
export function checkScenarios(
  triggerType: string,
  triggerValue: any,
  currentAccessLevel: number,
  loadedScenarios: Scenario[],
): Scenario[] {
  // Find scenarios that match the trigger type, value, and access level
  switch (triggerType) {
    case "ERROR_COUNT":
    case "COMMAND_SUCCESS":
      // Existing logic
      return loadedScenarios.filter(
        (scenario) =>
          scenario.trigger === triggerType && 
          scenario.value === triggerValue && 
          currentAccessLevel >= scenario.accessLevel,
      );
    
    case "TIME_ELAPSED":
      // New trigger type: check if elapsed time matches
      return loadedScenarios.filter(
        (scenario) =>
          scenario.trigger === triggerType && 
          triggerValue >= scenario.value && 
          currentAccessLevel >= scenario.accessLevel,
      );
    
    default:
      return [];
  }
}
```

Then add scenarios that use this trigger type:

```yaml
- trigger: TIME_ELAPSED
  value: 300 # 5 minutes in seconds
  access_level: 1
  event: SIMULATE_TYPING
  params: "Terminal session timeout approaching. Please complete your tasks."
```

## Complete Examples

### Example 1: Alien Detection System

This example creates a sequence where the user can scan for aliens, get alerts, and initiate countermeasures.

1. Add new ASCII art in `lib/ascii-art.ts`:


```typescript
export const asciiArt = {
  // ... existing art
  
  alien_detected: `
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                                                                       ║
    ║    ▄▀█ █░░ █ █▀▀ █▄░█   █▀▄ █▀▀ ▀█▀ █▀▀ █▀▀ ▀█▀ █▀▀ █▀▄              ║
    ║    █▀█ █▄▄ █ ██▄ █░▀█   █▄▀ ██▄ ░█░ ██▄ █▄▄ ░█░ ██▄ █▄▀              ║
    ║                                                                       ║
    ║                  INITIATING CONTAINMENT PROTOCOL                      ║
    ║                                                                       ║
    ╚═══════════════════════════════════════════════════════════════════════╝
  `,
  
  containment_success: `
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                                                                       ║
    ║    █▀▀ █▀█ █▄░█ ▀█▀ ▄▀█ █ █▄░█ █▀▄▀█ █▀▀ █▄░█ ▀█▀                    ║
    ║    █▄▄ █▄█ █░▀█ ░█░ █▀█ █ █░▀█ █░▀░█ ██▄ █░▀█ ░█░                    ║
    ║                                                                       ║
    ║                       SUCCESSFUL                                      ║
    ║                                                                       ║
    ╚═══════════════════════════════════════════════════════════════════════╝
  `,
}
```

2. Add new commands in `lib/config-loader.ts`:


```yaml
- name: scan_area
  min_access_level: 2
  response: ""
  trigger_event: "SCAN_AREA"

- name: containment
  min_access_level: 3
  response: ""
  trigger_event: "CONTAINMENT"
```

3. Add new event handlers in `lib/event-manager.ts`:


```typescript
// In the switch statement
case "SCAN_AREA":
  handleScanArea(params, app);
  break;
case "CONTAINMENT":
  handleContainment(params, app);
  break;

// Add handler functions
function handleScanArea(params: string, app: any): void {
  app.addToLog("system", "Initiating area scan...");
  
  // Simulate scanning delay
  setTimeout(() => {
    // 30% chance of detecting an alien
    if (Math.random() < 0.3) {
      app.addToLog("error", "⚠️ ALERT: Alien lifeform detected in vicinity!");
      app.addToLog("system", asciiArt.alien_detected);
      
      // Play alert sound
      const audio = new Audio("/sounds/alert.mp3");
      audio.play();
      
      app.addToLog("system", "Use 'containment [level]' command to initiate containment. Levels 1-3 available.");
    } else {
      app.addToLog("system", "Scan complete. No alien lifeforms detected.");
    }
  }, 3000);
}

function handleContainment(params: string, app: any): void {
  const level = parseInt(params) || 1;
  
  if (level < 1 || level > 3) {
    app.addToLog("error", "Invalid containment level. Please specify level 1-3.");
    return;
  }
  
  app.addToLog("system", `Initiating level ${level} containment protocol...`);
  
  // Simulate containment process
  setTimeout(() => {
    // Higher levels have better success chance
    const successChance = 0.5 + (level * 0.15);
    
    if (Math.random() < successChance) {
      app.addToLog("system", "Containment successful!");
      app.addToLog("system", asciiArt.containment_success);
      
      // Play success sound
      const audio = new Audio("/sounds/success.mp3");
      audio.play();
    } else {
      app.addToLog("error", "Containment failed! Alien lifeform still active.");
      app.addToLog("system", "Recommend evacuation of affected area.");
      
      // Play failure sound
      const audio = new Audio("/sounds/failure.mp3");
      audio.play();
    }
  }, 5000);
}
```

4. Add sound files to the public directory:

1. `/public/sounds/alert.mp3`
2. `/public/sounds/success.mp3`
3. `/public/sounds/failure.mp3`





### Example 2: Security Clearance System

This example creates a multi-step security clearance system:

1. Add new commands:


```yaml
- name: login
  min_access_level: 1
  response: ""
  trigger_event: "LOGIN_SEQUENCE"

- name: verify
  min_access_level: 1
  response: ""
  trigger_event: "VERIFY_CREDENTIALS"
```

2. Add state variables in `components/terminal.tsx`:


```typescript
const [loginActive, setLoginActive] = useState(false);
const [username, setUsername] = useState("");
```

3. Add event handlers:


```typescript
function handleLoginSequence(params: string, app: any): void {
  app.setLoginActive(true);
  app.addToLog("system", "Please enter your username with 'login [username]'");
}

function handleVerifyCredentials(params: string, app: any): void {
  if (!app.loginActive) {
    app.addToLog("error", "No login session active. Use 'login' to begin.");
    return;
  }
  
  if (!app.username) {
    app.addToLog("error", "Username not provided. Use 'login [username]' first.");
    return;
  }
  
  app.addToLog("system", `Verifying credentials for user: ${app.username}`);
  
  // Simulate verification
  setTimeout(() => {
    // Special username gets higher access
    if (app.username.toLowerCase() === "admin") {
      app.addToLog("system", "Administrator credentials verified.");
      app.addToLog("system", asciiArt.access_granted);
      
      // Upgrade to admin level
      triggerEvent("UPGRADE_USER", "8", app);
    } else {
      app.addToLog("system", "Standard user credentials verified.");
      
      // Upgrade to standard user level
      triggerEvent("UPGRADE_USER", "3", app);
    }
    
    // Reset login state
    app.setLoginActive(false);
    app.setUsername("");
  }, 2000);
}
```

4. Modify the command processing in `handleSubmit`:


```typescript
// Near the beginning of handleSubmit
if (commandText.startsWith("login ") && commandText.length > 6) {
  const username = commandText.substring(6);
  setUsername(username);
  addToLog("system", `Username set: ${username}`);
  addToLog("system", "Use 'verify' command to verify credentials.");
  return;
}
```

### Example 3: System Diagnostics with Progress Bar

This example creates a diagnostic system with a visual progress bar:

1. Add a new command:


```yaml
- name: diagnostics
  min_access_level: 2
  response: ""
  trigger_event: "RUN_DIAGNOSTICS"
```

2. Add the event handler:


```typescript
function handleRunDiagnostics(params: string, app: any): void {
  app.addToLog("system", "Initiating system diagnostics...");
  
  // Start with empty progress bar
  app.addToLog("system", "Progress: [                    ] 0%");
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    
    // Create progress bar
    const filled = "=".repeat(progress / 5);
    const empty = " ".repeat(20 - (progress / 5));
    
    // Update the last log entry with new progress bar
    app.setLog((prevLog: any[]) => {
      const newLog = [...prevLog];
      newLog[newLog.length - 1] = {
        ...newLog[newLog.length - 1],
        content: `Progress: [${filled}${empty}] ${progress}%`,
      };
      return newLog;
    });
    
    // Add diagnostic messages at certain points
    if (progress === 25) {
      app.addToLog("system", "Checking memory subsystems...");
    } else if (progress === 50) {
      app.addToLog("system", "Verifying network interfaces...");
    } else if (progress === 75) {
      app.addToLog("system", "Testing security protocols...");
    }
    
    // End the progress when complete
    if (progress >= 100) {
      clearInterval(interval);
      app.addToLog("system", "Diagnostics complete. All systems operational.");
      
      // Play completion sound
      const audio = new Audio("/sounds/complete.mp3");
      audio.play();
    }
  }, 500);
}
```

## Troubleshooting

### Events Not Triggering

1. Check that the event name in your command or scenario exactly matches a case in the `triggerEvent` function
2. Verify that the user has sufficient access level for the command
3. Check the browser console for any JavaScript errors


### Scenarios Not Activating

1. Ensure the scenario trigger type and value match what you're expecting
2. Check that the user's access level is sufficient
3. Verify the scenario is correctly defined in the YAML configuration


### Custom Events Not Working

1. Make sure you've added the event handler function
2. Check that you've added the case to the switch statement in `triggerEvent`
3. Verify any parameters are being passed correctly


### Audio Not Playing

1. Ensure the audio file exists in the correct location
2. Check that the browser allows autoplay (many browsers block it)
3. Try adding a user interaction before playing audio


## Conclusion

This guide covers the fundamentals of customizing events and scenarios in the ALIEN-OS Terminal Simulator. By combining these techniques, you can create complex, interactive experiences for users.

Remember that the key files to modify are:

- `lib/config-loader.ts` for commands and scenarios
- `lib/event-manager.ts` for event handlers
- `lib/ascii-art.ts` for visual elements


Happy hacking!
