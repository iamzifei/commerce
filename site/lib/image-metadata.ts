/**
 * utils/imageMetadata.js
 * Code written by Nikolov Lazar
 * https://nikolovlazar.com/blog/generating-blur-for-dynamic-images-nextjs
 */

import imageSize from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'
import path from 'path'
import { getPlaiceholder } from 'plaiceholder'
import { promisify } from 'util'

// Convert the imageSize method from callback-based to a Promise-based
// promisify is a built-in nodejs utility function btw
const sizeOf = promisify(imageSize)

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

// Just to check if the node is an image node
// function isImageNode(node: Node): node is ImageNode {
//   const img = node as ImageNode
//   return (
//     img.type === 'element' &&
//     img.tagName === 'img' &&
//     img.properties &&
//     typeof img.properties.src === 'string'
//   )
// }

// Returns the props of given `src` to use for blurred images
export async function imageMetadata(
  src: string
): Promise<ImageNode['properties']> {
  let res: ISizeCalculationResult | undefined
  let blur64: string

  // Check if the image is external (remote)
  const isExternal = src.startsWith('http')

  // If it's local, we can use the sizeOf method directly, and pass the path of the image
  if (!isExternal) {
    // Calculate image resolution (width, height)
    res = await sizeOf(path.join(process.cwd(), 'public', src))
    // Calculate base64 for the blur
    blur64 = (await getPlaiceholder(src)).base64
  } else {
    // If the image is external (remote), we'd want to fetch it first
    const imageRes = await fetch(src)
    // Convert the HTTP result into a buffer
    const arrayBuffer = await imageRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Calculate the resolution using a buffer instead of a file path
    res = await imageSize(buffer)
    // Calculate the base64 for the blur using the same buffer
    blur64 = (await getPlaiceholder(buffer)).base64
  }

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

// async function addProps(node: ImageNode): Promise<void> {
//   // return the new props we'll need for our image
//   const { width, height, blurDataURL } = await returnProps(node.properties.src)

//   // add the props in the properties object of the node
//   // the properties object later gets transformed as props
//   node.properties.width = width
//   node.properties.height = height

//   node.properties.blurDataURL = blurDataURL
//   node.properties.placeholder = 'blur'
// }

// const imageMetadata = () => {
//   return async function transformer(tree: Node): Promise<Node> {
//     // Create an array to hold all of the images from the markdown file
//     const images: ImageNode[] = []

//     visit(tree, 'element', (node: Node) => {
//       // Visit every node in the tree, check if it's an image and push it in the images array
//       if (isImageNode(node)) {
//         images.push(node)
//       }
//     })

//     for (const image of images) {
//       // Loop through all of the images and add their props
//       await addProps(image)
//     }

//     return tree
//   }
// }

export default imageMetadata
