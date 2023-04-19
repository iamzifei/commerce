import { FC } from 'react'
import Image from 'next/image'

interface CTAProps {
  background?: any
  headline: JSX.Element | string
  description: JSX.Element | string
  cta?: JSX.Element
  variant?: 'fill' | 'contain'
}

const CTA: FC<CTAProps> = ({
  background,
  headline,
  description,
  cta,
  variant = 'fill',
}) => {
  let imageContainerClasses =
    'relative mx-auto mt-10 lg:mx-0 lg:flex-auto w-full lg:-mr-24 lg:mt-0 lg:overflow-hidden'
  let imageClasses =
    'relative max-h-96 lg:max-h-fit lg:absolute -left-1/2 -top-1/2 max-w-none bg-white/5 ring-1 ring-white/10 -ml-8 md:-ml-0 lg:ml-0'
  let imageProps = {
    width: 1824,
    height: 1080,
    fill: false,
  }

  if (variant === 'contain') {
    imageContainerClasses =
      'relative h-40 lg:h-80 my-8 md:mt-12 lg:mt-0 lg:grow lg:self-center'
    imageClasses = 'absolute left-0 top-0 w-[57rem] max-w-none bg-white/5'
    imageProps = {
      width: undefined as any,
      height: undefined as any,
      fill: true,
    }
  }

  return (
    <div className="bg-accent-0">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {headline}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {description}
            </p>
            {cta && (
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                {cta}
              </div>
            )}
          </div>
          {background && (
            <div className={imageContainerClasses}>
              <Image
                className={imageClasses}
                src={background}
                alt="CTA background"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                {...imageProps}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CTA
