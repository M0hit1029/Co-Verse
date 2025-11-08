'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { X } from 'lucide-react';

interface UserSelectProps {
  selectedUsers: string[];
  onUsersChange: (users: string[]) => void;
  currentUserId: string;
}

export function UserSelect({ selectedUsers, onUsersChange, currentUserId }: UserSelectProps) {
  const { users } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  // Filter out current user and get only users who have access to this project
  // For now, showing all users - in a real app, this would filter by project access
  const availableUsers = users.filter((u) => u.id !== currentUserId);

  const handleToggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onUsersChange(selectedUsers.filter((id) => id !== userId));
    } else {
      onUsersChange([...selectedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    onUsersChange(selectedUsers.filter((id) => id !== userId));
  };

  return (
    <div className="relative">
      <label className="block text-xs text-[#00ff00]/70 mb-1">Assign to:</label>
      
      {/* Selected users display */}
      <div className="flex flex-wrap gap-1 mb-2">
        {selectedUsers.length === 0 ? (
          <span className="text-xs text-[#00ff00]/50">No users assigned</span>
        ) : (
          selectedUsers.map((userId) => {
            const user = users.find((u) => u.id === userId);
            return (
              <div
                key={userId}
                className="flex items-center gap-1 bg-[#004000] border border-[#00ff00]/30 rounded px-2 py-1 text-xs text-[#00ff00]"
              >
                <span>{user?.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveUser(userId)}
                  className="hover:text-[#00ff00] transition-colors"
                  aria-label={`Remove ${user?.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Dropdown toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1 bg-black border border-[#00ff00]/30 text-[#00ff00] rounded text-sm text-left hover:border-[#00ff00]/50 transition-colors"
      >
        {selectedUsers.length > 0
          ? `${selectedUsers.length} user(s) assigned`
          : 'Click to assign users'}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-black border border-[#00ff00]/50 rounded shadow-lg max-h-48 overflow-y-auto">
          {availableUsers.length === 0 ? (
            <div className="px-3 py-2 text-xs text-[#00ff00]/50">No users available</div>
          ) : (
            availableUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleToggleUser(user.id)}
                className="w-full px-3 py-2 text-left text-sm text-[#00ff00] hover:bg-[#004000] transition-colors flex items-center gap-2"
              >
                <div
                  className={`w-4 h-4 border border-[#00ff00]/50 rounded ${
                    selectedUsers.includes(user.id) ? 'bg-[#00ff00]' : 'bg-black'
                  }`}
                />
                <span>{user.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
