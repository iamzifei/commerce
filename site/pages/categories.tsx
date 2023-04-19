import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import Image from 'next/image'
import Link from 'next/link'

import cat from '../public/categories/cat.png'
import landscape from '../public/categories/landscape.png'
import fiction from '../public/categories/fiction.jpg'
import car from '../public/categories/car.png'
import featured from '../public/categories/feature.png'
import worldcup from '../public/categories/world-cup.png'
import myth from '../public/categories/myth.png'
import acg from '../public/categories/acg.png'
import defaultImage from '../public/categories/default-category.jpeg'

const collections = [
  {
    slug: 'featured-products',
    image: featured,
  },
  {
    slug: 'cat',
    image: cat,
  },
  {
    slug: 'car',
    image: car,
  },
  {
    slug: 'fiction',
    image: fiction,
  },
  {
    slug: 'landscape',
    image: landscape,
  },
  {
    slug: 'angel',
    image: myth,
  },
  {
    slug: 'acg',
    image: acg,
  },
  {
    slug: 'world-cup',
    image: worldcup,
  },
]

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { categories } = await siteInfoPromise
  const { pages } = await pagesPromise

  return {
    props: {
      categories,
      pages,
    },
    revalidate: 60,
  }
}

export default function Categories({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // order categories by the order of collections
  categories.sort((a, b) => {
    const aIndex = collections.findIndex((c) => c.slug === a.slug)
    const bIndex = collections.findIndex((c) => c.slug === b.slug)
    return aIndex - bIndex
  })

  return (
    <div className="bg-accent-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-accent-9">Categories</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            {categories.map((category) => (
              <div key={category.name} className="group relative">
                <Link
                  href={`/search${category.path}`}
                  className="flex items-center flex-row"
                >
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-accent-0 sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <Image
                      src={
                        collections.find((c) => c.slug === category.slug)
                          ?.image || defaultImage
                      }
                      alt={category.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="absolute rounded-md opacity-70 left-2 bottom-2 px-3 py-3 bg-accent-0">
                    <p className="text-base font-semibold text-accent-9">
                      {category.name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

Categories.Layout = Layout
