import { useState } from 'react'
import type { GetStaticPropsContext } from 'next'
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import { Layout, Frame } from '@components/common'
import { Container, Text, LoadingDots, Button, CTA } from '@components/ui'
import paintingImage from '@public/painting.jpeg'
import { useUI } from '@components/ui/context'
import Image from 'next/image'
import { StorageProvider, useFirebaseApp, useStorage } from 'reactfire'
// import { storage } from '@lib/firebase'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'

interface Prediction {
  id: string
  status: string
  prompt: string
  result?: string
  detail?: string
  output?: any[]
}

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories },
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const status = ['starting', 'processing']

export default function Room() {
  const { data, isValidating } = useCustomer()
  const { openModal } = useUI()

  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePrediction = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const response = await fetch('/api/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    })
    let prediction = await response.json()
    if (response.status !== 201) {
      setError(prediction.detail)
      return
    }
    setPrediction(prediction)

    while (
      prediction.status !== 'succeeded' &&
      prediction.status !== 'failed'
    ) {
      await sleep(1000)
      const response = await fetch('/api/predictions/' + prediction.id)
      prediction = await response.json()
      if (response.status !== 200) {
        setError(prediction.detail)
        return
      }
      setPrediction(prediction)
    }

    setIsLoading(false)
  }

  const storage = getStorage(useFirebaseApp())

  const [file, setFile] = useState<File>() // progress
  const [percent, setPercent] = useState(0) // Handle file upload event and update state
  function handleChange(event: any) {
    setFile(event.target.files[0])
  }

  const handleUpload = () => {
    if (!file) {
      alert('Please upload an image first!')
    }

    const storageRef = ref(storage, `/rooms/${file?.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file as Blob)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break
          case 'running':
            console.log('Upload is running')
            break
        }
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL)
        })
      }
    )
  }

  return (
    <Container className="pt-4">
      {isValidating ? (
        <div className="flex justify-center items-center w-full h-12">
          <LoadingDots />
        </div>
      ) : data ? (
        <>
          <Text variant="pageHeading">Create your own...</Text>
          <div>
            <form className="mb-8" onSubmit={handlePrediction}>
              <textarea
                id="prompt"
                name="prompt"
                rows={3}
                placeholder="Enter a prompt to display an image"
                className="mb-4 block p-2 w-full border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                disabled={isLoading}
              />
              <Button className="w-auto" type="submit" loading={isLoading}>
                {isLoading &&
                prediction &&
                status.indexOf(prediction.status) >= 0
                  ? prediction.status
                  : 'Generate My Painting!'}
              </Button>
            </form>
            {error && <div>{error}</div>}

            <input type="file" onChange={handleChange} accept="/image/*" />
            <button onClick={handleUpload}>Upload to Firebase</button>
            <p>{percent} "% done"</p>

            {prediction && (
              <div>
                {prediction.output && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div />
                    <Frame
                      alt="A.I. Generated Painting"
                      image={prediction.output[prediction.output.length - 1]}
                    />
                    <div />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <CTA
            headline="Custom Painting"
            description={
              <>
                <span>
                  Custom painting can involve working with the client to
                  determine the subject matter, colors, and overall design of
                  the painting, and then creating the artwork according to those
                  specifications. The finished product is typically a unique and
                  personalized piece of art that the client can display and
                  enjoy in their home or office.
                </span>
                <span className="mt-6">Please login to see more.</span>
              </>
            }
            background={paintingImage}
            variant="contain"
            cta={<Button onClick={() => openModal()}>Login</Button>}
          />
        </>
      )}
    </Container>
  )
}

Room.Layout = Layout
