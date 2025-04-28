import { ComponentName } from "./component-registry";
export interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  asciiArt: string;
  description?: string;
  commands?: string[];
  subItems?: SubMenuItem[];
  classNames?: {
    id?: "display-none";
    title?: "display-none";
    subtitle?: "display-none";
    asciiArt?: string;
    description?: "display-none";
    commands?: string;
    container?: string;
  };
}

export interface SubMenuItem {
  id: string;
  title: string;
  // description: string;
  commands?: string[];
  content?: string;
  contentComponent?: ComponentName;
  classNames?: {
    id?: "display-none";
    title?: "display-none";
    description?: "display-none";
    content?: string;
    container?: string;
  };
}

export const menuData: MenuItem[] = [
  {
    id: "terminal",
    title: "Terminal",
    // subtitle: "Command line interface",
    asciiArt: "neofetch",
    description:
      "Access the terminal interface with full command capabilities.",
    commands: ["help", "status", "clear", "echo"],
    subItems: [
      {
        id: "terminal-commands",
        title: "Commands",
        // description: "View available terminal commands",
        commands: ["help", "status", "clear"],
        content:
          "The terminal provides a set of commands for interacting with the system. Use 'help' to see all available commands.",
      },
      {
        id: "terminal-features",
        title: "Features",
        // description: "Explore terminal features",
        commands: ["ascii", "play", "image"],
        content:
          "The terminal includes features like ASCII art display, audio playback, and more. Try the 'ascii' command to see some cool ASCII art.",
      },
      {
        id: "terminal-access",
        title: "Access Levels",
        // description: "Learn about terminal access levels",
        commands: ["upgrade", "status"],
        content:
          "The terminal has different access levels that determine which commands you can use. Try the 'upgrade' command to increase your access level.",
      },
    ],
  },
// {
  //   id: "daytona",
  //   title: "Daytona",
  //   // subtitle: "The future of dev envs",
  //   asciiArt: "daytona",
  //   description:
  //     "Daytona is a platform for creating and managing development environments.",
  //   commands: [
  //     "daytona list",
  //     "daytona profile add -a",
  //     "daytona server api-key",
  //     "daytona create",
  //   ],
  //   subItems: [
  //     {
  //       id: "daytona-get-started",
  //       title: "Get started",
  //       description: "Learn how to get started with Daytona",
  //       // commands: ["daytona init", "daytona create", "daytona start"],
  //       contentComponent: "DaytonaGetStarted",
  //     },
  //     {
  //       id: "daytona-commands",
  //       title: "Commands",
  //       description: "View all available Daytona commands",
  //       // commands: ["daytona --help", "daytona list", "daytona create"],
  //       content:
  //         "Daytona CLI provides a comprehensive set of commands to manage your development environments. Use 'daytona --help' to see all available commands.",
  //     },
  //     {
  //       id: "daytona-profiles",
  //       title: "Profiles",
  //       description: "Manage your Daytona profiles",
  //       // commands: ["daytona profile list", "daytona profile add", "daytona profile remove"],
  //       content:
  //         "Profiles in Daytona allow you to configure different settings for different projects or teams. Use the profile commands to manage your profiles.",
  //     },
  //   ],
  // },
  // {
  //   id: "nexus",
  //   title: "Nexus",
  //   // subtitle: "Quantum networking",
  //   asciiArt: "nexus",
  //   description:
  //     "Nexus is a quantum networking platform for secure communications.",
  //   // commands: ["nexus init", "nexus connect", "nexus status", "nexus encrypt"],
  //   subItems: [
  //     {
  //       id: "nexus-overview",
  //       title: "Overview",
  //       description: "Learn about Nexus quantum networking",

  //       // commands: ["nexus --info", "nexus status"],
  //       content:
  //         "Nexus utilizes quantum entanglement principles to create unhackable communication channels. The platform ensures that data transmission is secure against both classical and quantum computing attacks.",
  //       contentComponent: "Skeleton",
  //     },
  //     {
  //       id: "nexus-setup",
  //       title: "Setup",
  //       description: "Set up your Nexus node",
  //       // commands: ["nexus init", "nexus configure", "nexus key-gen"],
  //       content:
  //         "Setting up a Nexus node requires generating quantum keys and establishing connections with other nodes in the network. Follow the setup guide to get your node operational.",
  //     },
  //     {
  //       id: "nexus-protocols",
  //       title: "Protocols",
  //       description: "Learn about Nexus protocols",
  //       // commands: ["nexus protocols", "nexus protocol-info"],
  //       content:
  //         "Nexus supports multiple quantum communication protocols, including BB84, E91, and B92. Each protocol has different security properties and use cases.",
  //     },
  //   ],
  // },
  // {
  //   id: "daytona",
  //   title: "Daytona",
  //   // subtitle: "The future of dev envs",
  //   asciiArt: "daytona",
  //   description:
  //     "Daytona is a platform for creating and managing development environments.",
  //   commands: [
  //     "daytona list",
  //     "daytona profile add -a",
  //     "daytona server api-key",
  //     "daytona create",
  //   ],
  //   subItems: [
  //     {
  //       id: "daytona-get-started",
  //       title: "Get started",
  //       description: "Learn how to get started with Daytona",
  //       // commands: ["daytona init", "daytona create", "daytona start"],
  //       contentComponent: "DaytonaGetStarted",
  //     },
  //     {
  //       id: "daytona-commands",
  //       title: "Commands",
  //       description: "View all available Daytona commands",
  //       // commands: ["daytona --help", "daytona list", "daytona create"],
  //       content:
  //         "Daytona CLI provides a comprehensive set of commands to manage your development environments. Use 'daytona --help' to see all available commands.",
  //     },
  //     {
  //       id: "daytona-profiles",
  //       title: "Profiles",
  //       description: "Manage your Daytona profiles",
  //       // commands: ["daytona profile list", "daytona profile add", "daytona profile remove"],
  //       content:
  //         "Profiles in Daytona allow you to configure different settings for different projects or teams. Use the profile commands to manage your profiles.",
  //     },
  //   ],
  // },
  // {
  //   id: "nexus",
  //   title: "Nexus",
  //   // subtitle: "Quantum networking",
  //   asciiArt: "nexus",
  //   description:
  //     "Nexus is a quantum networking platform for secure communications.",
  //   // commands: ["nexus init", "nexus connect", "nexus status", "nexus encrypt"],
  //   subItems: [
  //     {
  //       id: "nexus-overview",
  //       title: "Overview",
  //       description: "Learn about Nexus quantum networking",

  //       // commands: ["nexus --info", "nexus status"],
  //       content:
  //         "Nexus utilizes quantum entanglement principles to create unhackable communication channels. The platform ensures that data transmission is secure against both classical and quantum computing attacks.",
  //       contentComponent: "Skeleton",
  //     },
  //     {
  //       id: "nexus-setup",
  //       title: "Setup",
  //       description: "Set up your Nexus node",
  //       // commands: ["nexus init", "nexus configure", "nexus key-gen"],
  //       content:
  //         "Setting up a Nexus node requires generating quantum keys and establishing connections with other nodes in the network. Follow the setup guide to get your node operational.",
  //     },
  //     {
  //       id: "nexus-protocols",
  //       title: "Protocols",
  //       description: "Learn about Nexus protocols",
  //       // commands: ["nexus protocols", "nexus protocol-info"],
  //       content:
  //         "Nexus supports multiple quantum communication protocols, including BB84, E91, and B92. Each protocol has different security properties and use cases.",
  //     },
  //   ],
  // },
  {
    id: "projects",
    title: "Projects",
    // subtitle: "Quantum computing platform",
    asciiArt: "projects",
    // description: "Quantum is a platform for quantum computing and simulation.",
    // commands: ["quantum run", "quantum simulate", "quantum qubits", "quantum entangle"],
    subItems: [
      {
        id: "talk",
        title: "TALK",
        contentComponent: "TalkProject",
      },
      {
        id: "trendsscraper",
        title: "Google Trends Agent",
        contentComponent: "TrendsScraperProject",
      },
      {
        id: "ocr",
        title: "OCR (Mistrall&Flask)",
        contentComponent: "OCRProject",
      },
      {
        id: "quantum-algorithms",
        title: "Algorithms",
        // description: "Explore quantum algorithms",
        // commands: ["quantum shor", "quantum grover", "quantum qft"],
        content:
          "Quantum algorithms like Shor's algorithm for factoring and Grover's algorithm for searching provide exponential and quadratic speedups respectively over their classical counterparts.",
      },
      {
        id: "quantum-simulation",
        title: "Simulation",
        // description: "Run quantum simulations",
        // commands: ["quantum simulate", "quantum visualize"],
        content:
          "Quantum simulation allows you to model quantum systems and run experiments without physical quantum hardware. Our platform supports simulations of up to 32 qubits.",
      },
    ],
  },
  {
    id: "whoami",
    title: "whoami",
    // subtitle: "AI assistant platform",
    asciiArt: "nova",
    // description: "Nova is an AI assistant platform for developers.",
    // commands: ["nova ask", "nova generate", "nova explain", "nova optimize"],
    subItems: [
      {
        id: "nova-features",
        title: "ABOUT",
        contentComponent: "WhoAmI"
      },
      {
        id: "nova-integration",
        title: "Integration",
        // description: "Integrate Nova with your tools",
        // commands: ["nova integrate", "nova plugins"],
        content:
          "Nova can be integrated with your favorite IDEs, code editors, and CI/CD pipelines. Check out our plugins for VSCode, JetBrains IDEs, and more.",
      },
      {
        id: "nova-models",
        title: "Models",
        // description: "Learn about Nova's AI models",
        // commands: ["nova models", "nova benchmark"],
        content:
          "Nova uses a variety of specialized AI models optimized for different programming tasks. Our models are continuously trained on the latest code repositories and documentation.",
      },
    ],
  },
];
