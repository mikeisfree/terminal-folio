interface Command {
  name: string
  minAccessLevel: number
  response: string
  triggerEvent: string | null
  componentName?: string // Ensure this is present from previous edit
}

interface CommandResult {
  success: boolean
  response: string
  triggerEvent: string | null
  // triggerEvent?: string
  componentName?: string  // Add this field
}

export function processCommand(
  commandText: string,
  userAccessLevel: number,
  availableCommands: Command[],
): CommandResult {
  // Parse command (simple version - just get the first word)
  const commandName = commandText.split(" ")[0].toLowerCase()

  // Find command in available commands
  const command = availableCommands.find((cmd) => cmd.name === commandName)

  if (!command) {
    return {
      success: false,
      response: "Unknown command. Type 'help' for available commands.",
      triggerEvent: null,
    }
  }

  // Check access level
  if (userAccessLevel < command.minAccessLevel) {
    return {
      success: false,
      response: "Access denied. Higher clearance required.",
      triggerEvent: null,
    }
  }

  // Command found and access level sufficient
  return {
    success: true,
    response: command.response,
    triggerEvent: command.triggerEvent,
    componentName: command.componentName, // Pass componentName in the result
  }
}

