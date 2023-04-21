import cn from 'clsx'
import { FC } from 'react'

type ProgressBarProps = {
  progress: number
  className?: string
}

const ProgressBar: FC<ProgressBarProps> = ({ progress = 0, className }) => {
  // keep 0 decimal places for progress
  progress = Math.round(progress)
  return (
    <div
      className={cn(
        className,
        'w-full bg-accent-2 rounded-full dark:bg-gray-700'
      )}
    >
      <div
        className="bg-blue text-xs font-medium text-center p-0.5 leading-none rounded-full"
        style={{ width: `${progress}%` }}
      >
        <div className="p-1 ml-1 text-accent-2">
          {progress === 100 ? 'Done' : `${progress}%`}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
