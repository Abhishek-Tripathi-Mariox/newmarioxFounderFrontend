/* Ported from the Founders HQ prototype (CEO Portal/netlify-site/index.html) by tools/split_logic.py. */
import HQGoalsDecisionsReview from './02-goals-decisions-review';
import { uid, MUTED, TYPES, BST, SHORT, mdToBlocks } from './core';

/*
 * Block editor shared by Docs pages, My tasks notes and goal notes.
 * A "doc id" is either a page id, or 'task:<id>' / 'goal:<id>' for the notes on a founder task or goal.
 */
export default class HQDocEditor extends HQGoalsDecisionsReview {
  /** Add a blank hiring role (in `stage`, default 'Planned') and open it in the peek panel. */
  newRole(stage) {
    const id = uid();
    this.upd(data => {
      data.roles.push({
        id, role: '', co: (this.state.hx && this.state.hx.co !== 'any') ? this.state.hx.co : 'mariox',
        owner: this.state.me, budget: 0, due: '', stage: stage || 'Planned', notes: '', pri: 'Normal',
        type: 'Full-time', loc: 'Office', heads: 1, must: [], nice: [], sources: [], cands: [],
        steps: ['Phone screen', 'Skills / technical round', 'Founder round', 'Reference check'].map(text => ({ id: uid(), text })),
        comments: [], log: [{ at: Date.now(), by: this.state.me, text: 'Role created' }], created: Date.now(),
      });
    });
    this._focus = { sel: '[data-peek-title]' };
    this.setState({ peek: id });
  }

  /** The doc for `docId`; tasks and goals without notes get a single empty paragraph (not saved). */
  getDoc(docId) {
    if (docId.startsWith('task:')) {
      const task = this.state.data.tasks.find(candidate => 'task:' + candidate.id === docId);
      if (!task) return null;
      return { id: docId, blocks: task.blocks && task.blocks.length ? task.blocks : [{ id: task.id + '-b0', type: 'p', text: '', checked: false }] };
    }
    if (docId.startsWith('goal:')) {
      const goal = this.state.data.goals.find(candidate => 'goal:' + candidate.id === docId);
      if (!goal) return null;
      return { id: docId, blocks: goal.blocks && goal.blocks.length ? goal.blocks : [{ id: goal.id + '-b0', type: 'p', text: '', checked: false }] };
    }
    return this.state.data.pages.find(page => page.id === docId);
  }

  /** Apply `mutate` to the stored doc and bump its `updated` time. */
  updPage(docId, mutate) {
    this.upd(data => {
      let doc;
      if (docId.startsWith('task:') || docId.startsWith('goal:')) {
        doc = (docId.startsWith('goal:') ? data.goals : data.tasks).find(item => docId.slice(5) === item.id);
        // Persist the placeholder paragraph that getDoc() shows for empty notes.
        if (doc && !(doc.blocks && doc.blocks.length)) doc.blocks = [{ id: doc.id + '-b0', type: 'p', text: '', checked: false }];
      } else doc = data.pages.find(page => page.id === docId);
      if (doc) {
        mutate(doc);
        doc.updated = Date.now();
      }
    });
  }

  /** Clicking below the last block: reuse a trailing empty paragraph, else append one; then focus it. */
  addBlockEnd(docId) {
    const doc = this.getDoc(docId);
    if (!doc) return;
    const last = doc.blocks[doc.blocks.length - 1];
    if (last && last.type === 'p' && !last.text) {
      this.focusBlock(last.id, 0);
      this.forceUpdate();
      return;
    }
    const id = uid();
    this.updPage(docId, stored => { stored.blocks.push({ id, type: 'p', text: '', checked: false }); });
    this.focusBlock(id, 0);
  }

  /** View model for each block of a doc: styling, list numbering, menus and editing handlers. */
  blocksVM(docId, list) {
    const pop = this.state.pop;
    const togglePop = popId => () => this.setState({ pop: this.state.pop === popId ? null : popId });
    const menuItems = (options, current, onPick) => options.map(([value, label]) => ({
      label, mark: current === value ? '✓' : '', bg: current === value ? 'oklch(0.97 0.012 265)' : 'transparent',
      go: () => { this.setState({ pop: null }); onPick(value); },
    }));
    // Numbered-list counter; restarts after any non-numbered block.
    let listNumber = 0;
    return list.map(block => {
      listNumber = block.type === 'num' ? listNumber + 1 : 0;
      const style = BST[block.type] || BST.p, done = block.type === 'todo' && block.checked;
      const lineHeightPx = parseFloat(style.fs) * parseFloat(style.lh) + 6;
      const placeholder = block.type === 'p'
        ? (docId.startsWith('task:') ? "Write details, plans, links… or type '/'" : "Type '/' for blocks")
        : (TYPES.find(type => type[0] === block.type) || [undefined, ''])[1];
      return {
        id: block.id, text: block.text || '',
        fs: style.fs, fw: style.fw, lh: style.lh, mt: style.mt, ls: style.ls,
        // Vertical offsets that centre the handle (22px) and checkbox (16px) on the first text line.
        ht: Math.max(0, (lineHeightPx - 22) / 2) + 'px', ct: Math.max(0, (lineHeightPx - 16) / 2) + 'px',
        color: done ? MUTED : 'oklch(0.23 0.015 265)', deco: done ? 'line-through' : 'none', fst: 'normal',
        bl: block.type === 'quote' ? '3px solid oklch(0.3 0.015 265)' : '0', pl: block.type === 'quote' ? '14px' : '2px',
        isText: block.type !== 'divider', isDivider: block.type === 'divider', isBullet: block.type === 'bullet',
        isNum: block.type === 'num', isTodo: block.type === 'todo', num: String(listNumber),
        checkBg: done ? 'var(--acc, oklch(0.5 0.17 265))' : '#fff',
        checkBorder: done ? 'var(--acc, oklch(0.5 0.17 265))' : 'oklch(0.7 0.01 265)', mark: done ? '✓' : '',
        toggleCheck: () => this.updPage(docId, doc => {
          const target = doc.blocks.find(other => other.id === block.id);
          if (target) target.checked = !target.checked;
        }),
        // Placeholder only on the focused block, or when it is the doc's only block.
        ph: this.state.fb === block.id || list.length === 1 ? placeholder : '',
        onChange: event => this.blockChange(docId, block, event),
        onKey: event => this.blockKey(docId, block, event),
        onFocus: () => { if (this.state.fb !== block.id) this.setState({ fb: block.id }); },
        menuOpen: pop === 'b:' + block.id, openMenu: togglePop('b:' + block.id),
        menu: menuItems(TYPES, block.type, type => this.setType(docId, block.id, type)),
        del: () => {
          this.setState({ pop: null });
          this.updPage(docId, doc => {
            const index = doc.blocks.findIndex(other => other.id === block.id);
            if (index > -1) doc.blocks.splice(index, 1);
            if (!doc.blocks.length) doc.blocks.push({ id: uid(), type: 'p', text: '', checked: false });
          });
        },
        slashOpen: this.state.slash === block.id,
        slash: menuItems(TYPES.filter(type => type[0] !== 'p'), '', type => this.setType(docId, block.id, type, true)),
      };
    });
  }

  /** Queue focus for a block's textarea; `pos` is a caret offset or 'end'. */
  focusBlock(id, pos) { this._focus = { sel: `[data-bid="${id}"]`, pos }; }

  /** Create a Docs page (under `parent`, optionally from template `tpl` = [title, , markdown]) and open it. */
  addPage(parent, tpl) {
    const id = uid(), blankBlockId = uid();
    const templateBlocks = tpl ? mdToBlocks(tpl[2]).map(block => ({ checked: false, ...block, id: uid() })) : null;
    this.upd(data => {
      // A sub-page inherits its parent's company; a top-level page takes the active company filter.
      const co = parent
        ? (data.pages.find(page => page.id === parent) || {}).co || 'all'
        : (this.state.fileCo !== 'any' ? this.state.fileCo : 'all');
      data.pages.push({
        id, title: tpl ? tpl[0] : '', co, parent: parent || null, by: this.state.me, status: 'Draft', tags: [], star: [],
        blocks: templateBlocks && templateBlocks.length ? templateBlocks : [{ id: blankBlockId, type: 'p', text: '', checked: false }],
        created: Date.now(), updated: Date.now(),
      });
    });
    this._focus = { sel: '[data-ptitle]' };
    this.setState(prev => ({ page: id, docTab: 'page', dq: '', exp: parent ? { ...prev.exp, [parent]: true } : prev.exp }));
  }

  /** Change a block's type (optionally clearing its text). A divider moves focus to the next block, adding one if needed. */
  setType(docId, blockId, type, clear) {
    let next = null;
    this.updPage(docId, doc => {
      const index = doc.blocks.findIndex(other => other.id === blockId);
      const block = doc.blocks[index];
      block.type = type;
      if (clear) block.text = '';
      if (type === 'divider') {
        block.text = '';
        if (!doc.blocks[index + 1]) {
          next = uid();
          doc.blocks.push({ id: next, type: 'p', text: '', checked: false });
        } else next = doc.blocks[index + 1].id;
      }
    });
    this.focusBlock(next || blockId, 'end');
    this.setState({ pop: null, slash: null });
  }

  /** Text input in a block; applies markdown shortcuts ("- ", "1. ", "---"…) and opens the slash menu on "/". */
  blockChange(docId, block, event) {
    const value = event.target.value;
    let type = block.type, text = value;
    if (block.type === 'p') {
      if (value === '---') {
        this.setType(docId, block.id, 'divider', true);
        return;
      }
      for (const [pattern, shortcutType] of SHORT) {
        if (pattern.test(value)) {
          type = shortcutType;
          text = value.replace(pattern, '');
          break;
        }
      }
    }
    this.updPage(docId, doc => {
      const target = doc.blocks.find(other => other.id === block.id);
      target.type = type;
      target.text = text;
    });
    if (type !== block.type) this.focusBlock(block.id, 'end');
    const slash = value === '/' ? block.id : this.state.slash === block.id ? null : this.state.slash;
    if (slash !== this.state.slash) this.setState({ slash });
  }

  /** Keyboard handling inside a block: Enter splits, Backspace at start merges/unformats, arrows move between blocks. */
  blockKey(docId, block, event) {
    const page = this.getDoc(docId);
    if (!page) return;
    const blocks = page.blocks, index = blocks.findIndex(other => other.id === block.id), textarea = event.target;
    const selStart = textarea.selectionStart, selEnd = textarea.selectionEnd;
    const isList = ['bullet', 'num', 'todo'].includes(block.type);
    if (event.key === 'Escape') {
      if (this.state.slash) {
        event.stopPropagation();
        this.setState({ slash: null });
      }
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // Enter on an empty list item ends the list.
      if (isList && !block.text) {
        this.setType(docId, block.id, 'p');
        return;
      }
      const id = uid(), before = block.text.slice(0, selStart), after = block.text.slice(selEnd);
      this.updPage(docId, doc => {
        const target = doc.blocks.find(other => other.id === block.id);
        target.text = before;
        doc.blocks.splice(index + 1, 0, { id, type: isList ? block.type : 'p', text: after, checked: false });
      });
      this.focusBlock(id, 0);
      this.setState({ slash: null });
      return;
    }
    if (event.key === 'Backspace' && selStart === 0 && selEnd === 0) {
      // First turn a formatted block back into a paragraph, then merge into the block above.
      if (block.type !== 'p') {
        event.preventDefault();
        this.setType(docId, block.id, 'p');
        return;
      }
      if (index > 0) {
        event.preventDefault();
        const prev = blocks[index - 1];
        if (prev.type === 'divider') {
          this.updPage(docId, doc => { doc.blocks.splice(index - 1, 1); });
          this.focusBlock(block.id, 0);
          return;
        }
        const pos = prev.text.length;
        this.updPage(docId, doc => {
          doc.blocks[index - 1].text += block.text;
          doc.blocks.splice(index, 1);
        });
        this.focusBlock(prev.id, pos);
        return;
      }
    }
    // Nearest non-divider block from `from`, stepping by `dir` (-1 up, +1 down).
    const findText = (from, dir) => {
      for (let cursor = from; cursor >= 0 && cursor < blocks.length; cursor += dir) {
        if (blocks[cursor].type !== 'divider') return blocks[cursor];
      }
      return null;
    };
    if (event.key === 'ArrowUp' && selStart === 0) {
      const above = findText(index - 1, -1);
      if (above) {
        event.preventDefault();
        this.focusBlock(above.id, 'end');
        this.forceUpdate();
      } else {
        // Top block: move up into the page title.
        event.preventDefault();
        this._focus = { sel: '[data-ptitle]', pos: 'end' };
        this.forceUpdate();
      }
    }
    if (event.key === 'ArrowDown' && selEnd === block.text.length) {
      const below = findText(index + 1, 1);
      if (below) {
        event.preventDefault();
        this.focusBlock(below.id, 0);
        this.forceUpdate();
      }
    }
  }
}
