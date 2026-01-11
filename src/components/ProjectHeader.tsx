"use client"

import { ProjectShareModal } from "./ProjectShareModal"
import { useProjectStore } from "@/store/projectStore"
import { useUserStore } from "@/store/userStore"
import { canShareProject } from "@/lib/permissions"

interface ProjectHeaderProps {
  projectId: string
  projectName: string
  projectDescription: string
}

export function ProjectHeader({ projectId, projectName, projectDescription }: ProjectHeaderProps) {
  const { currentUser } = useUserStore()
  const { getUserRoleForProject } = useProjectStore()
  
  const userRole = getUserRoleForProject(projectId, currentUser.id)
  const canShare = canShareProject(userRole)
  
  const getRoleBadgeStyle = (role: string | null) => {
    switch (role) {
      case 'owner':
        return 'bg-gradient-to-r from-[#00ff88] to-[#00cc77] text-black border-[#00ff88]/50 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
      case 'admin':
        return 'bg-[#141d1b] text-[#00ff88] border-[#00ff88]/40 shadow-[0_0_8px_rgba(0,255,136,0.2)]'
      case 'editor':
        return 'bg-[#0f1716] text-[#00ff88] border-[#00ff88]/30'
      case 'viewer':
        return 'bg-[#0a0e0d] text-[#00ff88]/70 border-[#00ff88]/20'
      default:
        return 'bg-[#0a0e0d] text-[#00ff88]/70 border-[#00ff88]/20'
    }
  }
  
  const getRoleLabel = (role: string | null) => {
    if (!role) return 'No Access'
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  return (
    <div className="bg-gradient-to-r from-[#0f1716]/80 to-[#0a0e0d]/80 backdrop-blur-xl border-b border-[#00ff88]/20">
      <div className="px-8 py-6 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00ffaa] bg-clip-text text-transparent">{projectName}</h1>
            {userRole && (
              <span className={`px-4 py-1.5 text-xs font-bold rounded-xl border ${getRoleBadgeStyle(userRole)} uppercase tracking-wide`}>
                {getRoleLabel(userRole)}
              </span>
            )}
          </div>
          <p className="text-[#00ff88]/60 mt-1 text-base">{projectDescription}</p>
        </div>
        {canShare && (
          <div className="ml-4">
            <ProjectShareModal projectId={projectId} />
          </div>
        )}
      </div>
    </div>
  )
}
