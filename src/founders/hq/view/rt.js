/**
 * Tiny render helpers used by the generated view (Root.jsx, sections/*). They reproduce how the
 * Founders HQ prototype rendered its template, so the React port looks and behaves the same.
 */
import { createElement, isValidElement } from 'react';

/** A {{ hole }} in text: nothing for undefined / null / booleans, elements as-is, values in a span. */
export function show(value) {
  if (value === undefined || value === null || typeof value === 'boolean') return null;
  if (isValidElement(value) || Array.isArray(value)) return value;
  return createElement('span', { className: 'sc-interp' }, String(value));
}

/** A {{ hole }} inside an attribute or style string. */
export const attr = (value) => (value == null ? '' : value);

/** `background-color` → `backgroundColor` (React style keys). */
const kebabToCamel = (property) => property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

/** Inline style: CSS text → style object (objects pass through). Custom properties (--x) keep their name. */
export function inlineStyle(css) {
  if (css == null || typeof css !== 'string') return css ?? undefined;
  const style = {};
  for (const decl of css.split(';')) {
    const colonAt = decl.indexOf(':');
    if (colonAt < 0) continue;
    const prop = decl.slice(0, colonAt).trim();
    style[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(colonAt + 1).trim();
  }
  return style;
}

/** sc-for list: anything that isn't an array renders nothing. */
export const asList = (value) => (Array.isArray(value) ? value : []);

/** value / checked bound to an undefined hole become '' / false (controlled inputs). */
export const inputValue = (value) => (value === undefined ? '' : value);
export const checkedValue = (checked) => (checked === undefined ? false : checked);

/** className from a hole plus generated hover/focus classes. */
export const classNames = (...classes) => classes.filter(Boolean).join(' ');
