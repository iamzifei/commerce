import { FC } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import type { Page } from '@commerce/types/page'

interface NavbarProps {
  links?: (Page | { name: string; url: string })[]
}

const Navbar: FC<NavbarProps> = ({ links = [] }) => {
  return (
    <NavbarRoot>
      <Container clean className="mx-auto max-w-8xl px-6">
        <div className={s.nav}>
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className={s.navMenu}>
              {links.slice(0, 3).map((l) => (
                <Link href={l.url!} key={l.url} className={s.link}>
                  {l.name}
                </Link>
              ))}
            </nav>
          </div>
          {process.env.COMMERCE_SEARCH_ENABLED && (
            <div className="justify-center flex-1 hidden lg:flex">
              <Searchbar />
            </div>
          )}
          <div className="flex items-center justify-end flex-1 space-x-8">
            <UserNav />
          </div>
        </div>
        {process.env.COMMERCE_SEARCH_ENABLED && (
          <div className="flex pb-4 lg:px-6 lg:hidden">
            <Searchbar id="mobile-search" />
          </div>
        )}
      </Container>
    </NavbarRoot>
  )
}

export default Navbar
