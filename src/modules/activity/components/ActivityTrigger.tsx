'use client';

import { useActivityStore } from '@/store/activityStore';
import { useUserStore } from '@/store/userStore';
import { useProjectStore } from '@/store/projectStore';
import { useDocumentStore } from '@/store/documentStore';
import { useKanbanStore } from '@/store/kanbanStore';
import { emitProjectEvent } from '@/lib/realtime';

interface ActivityTriggerProps {
  projectId: string;
}

/**
 * Demo component to trigger sample activities for testing
 * This can be removed in production or used for testing purposes
 */
export default function ActivityTrigger({ projectId }: ActivityTriggerProps) {
  const { addActivity } = useActivityStore();
  const { users } = useUserStore();
  const { projects, addShare } = useProjectStore();
  const { documents } = useDocumentStore();
  const { tasks, boards } = useKanbanStore();

  const project = projects.find(p => p.id === projectId);

  const triggerProjectShare = () => {
    if (users.length < 2) return;
    const sharerUser = users[0]; // Alice
    const targetUser = users[1]; // Bob
    
    // Add the share to the store
    addShare(projectId, targetUser.id, 'editor');

    // Add activity
    addActivity({
      type: 'project_share',
      userId: sharerUser.id,
      userName: sharerUser.name,
      data: {
        projectId,
        projectName: project?.name || 'Unknown Project',
        targetUserId: targetUser.id,
        targetUserName: targetUser.name,
      },
    });

    // Emit realtime event
    emitProjectEvent(projectId, 'activity:log', {
      activityType: 'project_share',
      targetUserId: targetUser.id,
    });
  };

  const triggerDocumentEdit = () => {
    if (users.length < 2) return;
    const editorUser = users[1]; // Bob
    const projectDocs = documents.filter(d => d.projectId === projectId);
    const doc = projectDocs[0] || { id: 'demo-doc', title: 'Sample Document' };

    addActivity({
      type: 'document_edit',
      userId: editorUser.id,
      userName: editorUser.name,
      data: {
        projectId,
        documentId: doc.id,
        documentTitle: doc.title,
      },
    });

    // Emit realtime event
    emitProjectEvent(projectId, 'document:update', {
      documentId: doc.id,
      documentTitle: doc.title,
      userName: editorUser.name,
    });
  };

  const triggerTaskMove = () => {
    if (users.length < 3) return;
    const moverUser = users[2]; // Charlie
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const task = projectTasks[0] || { id: 'demo-task', title: 'Fix Bug' };
    const projectBoards = boards.filter(b => b.projectId === projectId);
    const doneBoard = projectBoards.find(b => b.title === 'Done') || 
                      projectBoards[projectBoards.length - 1] || 
                      { id: 'demo-board', title: 'Done' };

    addActivity({
      type: 'task_move',
      userId: moverUser.id,
      userName: moverUser.name,
      data: {
        projectId,
        taskTitle: task.title,
        fromBoard: 'In Progress',
        toBoard: doneBoard.title,
      },
    });

    // Emit realtime event
    emitProjectEvent(projectId, 'kanban:card:move', {
      taskId: task.id,
      taskTitle: task.title,
      fromBoardId: 'board-2',
      toBoardId: doneBoard.id,
    });
  };

  return (
    <div className="mb-6 p-4 bg-black border border-[#00ff00]/30 rounded-lg">
      <h3 className="text-sm font-semibold text-[#00ff00] mb-3">Demo Actions (for testing)</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={triggerProjectShare}
          className="px-3 py-2 text-sm bg-[#003000] text-[#00ff00] border border-[#00ff00]/50 rounded hover:bg-[#004000] transition-colors"
        >
          📤 Share Project
        </button>
        <button
          onClick={triggerDocumentEdit}
          className="px-3 py-2 text-sm bg-[#004000] text-[#00ff00] border border-[#00ff00]/50 rounded hover:bg-[#006000] transition-colors"
        >
          📝 Edit Document
        </button>
        <button
          onClick={triggerTaskMove}
          className="px-3 py-2 text-sm bg-[#002000] text-[#00ff00] border border-[#00ff00]/50 rounded hover:bg-[#004000] transition-colors"
        >
          ✓ Move Task to Done
        </button>
      </div>
      <p className="text-xs text-[#00ff00]/70 mt-2">
        Click these buttons to simulate activities and see the animated feed in action!
      </p>
    </div>
  );
}
