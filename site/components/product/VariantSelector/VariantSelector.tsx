import { FC, useState, useEffect, memo } from 'react'
import { ChevronRight, Cross } from '@components/icons'
import cn from 'clsx'
import ClickOutside from '@lib/click-outside'
import { SelectedOptions } from '../helpers'
import type { ProductOption } from '@commerce/types/product'

interface VariantProps {
  option: ProductOption
  selectedOptions: SelectedOptions
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptions>>
}

const Variant: FC<VariantProps> = ({
  option,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [display, setDisplay] = useState(false)
  const [selected, setSelected] = useState('')

  useEffect(() => {
    // find the selected option label based on the selected option value
    const selectedOption = option.values.find(
      (v) =>
        v.label.toLowerCase() ===
        selectedOptions[option.displayName.toLowerCase()]
    )
    // if the selected option label is found, set it to the selected state
    if (selectedOption) setSelected(selectedOption.label)
  }, [option.displayName, option.values, selected, selectedOptions])

  return (
    <ClickOutside active={display} onClick={() => setDisplay(false)}>
      <div className="relative w-full">
        <div
          className="flex items-center relative w-full"
          onClick={() => setDisplay(!display)}
        >
          <button
            className={
              'w-full h-10 pl-2 pr-1 rounded-md border border-accent-2 flex items-center justify-between transition-colors ease-linear hover:border-accent-3 hover:shadow-sm'
            }
            aria-label="Selector"
          >
            <span className="flex flex-shrink items-center">
              <span className={cn('capitalize leading-none ml-2')}>
                {selected}
              </span>
            </span>
            <span className="cursor-pointer">
              <ChevronRight
                className={cn('transition duration-300', {
                  ['rotate-90']: display,
                })}
              />
            </span>
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full">
          {option.values.length && display ? (
            <div
              className={
                'fixed shadow-lg left-0 top-12 mt-2 origin-top-left w-full h-full outline-none bg-accent-0 z-40 lg:absolute lg:border lg:border-accent-1 lg:shadow-lg lg:w-full lg:h-auto'
              }
            >
              <div className="flex flex-row justify-end px-6">
                <button
                  className="md:hidden"
                  onClick={() => setDisplay(false)}
                  aria-label="Close panel"
                >
                  <Cross className="h-6 w-6" />
                </button>
              </div>
              <ul>
                {option.values.map((v, i: number) => (
                  <li key={`${v.label}-${i}`}>
                    <button
                      className="flex w-full capitalize cursor-pointer px-6 py-3 transition ease-in-out duration-150 text-primary leading-6 font-medium items-center hover:bg-accent-1"
                      role={'link'}
                      onClick={() => {
                        setDisplay(false)
                        setSelected(v.label)
                        setSelectedOptions((selectedOptions) => {
                          return {
                            ...selectedOptions,
                            [option.displayName.toLowerCase()]:
                              v.label.toLowerCase(),
                          }
                        })
                      }}
                    >
                      {v.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </ClickOutside>
  )
}

export default memo(Variant)
