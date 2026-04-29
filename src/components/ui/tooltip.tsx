import * as React from "react"
import { Popover as PopoverPrimitive, Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "#/lib/utils"

type TooltipContextValue = {
  hoverable: boolean
  setOpen: (nextOpen: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function useHoverablePointer() {
  const [hoverable, setHoverable] = React.useState(false)

  React.useEffect(() => {
    if (typeof globalThis.matchMedia !== 'function') {
      setHoverable(false)
      return
    }

    const mql = globalThis.matchMedia("(hover: hover) and (pointer: fine)")

    const update = () => setHoverable(Boolean(mql.matches))
    update()

    // Safari < 14
    if ("addEventListener" in mql) {
      mql.addEventListener("change", update)
      return () => mql.removeEventListener("change", update)
    }

    mql.addListener(update)
    return () => mql.removeListener(update)
  }, [])

  return hoverable
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: Readonly<React.ComponentProps<typeof TooltipPrimitive.Provider>>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: Readonly<React.ComponentProps<typeof TooltipPrimitive.Root>>) {
  const hoverable = useHoverablePointer()

  // We intentionally implement “tooltips” via Popover.
  // - On touch devices: click opens and stays open (no flash).
  // - On hover devices: we add hover open/close behavior.
  const [open, setOpen] = React.useState(false)

  const ctxValue = React.useMemo<TooltipContextValue>(
    () => ({ hoverable, setOpen }),
    [hoverable],
  )

  return (
    <TooltipContext.Provider value={ctxValue}>
      <PopoverPrimitive.Root
        data-slot="tooltip"
        open={open}
        onOpenChange={setOpen}
        {...(props as unknown as React.ComponentProps<typeof PopoverPrimitive.Root>)}
      />
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  ...props
}: Readonly<React.ComponentProps<typeof TooltipPrimitive.Trigger>>) {
  const ctx = React.useContext(TooltipContext)

  return (
    <PopoverPrimitive.Trigger
      data-slot="tooltip-trigger"
      {...(props as unknown as React.ComponentProps<typeof PopoverPrimitive.Trigger>)}
      onMouseEnter={(event) => {
        props.onMouseEnter?.(event)
        if (ctx?.hoverable) ctx.setOpen(true)
      }}
      onMouseLeave={(event) => {
        props.onMouseLeave?.(event)
        if (ctx?.hoverable) ctx.setOpen(false)
      }}
      onFocus={(event) => {
        props.onFocus?.(event)
        // Keyboard accessibility
        ctx?.setOpen(true)
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        ctx?.setOpen(false)
      }}
    />
  )
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: Readonly<React.ComponentProps<typeof TooltipPrimitive.Content>>) {
  const ctx = React.useContext(TooltipContext)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...(props as unknown as React.ComponentProps<typeof PopoverPrimitive.Content>)}
        onMouseEnter={(event) => {
          props.onMouseEnter?.(event)
          if (ctx?.hoverable) ctx.setOpen(true)
        }}
        onMouseLeave={(event) => {
          props.onMouseLeave?.(event)
          if (ctx?.hoverable) ctx.setOpen(false)
        }}
      >
        {children}
        <PopoverPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
