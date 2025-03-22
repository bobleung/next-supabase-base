export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type NewTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type TaskUpdate = Partial<NewTask> & { id: string };
