import cn from 'clsx'
import Image, { ImageProps } from 'next/image'
import { FC, useState } from 'react'

import s from './Frame.module.css'

interface Props {
  imageClassName?: string
  className?: string
  alt?: string
  imgProps?: Omit<ImageProps, 'src' | 'layout' | 'placeholder' | 'blurDataURL'>
  image?: any
  placeholderImg?: string
}

const defaultPlaceHolder = '/product-img-placeholder.svg'

const Frame: FC<Props> = ({
  alt,
  image,
  imgProps,
  className,
  imageClassName,
  placeholderImg,
}) => {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className={cn(s.root, className)}>
      <Image
        alt={alt || 'A.I. Generated Painting'}
        className={cn(
          s.img,
          'animated fadeIn duration-400',
          imageClassName,
          isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
        src={image || placeholderImg || defaultPlaceHolder}
        height={480}
        width={480}
        quality="100"
        onLoadingComplete={() => setLoading(false)}
        {...imgProps}
      />
    </div>
  )
}

export default Frame
