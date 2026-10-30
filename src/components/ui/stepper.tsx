'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { cn } from '@/lib/utils'

export type StepDefinition = {
  id: string
  title?: string
  description?: string
  icon?: React.ReactElement
}

interface StepperContextValue {
  value: string
  steps: StepDefinition[]
  currentIndex: number
  goTo: (id: string) => void
  onValueChange?: (val: string) => void
}

interface StepItemContextValue {
  step: StepDefinition
  index: number
  isActive: boolean
  isCompleted: boolean
  state: 'active' | 'completed' | 'inactive'
}

const StepperContext = createContext<StepperContextValue | null>(null)
const StepItemContext = createContext<StepItemContextValue | null>(null)

export function useStepper() {
  const ctx = useContext(StepperContext)
  if (!ctx) throw new Error('useStepper must be used within a Stepper')
  return ctx
}

export function useStepItem() {
  const ctx = useContext(StepItemContext)
  if (!ctx) throw new Error('useStepItem must be used within a StepperItem')
  return ctx
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepDefinition[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  responsive?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  indicators?: any
}

export function Stepper({
  steps,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  indicators,
  ...props
}: StepperProps) {
  const [internalVal, setInternalVal] = React.useState(defaultValue || steps[0]?.id || '')
  const currentVal = value !== undefined ? value : internalVal

  const currentIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.id === currentVal)
    return idx >= 0 ? idx : 0
  }, [steps, currentVal])

  const goTo = React.useCallback(
    (id: string) => {
      if (value === undefined) {
        setInternalVal(id)
      }
      onValueChange?.(id)
    },
    [value, onValueChange]
  )

  const ctxValue = useMemo(
    () => ({
      value: currentVal,
      steps,
      currentIndex,
      goTo,
      onValueChange,
    }),
    [currentVal, steps, currentIndex, goTo, onValueChange]
  )

  return (
    <StepperContext.Provider value={ctxValue}>
      <div
        role="tablist"
        data-slot="stepper"
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  )
}

export interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  stepId: string
  completed?: boolean
}

export function StepperItem({
  stepId,
  completed,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { steps, currentIndex } = useStepper()
  const stepIndex = steps.findIndex((s) => s.id === stepId)
  const step = steps[stepIndex] || { id: stepId }

  const isActive = currentIndex === stepIndex
  const isCompleted = completed !== undefined ? completed : stepIndex < currentIndex
  const state: 'active' | 'completed' | 'inactive' = isActive ? 'active' : isCompleted ? 'completed' : 'inactive'

  return (
    <StepItemContext.Provider
      value={{
        step,
        index: stepIndex,
        isActive,
        isCompleted,
        state,
      }}
    >
      <div
        data-slot="stepper-item"
        data-state={state}
        className={cn(
          'group/step flex items-center justify-center not-last:flex-1 relative',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  )
}

export interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function StepperTrigger({
  asChild,
  className,
  children,
  onClick,
  ...props
}: StepperTriggerProps) {
  const { step, isActive, isCompleted, state } = useStepItem()
  const { goTo } = useStepper()

  if (asChild) {
    return (
      <span data-slot="stepper-trigger" data-state={state} className={className}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-slot="stepper-trigger"
      data-state={state}
      onClick={(e) => {
        goTo(step.id)
        onClick?.(e)
      }}
      className={cn(
        'inline-flex cursor-pointer items-center outline-none disabled:pointer-events-none disabled:opacity-60 gap-2.5 rounded-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function StepperIndicator({
  children,
  className,
}: React.ComponentProps<'div'>) {
  const { state } = useStepItem()

  return (
    <div
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center overflow-hidden transition-all duration-300 rounded-md text-sm font-medium',
        'border border-white/10 bg-[#0E0C12] text-[#8C8890]',
        'data-[state=completed]:bg-[#7A22B0] data-[state=completed]:text-white data-[state=completed]:border-[#A24BE0]',
        'data-[state=active]:bg-[#7A22B0] data-[state=active]:text-white data-[state=active]:border-[#A24BE0] group-data-[state=active]/step:ring-2 group-data-[state=active]/step:ring-[#7A22B0]/40',
        className
      )}
    >
      {children}
    </div>
  )
}

export function StepperSeparator({ className }: React.ComponentProps<'div'>) {
  const { isCompleted } = useStepItem()

  return (
    <div
      data-slot="stepper-separator"
      className={cn(
        'm-2 h-0.5 flex-1 rounded-sm transition-colors duration-500',
        isCompleted ? 'bg-[#7A22B0]' : 'bg-white/10',
        className
      )}
    />
  )
}

export function StepperTitle({
  children,
  className,
}: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="stepper-title"
      className={cn('text-xs sm:text-sm font-bold text-[#F2F2EE]', className)}
    >
      {children}
    </h3>
  )
}

export function StepperDescription({
  children,
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="stepper-description"
      className={cn('text-[#A7ACA6] text-[11px] font-medium', className)}
    >
      {children}
    </div>
  )
}

export function StepperNav({ children, className }: React.ComponentProps<'nav'>) {
  return (
    <nav
      data-slot="stepper-nav"
      className={cn(
        'group/stepper-nav inline-flex w-full flex-row items-center justify-between',
        className
      )}
    >
      {children}
    </nav>
  )
}

export function StepperPanel({
  children,
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div data-slot="stepper-panel" className={cn('w-full', className)}>
      {children}
    </div>
  )
}

export interface StepperContentProps extends React.ComponentProps<'div'> {
  value: string
}

export function StepperContent({
  value,
  children,
  className,
  ...props
}: StepperContentProps) {
  const { value: currentVal } = useStepper()
  if (value !== currentVal) return null

  return (
    <div
      role="tabpanel"
      data-slot="stepper-content"
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}
