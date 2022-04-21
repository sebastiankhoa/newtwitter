import React from "react"
import { Flex, Box, Text, Icon, Input, Avatar } from "@chakra-ui/react"
import { AiOutlineSearch } from "react-icons/ai"
import Trending from "./Trending"

const Widget = ({ trending, follow }) => {
	return (
		<Flex h="100vh" pos="sticky" top="0" w="20%" py="2" flexDirection="column" display={{ base: "none", md: "flex" }}>
			<Flex ml="1" gap="2" align="center">
				<Icon as={AiOutlineSearch} w="7" h="7" />
				<Input variant="unstyled" w="full" placeholder="Search tweet" type="text" />
			</Flex>
			<Flex flexDirection="column" py="5">
				<Text fontWeight="bold" textAlign="center" fontSize="20">
					Sự Kiện Nổi Bật
				</Text>
				<Box>
					{trending?.map((tren, _i) => (
						<Trending key={_i} trending={tren} />
					))}
				</Box>
				<Flex flexDirection="column" ml="2" borderTop="1px" p="2">
					<Text textAlign="center" fontWeight="bold">
						Who to follow ?
					</Text>
					{follow.map((person, _i) => (
						<Flex key={_i} py="2" gap="2" align="center">
							<Avatar src={person.userImg} objectFit="cover" />
							<Text>{person.username}</Text>
							<Text color="gray.500" fontSize="14">
								{person.tag}
							</Text>
						</Flex>
					))}
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Widget
