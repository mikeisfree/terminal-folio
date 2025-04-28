import { supabase, type InputLog, initDatabase } from "./supabase-client"

// Initialize the database
export async function initializeDatabase(): Promise<boolean> {
  return await initDatabase()
}

// Log user input to the database
export async function logUserInput(userId: string, accessLevel: number, commandText: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("input_log")
      .insert([
        { 
          user_id: userId, 
          access_level: accessLevel, 
          command_text: commandText 
        }
      ])

    if (error) {
      console.error("Error logging user input:", error)
    }
  } catch (error) {
    console.error("Error in logUserInput:", error)
  }
}

// Get or create a user
export async function getOrCreateUser(username: string): Promise<{ id: string; accessLevel: number }> {
  try {
    // First, try to get the user
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, access_level")
      .eq("username", username)
      .single()

    if (existingUser) {
      return { id: existingUser.id, accessLevel: existingUser.access_level }
    }

    // If user doesn't exist, create a new one
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ username, access_level: 1 }])
      .select("id, access_level")
      .single()

    if (insertError) {
      console.error("Error creating user:", insertError)
      // Return a default user as fallback
      return { id: "00000000-0000-0000-0000-000000000000", accessLevel: 1 }
    }

    return { id: newUser.id, accessLevel: newUser.access_level }
  } catch (error) {
    console.error("Error in getOrCreateUser:", error)
    return { id: "00000000-0000-0000-0000-000000000000", accessLevel: 1 }
  }
}

// Update user access level
export async function updateUserAccessLevel(userId: string, newLevel: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .update({ access_level: newLevel })
      .eq("id", userId)

    return !error
  } catch (error) {
    console.error("Error in updateUserAccessLevel:", error)
    return false
  }
}

// Get user input history
export async function getUserInputHistory(userId: number, limit = 10): Promise<InputLog[]> {
  const { data, error } = await supabase
    .from("input_log")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching user input history:", error)
    return []
  }

  return data || []
}

