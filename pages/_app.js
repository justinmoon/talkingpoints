import { useEffect } from "react"
import { ThemeProvider, CSSReset } from "@chakra-ui/core"
import Router from "next/router"
import * as Fathom from "fathom-client"

import { AuthProvider } from "utils/auth"
import theme from "styles/theme"

Router.events.on("routeChangeComplete", () => {
  Fathom.trackPageview()
})

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Fathom.load("SIJYMLCS", {
        includedDomains: ["talkingpoints.vercel.app"],
      })
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CSSReset />
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
