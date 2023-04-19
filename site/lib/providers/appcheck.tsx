import { FC, ReactNode } from 'react'
import { AppCheckProvider, useFirebaseApp } from 'reactfire'
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check'

function attachAppCheckDebugToken() {
  const token = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN

  Object.assign(window, {
    FIREBASE_APPCHECK_DEBUG_TOKEN: token,
  })
}

function isBrowser() {
  return typeof window !== 'undefined'
}

const FirebaseAppCheckProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const siteKey = process.env.NEXT_PUBLIC_APPCHECK_KEY

  const app = useFirebaseApp()

  if (!siteKey || !isBrowser() || !process.env.PROD) {
    return <>{children}</>
  }

  if (!process.env.PROD) {
    attachAppCheckDebugToken()
  }

  const provider = new ReCaptchaEnterpriseProvider(siteKey)

  const sdk = initializeAppCheck(app, {
    provider,
    isTokenAutoRefreshEnabled: true,
  })

  return <AppCheckProvider sdk={sdk}>{children}</AppCheckProvider>
}

export default FirebaseAppCheckProvider
