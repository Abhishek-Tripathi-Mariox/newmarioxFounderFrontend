import { ProjectList } from '@/partners/components/projects/ProjectList';
import { useUser } from '@/partners/components/UserProvider';
import { PageHeader } from '@/partners/components/ui';

export default function ProjectsPage() {
  const { user } = useUser();
  return (
    <>
      <PageHeader eyebrow="Delivery" title="Projects" subtitle="Where each client project is, and which milestone it’s on." />
      <ProjectList rate={user?.commissionRate} />
    </>
  );
}
