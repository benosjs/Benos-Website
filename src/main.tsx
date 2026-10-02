import { computed, signal } from '@benosjs/core'
import { For, Show, render } from '@benosjs/dom'
import './style.css'

const count = signal(6)
const copied = signal(false)
const menuOpen = signal(false)
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
  "import { signal } from '@benosjs/core'",
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
  const doubled = computed(() => count() * 2)

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
            <div class="hero-meta">
              <span>TypeScript</span><i></i><span>TSX</span><i></i><span>Signals</span><i></i><span>Vite</span>
            </div>
          </div>

          <div class="hero-visual" aria-label="Interactive Benos signal counter demo">
            <div class="demo-card">
              <div class="demo-card-top">
                <div class="window-dots"><span></span><span></span><span></span></div>
                <span class="demo-label"><span class="status-dot"></span> TRY THE SIGNAL</span>
              </div>
              <div class="demo-card-body">
                <p class="demo-overline">INTERACTIVE EXAMPLE / 01</p>
                <h2>A small change.<br /><span>A live interface.</span></h2>
                <div class="counter-display">
                  <button
                    class="counter-step"
                    type="button"
                    aria-label="Decrease clicks"
                    onClick={() => count.update((value) => value - 1)}
                  >−</button>
                  <div class="counter-value" aria-live="polite">{count()}</div>
                  <button
                    class="counter-step counter-plus"
                    type="button"
                    aria-label="Increase clicks"
                    onClick={() => count.update((value) => value + 1)}
                  >+</button>
                </div>
                <div class="counter-caption">
                  <span>Clicks</span>
                  <span class="caption-divider"></span>
                  <span>Derived value <strong>{doubled()}</strong></span>
                </div>
                <div class="demo-footnote">
                  <Show when={count() > 0} fallback={<span>Try increasing the signal.</span>}>
                    <span>Click a button to update the signal.</span>
                  </Show>
                  <span class="demo-version">BENOS 0.1.1</span>
                </div>
              </div>
            </div>
            <div class="hero-visual-note">
              <span>signal write</span><span class="note-arrow" aria-hidden="true">→</span><span>dependent DOM binding</span>
            </div>
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
