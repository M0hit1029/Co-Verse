'use client';

import { useState, useEffect, ReactElement } from 'react';
import { subscribeToProject, RealtimeEvent } from '@/lib/realtime';

interface ActivityFeedViewProps {
  projectId: string;
}

interface ActivityLog {
  id: string;
  event: RealtimeEvent;
  displayText: string;
}

export default function ActivityFeedView({ projectId }: ActivityFeedViewProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Subscribe to all realtime events for activity logging
    const unsubscribe = subscribeToProject(projectId, (event) => {
      const displayText = formatEventForDisplay(event);
      const activityLog: ActivityLog = {
        id: `${event.timestamp}-${crypto.randomUUID()}`,
        event,
        displayText,
      };
      
      // Add new activity to the top of the list
      setActivities((prev) => [activityLog, ...prev].slice(0, 50)); // Keep last 50 activities
    });

    return unsubscribe;
  }, [projectId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Feed</h2>
      <div className="bg-white rounded-lg border border-gray-200">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No recent activity. Start working on your project!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(activity.event.eventType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.displayText}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(activity.event.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatEventForDisplay(event: RealtimeEvent): string {
  switch (event.eventType) {
    case 'kanban:card:move':
      return `Card "${String(event.payload.taskId || 'unknown')}" was moved`;
    case 'kanban:card:add':
      return `New card "${String(event.payload.title || 'untitled')}" was added`;
    case 'kanban:card:update':
      return `Card was updated`;
    case 'kanban:board:add':
      return `New board "${String(event.payload.title || 'untitled')}" was created`;
    case 'document:update':
      return `Document was updated by ${String(event.payload.userName || 'Anonymous')}`;
    case 'activity:log':
      return String(event.payload.message || 'Activity logged');
    default:
      return `Event: ${event.eventType}`;
  }
}

function getEventIcon(eventType: string): ReactElement {
  const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold";
  
  if (eventType.startsWith('kanban:')) {
    return <div className={`${baseClasses} bg-blue-500`}>K</div>;
  } else if (eventType.startsWith('document:')) {
    return <div className={`${baseClasses} bg-green-500`}>D</div>;
  } else {
    return <div className={`${baseClasses} bg-gray-500`}>A</div>;
  }
}

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return new Date(timestamp).toLocaleString();
  }
}
