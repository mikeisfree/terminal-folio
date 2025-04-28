import yaml from "js-yaml";

// Define types for our configuration
export interface CommandConfig {
  name: string;
  minAccessLevel: number;
  response: string;
  triggerEvent: string | null;
  componentName?: string; // Add optional componentName field
}

export interface ScenarioConfig {
  trigger: string;
  value: number;
  accessLevel: number;
  event: string;
  params: string;
}

// Load YAML configuration
export async function loadYamlConfig(yamlString: string): Promise<any> {
  try {
    return yaml.load(yamlString);
  } catch (error) {
    console.error("Error loading YAML config:", error);
    return null;
  }
}

// Load commands from YAML string
export async function loadCommandsFromYaml(
  yamlString: string
): Promise<CommandConfig[]> {
  const config = await loadYamlConfig(yamlString);
  if (!config || !config.commands) {
    return [];
  }

  return config.commands.map((cmd: any): CommandConfig => ({
    name: cmd.name,
    minAccessLevel: cmd.min_access_level || 1,
    response: cmd.response || "",
    triggerEvent: cmd.trigger_event || null,
    componentName: cmd.componentName || undefined, // Parse componentName
  }));
}

// Load scenarios from YAML string
export async function loadScenariosFromYaml(
  yamlString: string
): Promise<ScenarioConfig[]> {
  const config = await loadYamlConfig(yamlString);
  if (!config || !config.scenarios) {
    return [];
  }

  return config.scenarios.map((scenario: any) => ({
    trigger: scenario.trigger,
    value: scenario.value,
    accessLevel: scenario.access_level || 1,
    event: scenario.event,
    params: scenario.params || "",
  }));
}

// Default YAML configurations
export const defaultCommandsYaml = `
commands:
  - name: status
    min_access_level: 1
    response: ""
    trigger_event: "PLAY_VIDEO loader2.mp4"

  - name: help
    min_access_level: 1
    response: "Available commands: help, status, echo, clear, ascii, play, image, history, upgrade"
    trigger_event: null
  
  - name: status
    min_access_level: 1
    response: "System Status: OPERATIONAL\\nUser Level: {userLevel}\\nTerminal ID: XENO-{userId}\\nConnection: SECURE"
    trigger_event: null

  - name: echo
    min_access_level: 1
    response: "{args}"
    trigger_event: null
  
  - name: clear
    min_access_level: 1
    response: ""
    trigger_event: "CLEAR_TERMINAL"
  
  - name: ascii
    min_access_level: 1
    response: ""
    trigger_event: "PRINT_ASCII"
  
  - name: play
    min_access_level: 1
    response: "Playing audio sequence..."
    trigger_event: "PLAY_AUDIO"
  
  - name: image
    min_access_level: 1
    response: "Rendering image..."
    trigger_event: "PRINT_IMAGE"

  - name: video
    min_access_level: 1
    response: "Rendering video..."
    trigger_event: "PLAY_VIDEO"
  
  - name: history
    min_access_level: 1
    response: "Retrieving command history..."
    trigger_event: "SHOW_HISTORY"
  
  - name: upgrade
    min_access_level: 1
    response: "Attempting to upgrade access level..."
    trigger_event: "UPGRADE_ACCESS"
  
  - name: admin
    min_access_level: 1
    response: "Initiating administrative console...\nVerifying credentials...\nAccessing secure protocols...\nEstablishing connection...\nRunning system diagnostics...\nSecurity clearance: PENDING..."
    trigger_event: "SIMULATE_TYPING"

  - name: race
    min_access_level: 1
    response: "Initiating Neon Racer..."
    componentName: "RacingGame" # Add this line to link to the component
    trigger_event: null

`;

export const defaultScenariosYaml = `
scenarios:



  - trigger: ERROR_COUNT
    value: 3
    access_level: 1
    event: PLAY_AUDIO
    params: "Warning: Unusual activity detected. Security protocols engaged."
  
  - trigger: ERROR_COUNT
    value: 5
    access_level: 1
    event: PRINT_ASCII
    params: "warning"
  
  - trigger: ERROR_COUNT
    value: 7
    access_level: 1
    event: KILL_TERMINAL
    params: "SECURITY BREACH DETECTED. TERMINAL LOCKED."
  
  - trigger: COMMAND_SUCCESS
    value: upgrade
    access_level: 1
    event: UPGRADE_USER
    params: "2"
`;
