/**
 * Our companies: every team task and every lead belongs to one Founders HQ company (`company_id` on the
 * server, 'mariox' when not set; `co` in the store). The portal knows the three built-in companies;
 * Founders HQ adds the companies the founders created in their workspace (store `ttCompanies`, set by
 * the HQ bridge). A task / lead whose company isn't in either list still shows, labelled from its id.
 */
export const DEFAULT_COMPANY = 'mariox';

/** Built-in companies: id, name and chip hue (same colours as Founders HQ). */
export const BASE_COMPANIES = [
  { id: 'mariox', name: 'Mariox', hue: 265 },
  { id: 'hroo', name: 'HROO', hue: 160 },
  { id: 'arth', name: 'Arth', hue: 55 },
];

/** 'acme-labs' → 'Acme labs' (for a company id we have no name for). */
const nameFromId = (id) => {
  const s = String(id || '').replace(/-+/g, ' ').trim();
  return s ? s[0].toUpperCase() + s.slice(1) : 'Company';
};

/**
 * Companies to offer / label: HQ's list (when HQ set it) or the built-in ones, plus any other
 * company id used by the given tasks.
 * @returns {{id: string, name: string, hue: number}[]}
 */
export function companyList(ttCompanies, tasks = []) {
  const list = (ttCompanies && ttCompanies.length ? ttCompanies : BASE_COMPANIES).map((c) => ({ id: c.id, name: c.name, hue: c.hue ?? 265 }));
  const known = new Set(list.map((c) => c.id));
  tasks.forEach((t) => {
    const id = t && t.co;
    if (id && !known.has(id)) { known.add(id); list.push({ id, name: nameFromId(id), hue: 220 }); }
  });
  return list;
}

/** The company record for an id (falls back to a label made from the id). */
export const companyOf = (list, id) => list.find((c) => c.id === (id || DEFAULT_COMPANY)) || { id, name: nameFromId(id), hue: 220 };

/** Inline style of a company chip (tinted pill, like HQ's company chips). */
export const companyChipStyle = (hue) => ({ background: `oklch(0.95 0.03 ${hue})`, color: `oklch(0.42 0.13 ${hue})` });
