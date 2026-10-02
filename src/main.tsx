import { computed, signal } from '@benosjs/core'
import { For, Show, render } from '@benosjs/dom'
import './style.css'

const copied = signal(false)
const menuOpen = signal(false)
const pointer = signal({ x: 0, y: 0 })
const activeStage = signal<'signal' | 'binding' | 'dom'>('signal')

const stages = [
  { id: 'signal', label: 'signal', code: 'const user = signal("Ada")', text: 'A signal holds a value and remembers who reads it.' },
  { id: 'binding', label: 'binding', code: '<h1>{user()}</h1>', text: 'Reading it inside JSX creates a binding: one small subscription, not a re-render.' },
  { id: 'dom', label: 'DOM node', code: 'user.set("Grace")', text: 'A write updates exactly that text node. The component never runs again.' },
] as const

const activeInfo = computed(() => stages.find((stage) => stage.id === activeStage()) ?? stages[0])

function trackPointer(event: PointerEvent) {
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect()
  pointer.set({
    x: Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2)),
    y: Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height - 0.5) * 2)),
  })
}
const installCommand = 'npm create benos@latest my-app'

const features = [
  {
    number: '01',
    title: 'Components run once',
    description:
      'Write ordinary functions. A signal update refreshes the bindings that read it, without replaying the component tree.',
    detail: 'Fine-grained updates',
  },
  {
    number: '02',
    title: 'Lifetimes are explicit',
    description:
      'Effects, listeners, refs, and cleanups belong to an owner, so teardown follows the UI that created them.',
    detail: 'Owned by default',
  },
  {
    number: '03',
    title: 'TypeScript feels at home',
    description:
      'Build with familiar TSX, generated HTML and SVG types, and a Vite plugin that handles the Benos transform.',
    detail: 'TSX + Vite',
  },
] as const

const counterCode = [
  "import { computed, signal } from '@benosjs/core'",
  "import { render } from '@benosjs/dom'",
  '',
  'const clicks = signal(0)',
  '',
  'function Counter() {',
  '  return (',
  '    <button onClick={() => clicks.update(n => n + 1)}>',
  '      Clicks: {clicks()}',
  '    </button>',
  '  )',
  '}',
].join('\n')

async function copyInstallCommand() {
  try {
    await navigator.clipboard.writeText(installCommand)
    copied.set(true)
    window.setTimeout(() => copied.set(false), 1600)
  } catch {
    copied.set(false)
  }
}

function closeMenu() {
  menuOpen.set(false)
}

function App() {
  return (
    <>
      <header class="site-header">
        <a class="brand" href="#top" aria-label="Benos home" onClick={closeMenu}>
          <img class="brand-mark" src="/benos-mark-light.png" alt="" width="32" height="32" />
          <span>benos<span class="brand-period">.</span></span>
        </a>

        <nav class="desktop-nav" aria-label="Main navigation">
          <a href="#why">Why Benos</a>
          <a href="#how">How it works</a>
          <a href="#start">Get started</a>
        </nav>

        <div class="header-actions">
          <a
            class="github-link"
            href="https://github.com/benosjs/benos"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a class="header-cta" href="#start">Start building <span aria-hidden="true">→</span></a>
          <button
            class="menu-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen()}
            onClick={() => menuOpen.update((open) => !open)}
          >
            <span></span><span></span>
          </button>
        </div>

        <Show when={menuOpen()}>
          <nav class="mobile-nav" aria-label="Mobile navigation">
            <a href="#why" onClick={closeMenu}>Why Benos</a>
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#start" onClick={closeMenu}>Get started</a>
            <a href="https://github.com/benosjs/benos" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </nav>
        </Show>
      </header>

      <main id="top">
        <section class="hero section-wrap">
          <div class="hero-copy">
            <div class="eyebrow"><span class="status-dot"></span> A fine-grained TypeScript framework</div>
            <h1>Components run once.<span>Bindings stay live.</span></h1>
            <p class="hero-description">
              Build with TypeScript and TSX. Signal bindings update the values that
              changed while the rest of your interface stays in place.
            </p>
            <div class="hero-actions">
              <a class="button button-primary" href="#start">Build with Benos <span aria-hidden="true">→</span></a>
              <a class="text-link text-link-hero" href="https://github.com/benosjs/benos/blob/main/docs/getting-started.md">
                Read the guide <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div class="hero-install">
              <code><span class="terminal-prompt">$</span> {installCommand}</code>
              <button type="button" onClick={() => void copyInstallCommand()} aria-label="Copy install command">
                {copied() ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div
            class="hero-visual"
            role="group"
            aria-label="Interactive diagram of how a signal reaches the DOM"
            onPointermove={trackPointer}
            onPointerleave={() => pointer.set({ x: 0, y: 0 })}
          >
            <div class="orbit">
              <span class="ring ring-1" style={`transform: translate(${pointer().x * -8}px, ${pointer().y * -8}px)`}></span>
              <span class="ring ring-2" style={`transform: translate(${pointer().x * -16}px, ${pointer().y * -16}px)`}></span>
              <span class="ring ring-3"></span>
              <img
                class="orbit-mark"
                src="/benos-mark-light.png"
                alt=""
                style={`transform: translate(${pointer().x * 22}px, ${pointer().y * 22}px) rotate(${pointer().x * 6}deg)`}
              />
              <For each={stages} by={(stage) => stage.id}>
                {(stage) => (
                  <button
                    type="button"
                    class={`orbit-tag tag-${stage().id}${activeStage() === stage().id ? ' is-active' : ''}`}
                    aria-pressed={activeStage() === stage().id}
                    onClick={() => activeStage.set(stage().id)}
                  >
                    <i></i>{stage().label}
                  </button>
                )}
              </For>
            </div>
            <div class="stage-card" aria-live="polite">
              <code>{activeInfo().code}</code>
              <p>{activeInfo().text}</p>
            </div>
            <p class="pointer-readout">
              pointer <b>({pointer().x.toFixed(2)}, {pointer().y.toFixed(2)})</b> → 3 style bindings
            </p>
          </div>
        </section>

        <div class="tech-strip" aria-label="Benos toolkit">
          <div class="tech-strip-inner">
            <span>Made for the web</span>
            <b>TypeScript</b><i></i><b>TSX</b><i></i><b>Signals</b><i></i><b>Vite</b><i></i><b>Ownership</b>
          </div>
        </div>

        <section class="section-wrap why-section" id="why">
          <div class="section-heading">
            <div>
              <p class="eyebrow eyebrow-dark">A smaller mental model</p>
              <h2>Know what updates.<br /><span>Know what gets cleaned up.</span></h2>
            </div>
            <p class="section-intro">
              Benos pairs fine-grained reactivity with explicit ownership, so the
              UI you write stays close to the work it performs.
            </p>
          </div>
          <div class="feature-grid">
            <For each={features} by={(feature) => feature.number}>
              {(feature) => (
                <article class="feature-card">
                  <div class="feature-card-top">
                    <span class="feature-number">{feature().number}</span>
                    <span class="feature-arrow" aria-hidden="true">↗</span>
                  </div>
                  <h3>{feature().title}</h3>
                  <p>{feature().description}</p>
                  <span class="feature-detail">{feature().detail}</span>
                </article>
              )}
            </For>
          </div>
        </section>

        <section class="how-section" id="how">
          <div class="section-wrap how-inner">
            <div class="how-heading">
              <p class="eyebrow"><span class="status-dot"></span> The update path</p>
              <h2>From signal<br />to screen.</h2>
              <p>Only the consumers of a value are notified. The rest of the page keeps its place.</p>
            </div>
            <div class="flow-list">
              <div class="flow-step">
                <span class="flow-index">01</span>
                <div><h3>A component describes the UI</h3><p>Its function runs once to create an owned view.</p></div>
                <span class="flow-token">App()</span>
              </div>
              <div class="flow-step">
                <span class="flow-index">02</span>
                <div><h3>A binding reads a signal</h3><p>Benos records the source that the binding depends on.</p></div>
                <span class="flow-token">count()</span>
              </div>
              <div class="flow-step">
                <span class="flow-index">03</span>
                <div><h3>The signal changes</h3><p>One write schedules the consumers that need fresh values.</p></div>
                <span class="flow-token flow-token-live">set()</span>
              </div>
              <div class="flow-step flow-step-last">
                <span class="flow-index">04</span>
                <div><h3>The right DOM node updates</h3><p>Bindings flush synchronously; event handlers batch writes.</p></div>
                <span class="flow-token">text node</span>
              </div>
            </div>
          </div>
        </section>

        <section class="section-wrap code-section">
          <div class="code-copy">
            <p class="eyebrow eyebrow-dark">Readable by design</p>
            <h2>Just a signal.<br /><span>Just a button.</span></h2>
            <p>
              Start with plain functions and typed JSX. There is no component
              rerender loop to learn before you can build something useful.
            </p>
            <a class="text-link text-link-dark" href="https://github.com/benosjs/benos/blob/main/docs/getting-started.md">
              Read the getting started guide <span aria-hidden="true">→</span>
            </a>
          </div>
          <div class="code-window">
            <div class="code-window-top">
              <div class="window-dots"><span></span><span></span><span></span></div>
              <span>counter.tsx</span>
              <span class="code-badge">TSX</span>
            </div>
            <pre><code>{counterCode}</code></pre>
            <div class="code-window-bottom"><span class="code-live-dot"></span> Binding subscribed to <code>clicks</code></div>
          </div>
        </section>

        <section class="start-section" id="start">
          <div class="section-wrap start-inner">
            <div class="start-copy">
              <p class="eyebrow"><span class="status-dot"></span> Your first minute with Benos</p>
              <h2>Start with a clean<br />canvas.</h2>
              <p>Scaffold a TypeScript app with Benos, Vite, Vitest, ESLint, and a working signal example.</p>
              <div class="install-command">
                <code><span class="terminal-prompt">$</span> {installCommand}</code>
                <button type="button" onClick={() => void copyInstallCommand()} aria-label="Copy install command">
                  {copied() ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p class="node-note">Requires Node.js ^22.18.0, ^24.11.0, or &gt;=26.0.0</p>
            </div>
            <div class="docs-panel">
              <p class="docs-panel-label">Pick up where you need</p>
              <a href="https://github.com/benosjs/benos/blob/main/docs/getting-started.md">
                <span><b>01</b> Getting started</span><span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/benosjs/benos/blob/main/docs/api-reference.md">
                <span><b>02</b> API reference</span><span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/benosjs/benos/blob/main/docs/react-migration.md">
                <span><b>03</b> React migration</span><span aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/benosjs/benos/blob/main/docs/event-ordering.md">
                <span><b>04</b> Event ordering</span><span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <a class="brand footer-brand" href="#top">
          <img class="brand-mark" src="/benos-mark-navy.png" alt="" width="28" height="28" /><span>benos<span class="brand-period">.</span></span>
        </a>
        <p>Fine-grained UI, with room to think.</p>
        <div class="footer-links">
          <a href="https://github.com/benosjs/benos" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.npmjs.com/package/@benosjs/dom" target="_blank" rel="noreferrer">npm ↗</a>
          <span>MIT License</span>
        </div>
      </footer>
    </>
  )
}

const host = document.querySelector('#app')
if (!(host instanceof HTMLElement)) throw new Error('Missing #app')
render(() => <App />, host)
