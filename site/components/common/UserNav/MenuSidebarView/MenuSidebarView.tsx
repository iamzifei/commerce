import Link from 'next/link'
import s from './MenuSidebarView.module.css'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import type { Page } from '@commerce/types/page'

export default function MenuSidebarView({
  links = [],
}: {
  links?: (Page | { name: string; url: string })[]
}) {
  const { closeSidebar } = useUI()

  return (
    <SidebarLayout handleClose={() => closeSidebar()}>
      <div className={s.root}>
        <nav>
          <ul>
            {links.map((l: any) => (
              <li key={l.url} className={s.item} onClick={() => closeSidebar()}>
                <Link href={l.url}>{l.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </SidebarLayout>
  )
}

MenuSidebarView
