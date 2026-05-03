import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

// Универсальный доступ к window
const win: Window | undefined = globalThis.window ?? undefined

function getInitialMode(): ThemeMode {
  if (!win) return 'auto'

  try {
    const stored = win.localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored
    }
  } catch {
    // ignore
  }

  return 'auto'
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (!win) return 'light'

  if (mode === 'auto') {
    const prefersDark = win.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  return mode
}

function applyThemeMode(mode: ThemeMode) {
  if (!win) return

  const resolved = resolveTheme(mode)
  const root = globalThis.document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(resolved)

  if (mode === 'auto') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = mode
  }

  root.style.colorScheme = resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode())

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  useEffect(() => {
    if (!win || mode !== 'auto') return

    const media = win.matchMedia('(prefers-color-scheme: dark)')

    const onChange = () => {
      applyThemeMode('auto')
    }

    media.addEventListener('change', onChange)

    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function getNextMode(current: ThemeMode): ThemeMode {
    if (current === 'light') return 'dark'
    if (current === 'dark') return 'auto'
    return 'light'
  }

  function toggleMode() {
    if (!win) return

    const nextMode = getNextMode(mode)
    setMode(nextMode)

    try {
      win.localStorage.setItem('theme', nextMode)
    } catch {
      // ignore
    }
  }

  function getLabel(current: ThemeMode): string {
    if (current === 'auto') {
      return 'Theme mode: auto (system). Click to switch to light mode.'
    }

    return `Theme mode: ${current}. Click to switch mode.`
  }

  function getButtonText(current: ThemeMode): string {
    if (current === 'auto') return 'Auto'
    if (current === 'dark') return 'Dark'
    return 'Light'
  }

  const label = getLabel(mode)
  const text = getButtonText(mode)

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transform-gpu will-change-transform transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_12px_24px_rgba(30,90,72,0.14)]"
    >
      {text}
    </button>
  )
}