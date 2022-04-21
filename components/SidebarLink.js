import React from "react"
import { Icon, Text, Flex, Button } from "@chakra-ui/react"

const SidebarLink = ({ text, icons, active }) => {
	return (
		<Flex flexDirection="column" align="center">
			<Flex
				justifyContent="start"
				w="150px"
				pb="5"
				align="center"
				_hover={{ color: "blue.500" }}
				transitionDuration="500ms"
			>
				<Icon ml="5" as={icons} h={{ md: "10", lg: "5" }} w={{ md: "10", lg: "5" }} />
				<Text ml="2" display={{ md: "none", lg: "inline" }} fontWeight="semibold">
					{text}
				</Text>
			</Flex>
		</Flex>
	)
}

export default SidebarLink
