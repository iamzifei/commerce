export default async function handler(req, res) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: process.env.REPLICATE_MODEL_VERSION,
      input: { prompt: req.body.prompt },
    }),
  })

  if (response.status !== 201) {
    let error = await response.json()
    res.statusCode = 500
    res.end(JSON.stringify({ detail: error.detail }))
    return
  }

  const prediction = await response.json()
  res.statusCode = 201
  res.end(JSON.stringify(prediction))
}
