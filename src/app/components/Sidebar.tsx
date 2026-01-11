'use client';

import Link from 'next/link';
import { useProjectStore } from '@/store/projectStore';
import { useUserStore } from '@/store/userStore';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, User, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Sidebar() {
  const { getVisibleProjects, addProject } = useProjectStore();
  const { currentUser, users, setCurrentUser } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const visibleProjects = getVisibleProjects(currentUser.id);

  const handleUserChange = (userId: string) => {
    setCurrentUser(userId);
    setDropdownOpen(false);
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const newProject = addProject(projectName, projectDescription, currentUser.id);
      setProjectName('');
      setProjectDescription('');
      setDialogOpen(false);
      // Navigate to the new project
      router.push(`/projects/${newProject.id}`);
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0a0e0d] via-[#0f1716] to-[#0a0e0d] text-[#00ff88] min-h-screen p-6 flex flex-col border-r border-[#00ff88]/20 shrink-0 backdrop-blur-xl">
      <h1 className="text-2xl font-bold mb-8 text-[#00ff88] flex justify-center items-center tracking-wide">
        <span className="text-[#00ff88] neon-text">{'<'}</span>
        <span className="bg-gradient-to-r from-[#00ff88] to-[#00ffaa] bg-clip-text text-transparent">Co-Verse</span>
        <span className="text-[#00ff88] neon-text">{'/>'}</span>
      </h1>
      
      {/* User Dropdown */}
      <div className="mb-6 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#0f1716]/80 border border-[#00ff88]/30 rounded-xl hover:bg-[#141d1b] hover:border-[#00ff88]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00cc77] flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-medium text-[#00ff88]">{currentUser.name}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#00ff88]/70 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1716]/95 backdrop-blur-xl border border-[#00ff88]/30 rounded-xl shadow-[0_8px_32px_rgba(0,255,136,0.2)] z-10 overflow-hidden">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserChange(user.id)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-[#141d1b] transition-all duration-200 ${
                  currentUser.id === user.id ? 'bg-[#141d1b] text-[#00ff88] font-medium border-l-2 border-[#00ff88]' : 'text-[#00ff88]/80'
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <nav className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-[#00ff88]/60 uppercase tracking-wider">Projects</h2>
          <button
            onClick={() => setDialogOpen(true)}
            className="p-1.5 rounded-lg hover:bg-[#141d1b] transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)] group"
            title="New Project"
          >
            <Plus className="w-4 h-4 text-[#00ff88]/70 group-hover:text-[#00ff88] transition-colors" />
          </button>
        </div>
        <ul className="space-y-2">
          {visibleProjects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className={`block px-4 py-3 rounded-xl transition-all duration-300 group ${
                  pathname.includes(`/projects/${project.id}`)
                    ? 'bg-gradient-to-r from-[#141d1b] to-[#0f1716] text-[#00ff88] border border-[#00ff88]/40 shadow-[0_0_20px_rgba(0,255,136,0.15)]'
                    : 'text-[#00ff88]/70 hover:bg-[#141d1b]/60 hover:text-[#00ff88] hover:border-[#00ff88]/20 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    pathname.includes(`/projects/${project.id}`)
                      ? 'bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)]'
                      : 'bg-[#00ff88]/30 group-hover:bg-[#00ff88]/60'
                  }`} />
                  <span className="font-medium text-sm">{project.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* New Project Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project. You will be the owner and have full admin rights.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-[#00ff00]">
                Project Name
              </Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && projectName.trim()) {
                    handleCreateProject();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-[#00ff00]">
                Description
              </Label>
              <Input
                id="projectDescription"
                placeholder="Enter project description (optional)"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setProjectName('');
                setProjectDescription('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!projectName.trim()}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
