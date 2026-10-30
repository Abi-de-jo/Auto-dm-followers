'use client'

import { useState } from 'react'
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperNav,
  StepperTitle,
  StepperPanel,
  StepperContent
} from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FileTextIcon, EyeIcon, CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

const steps = [
  {
    id: 'details',
    title: 'Details',
    description: 'Enter the required details for this step',
    icon: (
      <FileTextIcon />
    )
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm your information and choices',
    icon: (
      <EyeIcon />
    )
  },
  {
    id: 'done',
    title: 'Done',
    description: 'All set - review completed',
    icon: (
      <CheckCircleIcon />
    )
  }
]

export function StepperVerticalDemo() {
  const [current, setCurrent] = useState(steps[0].id)

  const currentIndex = steps.findIndex(s => s.id === current)
  const goNext = () => setCurrent(steps[Math.min(currentIndex + 1, steps.length - 1)].id)
  const goBack = () => setCurrent(steps[Math.max(currentIndex - 1, 0)].id)

  const [submitted, setSubmitted] = useState(false)

  const handleNext = () => {
    if (currentIndex === steps.length - 1) {
      setSubmitted(true)
    } else {
      goNext()
    }
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <Stepper
        steps={steps}
        value={current}
        onValueChange={v => {
          if (!submitted) setCurrent(v)
        }}
        className='flex flex-col items-center justify-center gap-6 w-full'
        orientation='horizontal'
      >
        <StepperNav>
          {steps.map((step, index) => (
            <StepperItem key={index} stepId={step.id} completed={submitted} className='relative flex-1'>
              <StepperTrigger
                className={cn('flex flex-col gap-2.5', submitted ? 'pointer-events-none' : '')}
                aria-disabled={submitted}
              >
                <StepperIndicator
                  className={
                    submitted
                      ? 'data-[state=completed]:bg-green-600/20 data-[state=completed]:text-green-600'
                      : ''
                  }
                >
                  {index + 1}
                </StepperIndicator>
                <StepperTitle className={`${submitted ? 'text-muted-foreground' : ''}`}>{step.title}</StepperTitle>
              </StepperTrigger>
              {steps.length > index + 1 && (
                <StepperSeparator
                  className={cn(
                    'absolute inset-x-0 top-2 right-[calc(-50%+18px)] left-[calc(50%+18px)]',
                    submitted
                      ? 'group-data-[state=completed]/step:bg-green-600/40'
                      : ''
                  )}
                />
              )}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel className='w-full text-center text-sm'>
          {steps.map(step => (
            <StepperContent key={step.id} value={step.id}>
              <div className='bg-[#191F1B] border-[#3A4540]/60 flex flex-col items-center gap-4 rounded-xl border p-4 md:p-8'>
                <div className='space-y-1 text-center'>
                  <h3 className='text-[#F2F2EE] text-base font-bold'>{step.title}</h3>
                  <p className='text-[#A7ACA6] text-xs'>{step.description}</p>
                </div>

                <div className='w-full'>
                  <div className='text-[#A7ACA6] flex h-20 items-center justify-center'>
                    <span className='text-sm'>{step.title} content</span>
                  </div>

                  <div className='mt-6 flex items-center justify-between'>
                    {!submitted && (
                      <Button
                        onClick={goBack}
                        disabled={currentIndex === 0}
                        variant={currentIndex === 0 ? 'secondary' : 'default'}
                      >
                        <ArrowLeftIcon className='size-4' /> Back
                      </Button>
                    )}

                    <Button onClick={handleNext} className='ml-auto'>
                      {currentIndex === steps.length - 1 ? (
                        <>Submit</>
                      ) : (
                        <>
                          Next <ArrowRightIcon className='size-4' />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  )
}

export default StepperVerticalDemo
