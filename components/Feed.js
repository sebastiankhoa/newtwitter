import React, { useState, useEffect } from "react"
import { Text, Flex, Heading, Icon, Box } from "@chakra-ui/react"
import { GiSparkles } from "react-icons/gi"
import { FaHome } from "react-icons/fa"

import { onSnapshot, collection, query, orderBy } from "@firebase/firestore"
import { db } from "../firebase"
import { useSession } from "next-auth/react"

import InputTweet from "../components/Input"
import Post from "./Post"

const Feed = () => {
	const [posts, setPosts] = useState([])

	const { data: session } = useSession()

	useEffect(
		() =>
			onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot) => {
				setPosts(snapshot.docs)
			}),
		[db]
	)

	return (
		<Flex
			borderX="1px"
			borderColor="gray.400"
			minWidth="60%"
			flexDirection="column"
			ml={{ sm: "10", md: "200", lg: "250" }}
		>
			{/* Nơi chứa nút Home và Sparkle Icon */}
			<Flex pos="sticky" top="0" zIndex="50" p="2px 5px" align="center" justifyContent="center" opacity="50%">
				<Icon cursor="pointer" as={FaHome} h="10" w="10" color="blue.600" />
			</Flex>
			{/* Đây là Component để nhập tweet và post tweet */}
			<InputTweet />
			{/* Nơi hiện ra tất cã các tin được tweet bởi user với Post Component */}
			<Box>{posts && posts.map((P) => <Post key={P.id} id={P.id} post={P.data()} />)}</Box>
		</Flex>
	)
}

export default Feed
