# Realtime Messaging System

This document describes the realtime messaging abstraction layer implemented in `lib/realtime.ts`.

## Overview

The realtime messaging system provides a unified interface for broadcasting and subscribing to project-level events across different tabs and potentially different users (when Supabase is integrated).

## Current Implementation

Currently uses **BroadcastChannel API** for local multi-tab synchronization. This allows different tabs of the same browser to communicate in real-time without a server.

### Future Enhancement
The system is designed to easily integrate Supabase Realtime channels when Supabase becomes available in the project.

## API

### subscribeToProject(projectId, onEvent)
Subscribe to realtime events for a specific project.

**Parameters:**
- `projectId` (string): The ID of the project to subscribe to
- `onEvent` (EventCallback): Callback function that receives events

**Returns:** Unsubscribe function

**Example:**
```typescript
import { subscribeToProject } from '@/lib/realtime';

useEffect(() => {
  const unsubscribe = subscribeToProject('project-123', (event) => {
    console.log('Received event:', event);
    // Handle the event
  });

  return unsubscribe;
}, []);
```

### emitProjectEvent(projectId, eventType, payload)
Emit a project event to all subscribers.

**Parameters:**
- `projectId` (string): The ID of the project
- `eventType` (EventType): Type of event (see Event Types below)
- `payload` (any): Event data

**Example:**
```typescript
import { emitProjectEvent } from '@/lib/realtime';

emitProjectEvent('project-123', 'kanban:card:move', {
  taskId: 'task-1',
  boardId: 'board-2',
  position: 3,
});
```

## Event Types

The following event types are supported:

### Kanban Events
- `kanban:card:move` - A card was moved to a different board or position
- `kanban:card:add` - A new card was added
- `kanban:card:update` - A card was updated
- `kanban:board:add` - A new board was created

### Document Events
- `document:update` - A document was updated

### Activity Events
- `activity:log` - A generic activity log entry

## Integration Examples

### KanbanBoard Integration
The KanbanBoard component uses realtime messaging to sync card movements across tabs:

```typescript
// Subscribe to events
useEffect(() => {
  const unsubscribe = subscribeToProject(projectId, (event) => {
    if (event.eventType === 'kanban:card:move') {
      const { taskId, boardId, position } = event.payload;
      moveTask(taskId, boardId, position);
    }
  });
  return unsubscribe;
}, [projectId]);

// Emit events when cards are moved
const handleDragEnd = (event) => {
  moveTask(taskId, boardId, position);
  emitProjectEvent(projectId, 'kanban:card:move', {
    taskId,
    boardId,
    position,
  });
};
```

### ActivityFeed Integration
The ActivityFeed subscribes to all event types and displays them as a live activity stream:

```typescript
useEffect(() => {
  const unsubscribe = subscribeToProject(projectId, (event) => {
    const displayText = formatEventForDisplay(event);
    setActivities(prev => [{ event, displayText }, ...prev]);
  });
  return unsubscribe;
}, [projectId]);
```

### DocumentEditor Integration
The DocumentEditor uses realtime messaging as an optional event bridge for notifications:

```typescript
useEffect(() => {
  const unsubscribe = subscribeToProject(projectId, (event) => {
    if (event.eventType === 'document:update') {
      console.log('Document updated:', event.payload);
    }
  });
  return unsubscribe;
}, [projectId]);

// Emit on updates
const editor = useEditor({
  onUpdate: () => {
    emitProjectEvent(projectId, 'document:update', {
      docId,
      userName,
      timestamp: Date.now(),
    });
  },
});
```

## Technical Details

### BroadcastChannel Implementation
- Creates a separate channel for each project: `project-${projectId}`
- Channels are automatically cleaned up when no more subscriptions exist
- Events are broadcast to all tabs of the same browser
- Does not work across different browsers or devices

### Future Supabase Integration
When Supabase is added to the project, the system will:
1. Detect Supabase availability automatically
2. Use Supabase Realtime channels instead of BroadcastChannel
3. Enable cross-device and multi-user synchronization
4. Maintain the same API - no code changes required in components

## Testing Multi-Tab Sync

To test the realtime messaging:

1. Open the application in two browser tabs
2. Navigate to the same project in both tabs
3. In one tab, move a card in the Kanban board
4. The card should automatically update in the other tab
5. Check the Activity Feed in both tabs - new activities should appear in real-time

## Browser Compatibility

BroadcastChannel is supported in:
- Chrome 54+
- Firefox 38+
- Safari 15.4+
- Edge 79+

The system gracefully handles environments where BroadcastChannel is not available (e.g., Node.js, older browsers).
