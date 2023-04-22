import imageMetadata from '@lib/image-metadata'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Pass the image to plaiceholder
  const imageProps = await imageMetadata(req.body.src)

  res.status(200).json({
    ...imageProps,
  })
}
