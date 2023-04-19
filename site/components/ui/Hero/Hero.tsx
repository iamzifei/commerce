import React, { FC } from 'react'
import { Container } from '@components/ui'
import { ArrowRight } from '@components/icons'
import s from './Hero.module.css'
import Link from 'next/link'
import Image from 'next/image'

interface HeroProps {
  className?: string
  headline: string
  description: string
  link?: string
  linkText?: string
  background?: any
  cta?: JSX.Element
}

const Hero: FC<HeroProps> = ({
  headline,
  description,
  link,
  linkText,
  background,
  cta,
}) => {
  return (
    <div className="relative bg-accent-2 border-b border-t border-accent-2 isolate overflow-hidden">
      <Container className="flex flex-col lg:flex-row">
        <div className={s.root}>
          <h2 className={s.title}>{headline}</h2>
          <div className={s.description}>
            <p>{description}</p>
            {link && (
              <Link
                href={link}
                className="flex items-center text-accent-9 pt-3 font-bold hover:underline cursor-pointer w-max-content"
              >
                {linkText}
                <ArrowRight width="20" heigh="20" className="ml-1" />
              </Link>
            )}
            {cta && (
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {cta}
              </div>
            )}
          </div>
        </div>
        {background && (
          <div className="relative w-full h-80 lg:h-auto mx-auto rounded-md overflow-hidden pb-16 lg:py-32 lg:pl-8">
            <Image
              className="max-w-none mx-auto relative w-full h-full rounded-md"
              src={background}
              alt="CTA background"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </Container>
    </div>
  )
}

export default Hero
