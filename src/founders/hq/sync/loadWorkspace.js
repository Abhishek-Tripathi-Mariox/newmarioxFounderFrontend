import { listUsers } from '@/founders/api/users';
import { fetchPrefs, fetchWorkspace, saveWorkspace } from '@/founders/api/workspace';
import { fetchVault } from '@/founders/api/vault';
import { applyAccountNames, load } from '../logic/core';

/** First run: store the seed data as the shared workspace (or take the copy another session stored first). */
async function createWorkspace() {
  const data = load(null);
  try {
    const saved = await saveWorkspace(data, 0);
    return { ...saved, data };
  } catch (error) {
    if (error.status === 409 && error.details) return error.details;
    throw error;
  }
}

/**
 * Everything Founders HQ needs before it can render: the shared workspace, this user's preferences,
 * the sealed vault, and the accounts (which name the two seats).
 */
export async function loadWorkspace() {
  const [users, workspace, prefs, vault] = await Promise.all([listUsers(), fetchWorkspace(), fetchPrefs(), fetchVault()]);
  applyAccountNames(users);
  return {
    workspace: workspace.data ? workspace : await createWorkspace(),
    prefs: prefs || {},
    vault,
  };
}
