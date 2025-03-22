'use client'

import { useState } from 'react'
import { Task } from '../types'
import { deleteTask, updateTask } from '../actions'

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  
  const toggleTaskExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }
  
  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    await updateTask({ id: task.id, status: newStatus })
  }
  
  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found. Create your first task to get started!</p>
      </div>
    )
  }
  
  return (
    <ul className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <li key={task.id} className="py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => toggleTaskExpand(task.id)}
              >
                <h3 className="text-lg font-medium">{task.title}</h3>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              {task.due_date && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
              )}
              
              {expandedTaskId === task.id && (
                <div className="mt-2">
                  <p className="text-gray-700 whitespace-pre-line">
                    {task.description || 'No description provided.'}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                      className="text-sm border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
