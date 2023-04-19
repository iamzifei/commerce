import { memo, useEffect } from 'react'
import { Swatch, VariantSelector } from '@components/product'
import type { ProductOption } from '@commerce/types/product'
import { SelectedOptions } from '../helpers'

interface ProductOptionsProps {
  options: ProductOption[]
  selectedOptions: SelectedOptions
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptions>>
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  // if there's color options, get them
  const colorOptions = options.filter(
    (opt) => opt.values.findIndex((v) => v.hexColors) > -1
  )

  // get the rest of the options
  const otherOptions = options.filter(
    (opt) => opt.values.findIndex((v) => v.hexColors) === -1
  )

  useEffect(() => {
    // set the selected options to the first option by default
    if (!Object.keys(selectedOptions).length) {
      const newSelectedOptions = {} as SelectedOptions
      options.forEach((opt) => {
        newSelectedOptions[opt.displayName.toLowerCase()] =
          opt.values[0].label.toLowerCase()
      })
      setSelectedOptions(newSelectedOptions)
    }
  })

  return (
    <div>
      {colorOptions.map((opt) => (
        <div className="pb-4" key={opt.displayName}>
          <h2 className="uppercase font-medium text-sm tracking-wide">
            {opt.displayName}
          </h2>
          <div role="listbox" className="flex flex-row py-4">
            {opt.values.map((v, i: number) => {
              const active = selectedOptions[opt.displayName.toLowerCase()]
              return (
                <Swatch
                  key={`${opt.id}-${i}`}
                  active={v.label.toLowerCase() === active}
                  variant={opt.displayName}
                  color={v.hexColors ? v.hexColors[0] : ''}
                  label={v.label}
                  onClick={() => {
                    setSelectedOptions((selectedOptions) => {
                      return {
                        ...selectedOptions,
                        [opt.displayName.toLowerCase()]: v.label.toLowerCase(),
                      }
                    })
                  }}
                />
              )
            })}
          </div>
        </div>
      ))}
      {otherOptions.map((opt) => (
        <div className="pb-4" key={opt.displayName}>
          <h2 className="uppercase font-medium text-sm tracking-wide">
            {opt.displayName}
          </h2>
          <div role="listbox" className="flex flex-row py-4">
            <VariantSelector
              option={opt}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(ProductOptions)
