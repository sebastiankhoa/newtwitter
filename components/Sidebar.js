import { Flex, Text, Box, Button, Avatar, Icon, Spacer, Image } from "@chakra-ui/react"
import SidebarLink from "./SidebarLink"
import { AiFillHome, AiOutlineBell, AiOutlineInbox, AiOutlineUser } from "react-icons/ai"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { BsHash, BsBookmarkCheck, BsClipboardCheck } from "react-icons/bs"
import { useSession, signOut } from "next-auth/react"

const Sidebar = () => {
	const { data: session } = useSession()

	console.log(session.user.name)

	return (
		<Flex
			flexDirection="column"
			display={{ base: "none", md: "flex" }}
			w={{ md: "10%", lg: "16%" }}
			justifyContent="space-between"
			pos="fixed"
			h="100vh"
		>
			<Box m="1px 5px">
				<Box ml="30px" mb="5" mt="5" cursor="pointer">
					<Image
						src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
						alt="logo"
						width="80px"
						hight="80px"
					/>
				</Box>
				<Flex flexDirection="column" alignItems="start">
					<SidebarLink text="Home" icons={AiFillHome} active />
					<SidebarLink text="Explore" icons={BsHash} />
					<SidebarLink text="Notifications" icons={AiOutlineBell} />
					<SidebarLink text="Messages" icons={AiOutlineInbox} />
					<SidebarLink text="Bookmarks" icons={BsBookmarkCheck} />
					<SidebarLink text="Lists" icons={BsClipboardCheck} />
					<SidebarLink text="Profile" icons={AiOutlineUser} />
					<SidebarLink text="More" icons={HiOutlineDotsCircleHorizontal} />
					<Button
						mx="auto"
						fontWeight="bold"
						bg="#1d9bf0"
						fontSize="lg"
						color="white"
						rounded="2xl"
						w="120px"
						h="52px"
						display={{ md: "none", lg: "inline" }}
						_hover={{ bg: "blue.300" }}
					>
						Tweet
					</Button>
				</Flex>
			</Box>
			<Spacer mt="10" />
			<Box m="auto">
				<Flex align="center" cursor="pointer" onClick={signOut}>
					<Avatar _hover={{ opacity: "50%" }} name="avatar" size="sm" src={session.user.image} objectFit="cover" />
					<Box m="0 5px" display={{ md: "none", lg: "inline" }}>
						<Text fontWeight="bold" fontSize="14px" _hover={{ color: "blue.500" }}>
							{session.user.name}
						</Text>
						<Text color="gray.600" fontSize="12px">
							@{session.user.tag}
						</Text>
					</Box>
					<Icon h="6" w="6" as={HiOutlineDotsCircleHorizontal} ml={{ md: "0", lg: "3" }} />
				</Flex>
			</Box>
		</Flex>
	)
}

export default Sidebar
