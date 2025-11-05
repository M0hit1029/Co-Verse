/**
 * Permission system for Froncort2 projects
 * 
 * Roles:
 * - viewer: read-only access
 * - editor: can edit documents and move Kanban cards
 * - admin: has all editor permissions plus can share project
 * - owner: full access (all permissions)
 */

export type UserRole = 'viewer' | 'editor' | 'admin' | 'owner' | null;

/**
 * Check if a user can edit content (documents and Kanban cards)
 */
export function canEdit(role: UserRole): boolean {
  return role === 'editor' || role === 'admin' || role === 'owner';
}

/**
 * Check if a user can share the project with others
 */
export function canShareProject(role: UserRole): boolean {
  return role === 'admin' || role === 'owner';
}

/**
 * Check if a user can view the project
 */
export function canView(role: UserRole): boolean {
  return role !== null;
}

/**
 * Check if a user has full access (owner)
 */
export function isOwner(role: UserRole): boolean {
  return role === 'owner';
}
