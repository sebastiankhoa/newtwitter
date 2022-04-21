import React from "react"
import { Flex, Avatar, Text, Box } from "@chakra-ui/react"
import Moment from "react-moment"

const Comments = ({ comment }) => {
	console.log({ comment })

	return (
		<Flex flexDirection="column" borderBottom="1px" mb="1" pb="3">
			<Flex gap="5" align="center">
				<Avatar src={comment.userImg} />
				<Text fontWeight="bold">{comment?.username}</Text>
				<Text color="gray.500">@{comment?.tag}</Text>
				<Moment color="gray.500" fromNow>
					{comment?.timestamp?.toDate()}
				</Moment>
			</Flex>
			<Box ml="90px">{comment.comments}</Box>
		</Flex>
	)
}

export default Comments
