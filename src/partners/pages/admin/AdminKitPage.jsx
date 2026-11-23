import { useRef, useState } from 'react';
import { KitForm } from '@/partners/components/kit/KitForm';
import { ResourceGrid } from '@/partners/components/kit/ResourceGrid';
import { Button, Icon, Modal, PageHeader, useToast } from '@/partners/components/ui';
import { DownloadButton, ViewButton } from '@/partners/components/forms/FileUploader';
import { api } from '@/partners/api';
import { usePpCan } from '@/partners/hooks/usePpCan';

export default function AdminKitPage() {
  const toast = useToast();
  const can = usePpCan();
  const reloadRef = useRef(() => {});
  const reload = () => reloadRef.current();
  const [editing, setEditing] = useState(null);

  async function save(body) {
    if (editing?._id) await api.patch(`/resources/${editing._id}`, body);
    else await api.post('/resources', body);
    setEditing(null);
    toast('Saved');
    reload();
  }

  async function remove(r) {
    if (!confirm(`Delete "${r.title}"?`)) return;
    await api.del(`/resources/${r._id}`);
    reload();
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Sales kit" subtitle="Files every partner can download from their toolkit." actions={can('pp_kit', 'c') && <Button variant="fire" icon="plus" onClick={() => setEditing({})}>Add file</Button>} />
      <ResourceGrid
        listRef={r => (reloadRef.current = r)}
        action={r => (
          <span className="row" style={{ gap: 6 }}>
            {r.file && <ViewButton file={r.file} label={false} />}
            {r.file ? <DownloadButton file={r.file} /> : r.url ? <a className="x dl-btn" href={r.url} target="_blank" rel="noreferrer" aria-label="Open link"><Icon name="arrUR" size="s" /></a> : null}
            {can('pp_kit', 'e') && <Button size="xs" onClick={() => setEditing(r)}>Edit</Button>}
            {can('pp_kit', 'd') && <Button size="xs" variant="danger" icon="trash" onClick={() => remove(r)} aria-label="Delete" />}
          </span>
        )}
      />
      {editing && (
        <Modal open title={editing._id ? 'Edit file' : 'Add file'} onClose={() => setEditing(null)}>
          <KitForm initial={editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
