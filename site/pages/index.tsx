import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero, TopHero, Button } from '@components/ui'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import paintingImage from '../public/painting.jpeg'
import bannerImage from '../public/banner.jpeg'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise

  return {
    props: {
      products,
      pages,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <TopHero
        headline="The Meta Gallery"
        description="Where your dream artwork becomes true"
        background={bannerImage}
        cta={
          <>
            <Link href="/search">
              <Button>View Gallery</Button>
            </Link>
          </>
        }
      />
      <Grid variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              alt: product.name,
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
              priority: true,
            }}
          />
        ))}
      </Grid>
      <Hero
        headline="Custom Painting"
        description="Custom painting can involve working with the client to determine the subject matter, colors, and overall design of the painting, and then creating the artwork according to those specifications. The finished product is typically a unique and personalized piece of art that the client can display and enjoy in their home or office."
        background={paintingImage}
      />
      <Marquee variant="primary">
        {products.slice(0, 8).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
    </>
  )
}

Home.Layout = Layout
