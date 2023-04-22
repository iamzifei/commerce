import { BlurImage, Frame, Layout } from '@components/common'
import { Tick } from '@components/icons'
import {
  Button,
  Container,
  CTA,
  LoadingDots,
  ProgressBar,
  Text,
} from '@components/ui'
import { useUI } from '@components/ui/context'
import useCustomer from '@framework/customer/use-customer'
import commerce from '@lib/api/commerce'
import paintingImage from '@public/painting.jpeg'
import cn from 'clsx'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { FileInput, Label } from 'flowbite-react'
import type { GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import { Resizable } from 're-resizable'
import { useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import { useFirebaseApp } from 'reactfire'

interface Prediction {
  id: string
  status: string
  prompt: string
  result?: string
  detail?: string
  output?: any[]
}

interface ImageProps {
  src: string
  height?: number
  width?: number
  blurDataURL?: string
  placeholder?: 'blur' | 'empty'
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
  const router = useRouter()

  const [step, setStep] = useState(router.query.step ?? 1)

  const goToStep = (step: number, asPath: string) => {
    router.push(`/ai?step=${step}`, asPath)
  }

  const { data, isValidating } = useCustomer()
  const { openModal } = useUI()

  const [prompt, setPrompt] = useState('')
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [aiImage, setAiImage] = useState<string | null>(null)
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
        prompt,
      }),
    })
    let prediction = await response.json()
    if (response.status !== 201) {
      setError(prediction.detail)
      return
    }
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
      if (prediction.output) {
        setAiImage(prediction.output[prediction.output.length - 1])
      }
    }

    setIsLoading(false)
  }

  const storage = getStorage(useFirebaseApp())

  const [file, setFile] = useState<File>() // progress
  const [uploading, setUploading] = useState(false) // progress
  const [percent, setPercent] = useState(0) // Handle file upload event and update state
  const [roomImage, setRoomImage] = useState<ImageProps>({
    src: '/room-placeholder.png',
  })

  function handleChange(event: any) {
    setFile(event.target.files[0])
  }

  const handleUpload = () => {
    if (!file) {
      alert('Please select an image first!')
    }

    const storageRef = ref(storage, `/rooms/${file?.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file as Blob)
    setUploading(true)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setPercent(progress)
      },
      (error) => {
        console.log(error)
        setUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((roomImage) => {
          fetch('/api/blurImage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              src: roomImage,
            }),
          }).then(async (response) => {
            const roomProps = await response.json()
            setRoomImage(roomProps)
          })
        })
        setUploading(false)
        setFile(undefined)
      }
    )
  }

  useEffect(() => {
    if (router.query.step) {
      setStep(Number(router.query.step))
    }
  }, [router.query])

  useEffect(() => {
    if (!aiImage && step !== 1) {
      setStep(1)
      router.push(`/ai?step=1`, '')
    }
  }, [aiImage, router, step])

  return (
    <Container className="pt-4">
      {isValidating ? (
        <div className="flex justify-center items-center w-full h-12">
          <LoadingDots />
        </div>
      ) : data ? (
        <>
          <Text variant="pageHeading">Create your own A.I. art...</Text>
          <div>
            <ol className="flex mb-2 md:mb-4 lg:mb-8 items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
              <li
                className={cn(
                  step === 1 ? 'text-blue' : '',
                  "flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                )}
              >
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                  {step === 1 ? <Tick /> : <span className="mr-2">1</span>}
                  <span className="sm:inline-flex sm:ml-2">Create</span>
                  <span className="hidden sm:inline-flex sm:ml-2">
                    Painting
                  </span>
                </span>
              </li>
              <li
                className={cn(
                  step === 2 ? 'text-blue' : '',
                  "flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                )}
              >
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                  {step === 2 ? <Tick /> : <span className="mr-2">2</span>}
                  <span className="hidden sm:inline-flex sm:ml-2">Upload</span>
                  <span className="sm:inline-flex sm:ml-2">Room</span>
                  <span className="hidden sm:inline-flex sm:ml-2">Picture</span>
                </span>
              </li>
              <li
                className={cn(
                  step === 3 ? 'text-blue' : '',
                  'flex items-center'
                )}
              >
                {step === 3 ? <Tick /> : <span className="mr-3">2</span>}
                Confirmation
              </li>
            </ol>

            {step === 1 && (
              <>
                <div className="mb-8">
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={3}
                    placeholder="Enter a prompt to display an image"
                    className="mb-4 block p-2 w-full border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                    disabled={isLoading}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <Button
                      className="w-auto"
                      onClick={(e) => handlePrediction(e)}
                      loading={isLoading}
                    >
                      {isLoading &&
                      prediction &&
                      status.indexOf(prediction.status) >= 0
                        ? prediction.status
                        : 'Generate My Painting!'}
                    </Button>
                    {aiImage && (
                      <Button
                        className="w-auto"
                        onClick={() => goToStep(2, '')}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
                {error && <div>{error}</div>}
                {prediction && (
                  <div>
                    {prediction.output && (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div />
                        <Frame alt="A.I. Generated Painting" image={aiImage} />
                        <div />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {aiImage && step === 2 && (
              <>
                <div className="mb-2 block">
                  <Label htmlFor="file" value="Upload your room picture" />
                </div>
                <FileInput
                  id="file"
                  accept="image/png, image/gif, image/jpg, image/jpeg"
                  onChange={handleChange}
                  helperText={
                    <span className="text-accent-9 mb-4">
                      only accept PNG, GIF, JPG, JPEG format
                    </span>
                  }
                  disabled={uploading}
                />

                {file && (
                  <Button loading={uploading} onClick={handleUpload}>
                    Upload your room picture
                  </Button>
                )}

                {uploading && (
                  <ProgressBar className="my-4" progress={percent} />
                )}

                <div className="relative my-4">
                  <BlurImage
                    alt="Room Picture"
                    image={roomImage}
                    className="left-0 top-0 mx-auto max-w-7xl w-full"
                    imgProps={{
                      style: { objectFit: 'contain' },
                    }}
                  />

                  <Draggable
                    bounds="parent"
                    defaultClassName="absolute-important left-1/4 m-auto top-1/4 text-center"
                  >
                    <Resizable
                      defaultSize={{
                        width: 240,
                        height: 240,
                      }}
                      lockAspectRatio={true}
                    >
                      <Frame
                        className=""
                        alt="A.I. Generated Painting"
                        image={aiImage}
                      />
                    </Resizable>
                  </Draggable>
                </div>
                <div className="flex justify-between mb-4">
                  <Button
                    type="button"
                    className="w-auto"
                    onClick={() => goToStep(1, '')}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    className="w-auto"
                    onClick={() => goToStep(3, '')}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {aiImage && step === 3 && (
              <>
                <div className="flex justify-between">
                  <Button className="w-auto" onClick={() => goToStep(2, '')}>
                    Previous
                  </Button>
                  <Button className="w-auto">Add to Cart</Button>
                </div>
              </>
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
