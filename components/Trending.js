import React from "react"
import { Flex, Text, Heading, Box, Image } from "@chakra-ui/react"

const Trending = ({ trending }) => {
	return (
		<Flex flexDirection="column" my="2" ml="2">
			<Text textAlign="center" fontWeight="bold">
				{trending.heading}
			</Text>
			<Text>{trending.description}</Text>
			<Flex>
				{trending.tags.map((tag, _i) => (
					<Text color="gray.600" key={_i}>
						{" "}
						{tag}
					</Text>
				))}
			</Flex>
			<Box>{trending.img && <Image src={trending.img} alt="trending image" objectFit="cover" />}</Box>
		</Flex>
	)
}
export default Trending
