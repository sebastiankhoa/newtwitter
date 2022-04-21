import { Box, Flex, Image, Button, Text, Center } from "@chakra-ui/react"
import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"

const Login = ({ providers }) => {
	console.log({ providers })
	return (
		<Flex justifyContent="center" h="100vh" align="center">
			<Flex flexDirection="column">
				<Box cursor="pointer">
					<Image
						src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
						alt="logo"
						w="200px"
						h="200px"
					/>
				</Box>
				{Object.values(providers).map((provider) => (
					<Box key={provider.name} w="10%">
						<Button
							_hover={{ bg: "blue.300", color: "white" }}
							p="8"
							variant="outline"
							leftIcon={<FcGoogle fontSize="30" />}
							onClick={() => signIn(provider.id, { callbackUrl: "/" })}
						>
							<Text fontWeight="800">Sign in with {provider.name}</Text>
						</Button>
					</Box>
				))}
			</Flex>
		</Flex>
	)
}

export default Login
