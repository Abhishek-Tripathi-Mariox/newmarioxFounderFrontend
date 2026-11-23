import { useParams } from 'react-router-dom';
import { LeadDetail } from '@/partners/components/leads/LeadDetail';

export default function AdminLeadPage() {
  const { id } = useParams();
  return <LeadDetail key={id} id={id} admin backHref="/partners/admin/leads" />;
}
