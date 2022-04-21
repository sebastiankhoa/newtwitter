import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from "recoil"

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<ChakraProvider>
			<SessionProvider session={session}>
				<RecoilRoot>
					<Component {...pageProps} />
				</RecoilRoot>
			</SessionProvider>
		</ChakraProvider>
	)
}
