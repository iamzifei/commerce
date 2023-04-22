import cn from 'clsx'
import Image, { ImageProps } from 'next/image'
import { FC, useState } from 'react'

interface ImgProps {
  src: string
  height?: number
  width?: number
  blurDataURL?: string
  placeholder?: 'blur' | 'empty'
}

interface Props {
  imageClassName?: string
  className?: string
  alt?: string
  imgProps?: Omit<ImageProps, 'alt' | 'src'>
  image: ImgProps
  placeholderImg?: string
}

const defaultPlaceHolder = '/product-img-placeholder.svg'

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63)

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

const BlurImage: FC<Props> = ({ alt, image, imgProps = {}, className }) => {
  const [isLoading, setLoading] = useState(true)

  return (
    <Image
      alt={alt || 'A.I. Generated Painting'}
      className={cn(
        'animated fadeIn duration-800',
        className,
        isLoading
          ? 'scale-110 blur-2xl grayscale'
          : 'scale-100 blur-0 grayscale-0'
      )}
      src={image?.src || defaultPlaceHolder}
      onLoadingComplete={() => setLoading(false)}
      width={image?.width || 2000}
      height={image?.height || 2000}
      {...imgProps}
      {...(image && {
        blurDataURL: image.blurDataURL || rgbDataURL(237, 181, 6),
        placeholder: image.placeholder || 'blur',
      })}
    />
  )
}

export default BlurImage
