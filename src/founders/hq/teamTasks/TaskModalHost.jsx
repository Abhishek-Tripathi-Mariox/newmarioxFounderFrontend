import { useEffect } from 'react';
import ModalHost from '@/components/layout/ModalHost';
import DrawerHost from '@/components/layout/DrawerHost';
import TeamTaskDrawerHost from '@/features/team-tasks/TeamTaskDrawerHost';
import { useStore } from '@/store';
import NotificationStack from '@/components/layout/NotificationStack';
import { closePortalOverlays, connect, loadRest } from './portalBridge';

/**
 * Lets an HQ page (e.g. the Calendar) open the portal's "New task" form and a task's drawer in place:
 * mounts the portal's modal, drawer and toast hosts and loads what they need (people, projects,
 * leads). Leaving the page closes anything still open.
 */
export default function TaskModalHost() {
  useEffect(() => {
    connect();
    loadRest();
    return () => {
      useStore.getState().openTeamTaskDrawer(null);
      closePortalOverlays();
    };
  }, []);
  return (
    <>
      <TeamTaskDrawerHost />
      <DrawerHost />
      <ModalHost />
      <NotificationStack />
    </>
  );
}
