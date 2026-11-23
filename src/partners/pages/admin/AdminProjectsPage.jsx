import { useRef, useState } from 'react';
import { ProjectEditor, emptyProject, toValues } from '@/partners/components/projects/ProjectEditor';
import { ProjectList } from '@/partners/components/projects/ProjectList';
import { Button, Drawer, PageHeader, useToast } from '@/partners/components/ui';
import { useApi } from '@/partners/hooks/useApi';
import { api } from '@/partners/api';

export default function AdminProjectsPage() {
  const toast = useToast();
  const users = useApi('/admin/users?role=partner');
  const partners = users.data?.users ?? [];
  const [editing, setEditing] = useState(null);
  const reload = useRef(() => {});

  async function save(v) {
    // Drop empty optional strings so the API stores them as unset.
    const payload = { ...v, payments: v.payments.map(p => ({ ...p, releasedAt: p.releasedAt || undefined, utr: p.utr || undefined })) };
    if (editing?.id) await api.patch(`/projects/${editing.id}`, payload);
    else await api.post('/projects', payload);
    setEditing(null);
    toast('Project saved');
    reload.current();
  }

  async function remove(p) {
    if (!confirm(`Delete project for ${p.client}? Its payment and commission records go with it.`)) return;
    await api.del(`/projects/${p._id}`);
    toast('Project deleted');
    reload.current();
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Projects & payouts"
        subtitle="Update delivery stage, record client payments and release partner commissions."
        actions={<Button variant="fire" icon="plus" onClick={() => setEditing({ values: emptyProject() })}>New project</Button>}
      />
      <ProjectList
        partners={partners}
        listRef={r => (reload.current = r)}
        action={p => (
          <span className="row">
            <Button size="sm" icon="note" onClick={() => setEditing({ id: p._id, values: toValues(p) })}>Edit</Button>
            <Button size="sm" variant="danger" icon="trash" onClick={() => remove(p)} aria-label="Delete" />
          </span>
        )}
      />
      {editing && (
        <Drawer open title={editing.id ? 'Edit project' : 'New project'} subtitle="Delivery stage, milestones and the client payment schedule." onClose={() => setEditing(null)}>
          <ProjectEditor initial={editing.values} partners={partners} onSubmit={save} onCancel={() => setEditing(null)} />
        </Drawer>
      )}
    </>
  );
}
