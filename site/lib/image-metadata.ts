/**
 * utils/imageMetadata.js
 * Code written by Nikolov Lazar
 * https://nikolovlazar.com/blog/generating-blur-for-dynamic-images-nextjs
 */

import imageSize from 'image-size'
import { getPlaiceholder } from 'plaiceholder'

type ImageNode = {
  type: 'element'
  tagName: 'img'
  properties: {
    src: string
    height?: number
    width?: number
    blurDataURL?: string
    placeholder?: 'blur' | 'empty'
  }
}

// Returns the props of given `src` to use for blurred images
export async function imageMetadata(
  src: string
): Promise<ImageNode['properties']> {
  // If the image is external (remote), we'd want to fetch it first
  const imageRes = await fetch(src)
  // Convert the HTTP result into a buffer
  const arrayBuffer = await imageRes.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Calculate the resolution using a buffer instead of a file path
  const res = imageSize(buffer)
  // Calculate the base64 for the blur using the same buffer
  const blur64 = (await getPlaiceholder(buffer)).base64

  // If an error happened calculating the resolution, throw an error
  if (!res) throw Error(`Invalid image with src "${src}"`)

  const { width, height } = res

  return {
    src,
    width,
    height,
    blurDataURL: blur64,
    placeholder: 'blur',
  }
}

export default imageMetadata
