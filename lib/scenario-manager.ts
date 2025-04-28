interface Scenario {
  trigger: string
  value: number
  accessLevel: number
  event: string
  params: string
}

export function checkScenarios(
  triggerType: string,
  triggerValue: number,
  currentAccessLevel: number,
  loadedScenarios: Scenario[],
): Scenario[] {
  // Find scenarios that match the trigger type, value, and access level
  return loadedScenarios.filter(
    (scenario) =>
      scenario.trigger === triggerType && scenario.value === triggerValue && currentAccessLevel >= scenario.accessLevel,
  )
}

