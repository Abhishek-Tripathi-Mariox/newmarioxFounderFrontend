import { useMemo } from 'react';
import { useStore } from '@/store';
import { companyList } from '@/features/team-tasks/companies';

/**
 * Our companies to offer / label on leads ({ id, name, hue }[]): Founders HQ's companies when the HQ set
 * them (store `ttCompanies`), else the built-in ones, plus any other company a lead uses.
 */
export function useLeadCompanies() {
  const ttCompanies = useStore((st) => st.ttCompanies);
  const leads = useStore((st) => st.leads);
  return useMemo(() => companyList(ttCompanies, leads), [ttCompanies, leads]);
}
