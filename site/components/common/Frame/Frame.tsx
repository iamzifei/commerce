import { FC } from 'react'
import cn from 'clsx'
import Image, { ImageProps } from 'next/image'

import s from './Frame.module.css'

interface Props {
  imageClassName?: string
  className?: string
  alt?: string
  imgProps?: Omit<ImageProps, 'src' | 'layout' | 'placeholder' | 'blurDataURL'>
  image?: any
}

const placeholderImg = '/product-img-placeholder.svg'

const Frame: FC<Props> = ({
  alt,
  image,
  imgProps,
  className,
  imageClassName,
}) => {
  return (
    <div className={cn(s.root, className)}>
      <Image
        alt={alt || 'A.I. Generated Painting'}
        className={cn(s.img, 'animated fadeIn', imageClassName)}
        src={image || placeholderImg}
        height={480}
        width={480}
        quality="100"
        {...imgProps}
      />
    </div>
  )
}

export default Frame
