import { DaytonaGetStarted } from "@/components/content/daytona-get-started";
import { PipInstall } from "@/components/content/pip-install";
import { RacingGame } from "@/components/content/racing-game"; // Import the new game component
import { OCRProject } from "@/components/content/projects/OCRProject";
import { TalkProject } from "@/components/content/projects/TalkProject";
import { TrendsScraperProject } from "@/components/content/projects/TrendsScraperProject";
import { WhoAmI } from "@/components/content/whoami";

export const componentRegistry = {
  DaytonaGetStarted,
  PipInstall,
  RacingGame, // Add the new game component here
  OCRProject,
  TalkProject,
  TrendsScraperProject,
  WhoAmI
};

export type ComponentName = keyof typeof componentRegistry;
