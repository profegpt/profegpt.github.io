import { el, icon, ICONS, clear } from '../lib/dom.js';
import { renderMarkdown } from '../lib/markdown.js';
import { art } from '../lib/art.js';
import { t } from '../lib/i18n.js';
import { ask, getState, isBusy, subscribe } from '../lib/chat-session.js';

/**
 * The chat page is a pure view over lib/chat-session.js. It owns no
 * conversation state, so unmounting it — switching page, language or theme —
 * cannot lose an answer that is still being looked up.
 */
export function renderChat(main) {
  const log = el('div', { class: 'chat__log' });
  const input = el('textarea', { rows: 1, placeholder: t('chat.placeholder'), 'aria-label': t('chat.messageLabel') });

  const send = el('button', { class: 'composer__send', type: 'submit', disabled: true, 'aria-label': t('chat.send') },
    icon(ICONS.send, { size: 16, fill: true }));

  const composer = el('form', { class: 'composer' }, input, send);
  const hint = el('p', { class: 'composer__hint' }, t('chat.groundedOnly'));
  const chat = el('div', { class: 'chat' }, log, composer, hint);
  main.append(el('div', { class: 'page shell' }, chat));

  // --- painting ------------------------------------------------------------

  const scrollDown = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  function bubble(role) {
    const body = el('div', { class: 'msg__body' });
    log.appendChild(el('div', { class: `msg msg--${role}` },
      el('div', { class: 'msg__who' }, role === 'user' ? t('chat.you') : 'PG'),
      body));
    return body;
  }

  /** Render the tutor's block list into a message body. */
  function paintBlocks(target, blocks) {
    for (const block of blocks) {
      if (block.type === 'md') {
        const holder = el('div', {});
        renderMarkdown(block.text, holder);
        while (holder.firstChild) target.appendChild(holder.firstChild);
      } else if (block.type === 'table') {
        target.appendChild(el('div', { class: 'tablewrap', style: { margin: '4px 0 12px' } },
          el('table', { class: 'conj', style: { minWidth: '0' } },
            el('thead', {}, el('tr', {},
              el('th', { scope: 'col' }, block.caption || block.head[0]),
              el('th', { scope: 'col' }, block.head[1]))),
            el('tbody', {}, ...block.rows.map(([left, right]) =>
              el('tr', {}, el('th', { scope: 'row' }, left), el('td', {}, right)))))));
      } else if (block.type === 'suggestions') {
        // Questions the tutor can answer, offered when it could not answer the
        // one asked. Each one is asked as it stands when clicked.
        target.appendChild(el('div', { class: 'suggestions' },
          ...block.items.map((item) => el('button', {
            class: 'suggestions__item',
            type: 'button',
            onclick: () => { input.value = item; resize(); submit(); },
          }, item))));
      } else if (block.type === 'links') {
        target.appendChild(el('div', { class: 'wordlist' },
          el('span', {}, block.label),
          ...block.items.map((item) => el('a', { class: 'chip', href: item.href, 'data-link': '' }, item.label))));
      }
    }
  }

  function greeting() {
    return el('div', { class: 'empty chat__greeting' },
      art('chat', { className: 'chat__art' }),
      el('h3', {}, t('chat.title')),
      el('p', {}, t('chat.lead')),
      el('div', { class: 'starters', style: { justifyContent: 'center' } },
        ...t('chat.starters').split('|').map((starter) => el('button', {
          type: 'button',
          onclick: () => { input.value = starter; resize(); submit(); },
        }, starter))));
  }

  /** Rebuild the transcript from state — on mount, and on any structural change. */
  function paint(state) {
    clear(log);

    if (!state.messages.length && !state.busy) {
      log.appendChild(greeting());
      return;
    }

    for (const message of state.messages) {
      const body = bubble(message.role === 'user' ? 'user' : 'bot');
      if (message.role === 'user') {
        body.appendChild(el('p', {}, message.content));
        continue;
      }
      paintBlocks(body, message.blocks ?? []);
    }

    if (state.busy) bubble('bot').appendChild(el('span', { class: 'spinner' }));
  }

  function resize() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 200)}px`;
    send.disabled = !input.value.trim() || isBusy() || input.disabled;
  }

  function onChange(state) {
    paint(state);
    resize();
    scrollDown();
  }

  // --- wiring --------------------------------------------------------------

  function submit() {
    const text = input.value.trim();
    if (!text || isBusy() || input.disabled) return;
    input.value = '';
    resize();
    ask(text);
  }

  composer.addEventListener('submit', (event) => { event.preventDefault(); submit(); });
  input.addEventListener('input', resize);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); }
  });

  const unsubscribe = subscribe(onChange);

  // Repaint whatever the session already holds — including an answer that
  // arrived while this view was unmounted.
  paint(getState());
  resize();

  input.focus();

  // Deliberately does not abort the lookup: the answer finishes in the
  // background and is waiting when the visitor comes back.
  return () => { unsubscribe(); };
}
