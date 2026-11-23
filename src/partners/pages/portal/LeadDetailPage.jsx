import { useParams } from 'react-router-dom';
import { LeadDetail } from '@/partners/components/leads/LeadDetail';

export default function LeadPage() {
  const { id } = useParams();
  return <LeadDetail key={id} id={id} />;
}
