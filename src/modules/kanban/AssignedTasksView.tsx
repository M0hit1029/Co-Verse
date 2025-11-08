'use client';

import { useKanbanStore } from '@/store/kanbanStore';
import { useUserStore } from '@/store/userStore';
import { useProjectStore } from '@/store/projectStore';
import { User, Calendar } from 'lucide-react';

interface AssignedTasksViewProps {
  projectId: string;
}

export default function AssignedTasksView({ projectId }: AssignedTasksViewProps) {
  const { tasks, getBoardsByProject } = useKanbanStore();
  const { currentUser, users } = useUserStore();
  const { projects } = useProjectStore();

  const project = projects.find((p) => p.id === projectId);
  const boards = getBoardsByProject(projectId);

  // Get all tasks assigned to the current user in this project
  const assignedTasks = tasks.filter(
    (task) =>
      task.projectId === projectId &&
      task.assignedUsers &&
      task.assignedUsers.includes(currentUser.id)
  );

  // Group tasks by board
  const tasksByBoard = boards.map((board) => ({
    board,
    tasks: assignedTasks.filter((task) => task.boardId === board.id),
  }));

  const getOtherAssignedUsers = (task: typeof assignedTasks[0]) => {
    if (!task.assignedUsers) return [];
    return task.assignedUsers
      .filter((userId) => userId !== currentUser.id)
      .map((userId) => users.find((u) => u.id === userId)?.name)
      .filter(Boolean);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#00ff00] mb-2">My Assigned Tasks</h2>
        <p className="text-sm text-[#00ff00]/70">
          Tasks assigned to you in {project?.name || 'this project'}
        </p>
      </div>

      {assignedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#004000] border border-[#00ff00]/30 mb-4">
            <User className="w-8 h-8 text-[#00ff00]/50" />
          </div>
          <h3 className="text-lg font-medium text-[#00ff00] mb-2">No assigned tasks</h3>
          <p className="text-sm text-[#00ff00]/60">
            You don&apos;t have any tasks assigned to you in this project yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {tasksByBoard.map(
            ({ board, tasks: boardTasks }) =>
              boardTasks.length > 0 && (
                <div key={board.id}>
                  <h3 className="text-lg font-semibold text-[#00ff00] mb-3 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#00ff00]/30 border border-[#00ff00]" />
                    {board.title}
                    <span className="text-sm text-[#00ff00]/60 font-normal">
                      ({boardTasks.length} {boardTasks.length === 1 ? 'task' : 'tasks'})
                    </span>
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {boardTasks.map((task) => {
                      const otherUsers = getOtherAssignedUsers(task);
                      return (
                        <div
                          key={task.id}
                          className="bg-black border border-[#00ff00]/40 rounded-lg p-4 hover:border-[#00ff00]/60 hover:shadow-md hover:shadow-[#00ff00]/10 transition-all"
                        >
                          <h4 className="font-medium text-[#00ff00] mb-2">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-[#00ff00]/70 mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          {otherUsers.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-[#00ff00]/60 pt-2 border-t border-[#00ff00]/20">
                              <User className="w-3 h-3" />
                              <span>Also assigned: {otherUsers.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {/* Summary stats */}
      {assignedTasks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#00ff00]/20">
          <div className="flex items-center gap-6 text-sm text-[#00ff00]/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Total: <span className="text-[#00ff00] font-semibold">{assignedTasks.length}</span>{' '}
                {assignedTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
