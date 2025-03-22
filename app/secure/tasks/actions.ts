'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { NewTask, Task, TaskUpdate } from './types'

// Get all tasks for the current user
export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
  
  return data as Task[]
}

// Get a single task by ID
export async function getTask(id: string): Promise<Task | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error(`Error fetching task with ID ${id}:`, error)
    return null
  }
  
  return data as Task
}

// Create a new task
export async function createTask(task: NewTask): Promise<Task | null> {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return null
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: user.id }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating task:', error)
    return null
  }
  
  revalidatePath('/secure/tasks')
  return data as Task
}

// Update an existing task
export async function updateTask(task: TaskUpdate): Promise<Task | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', task.id)
    .select()
    .single()
  
  if (error) {
    console.error(`Error updating task with ID ${task.id}:`, error)
    return null
  }
  
  revalidatePath('/secure/tasks')
  return data as Task
}

// Delete a task
export async function deleteTask(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error(`Error deleting task with ID ${id}:`, error)
    return false
  }
  
  revalidatePath('/secure/tasks')
  return true
}
