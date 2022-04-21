import { useState, useEffect } from "react"
import Moment from "react-moment"

import { Flex, Box, Avatar, Text, Image, Icon } from "@chakra-ui/react"

import { BsThreeDots, BsFillChatDotsFill, BsChatDots, BsFillTrashFill } from "react-icons/bs"
import { AiOutlineBarChart, AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"

import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "@firebase/firestore"

import { db } from "../firebase"
import { modalState, postIdState } from "../atom/modalAtom"

const Post = ({ id, post }) => {
	const { data: session } = useSession()

	const router = useRouter()

	const [comment, setComment] = useState([])

	const [likes, setLikes] = useState([])
	const [liked, setLiked] = useState(false)

	// state use Recoil
	const [isOpen, setIsOpen] = useRecoilState(modalState)
	const [postId, setPostId] = useRecoilState(postIdState)

	//Fetch all likes from sever
	useEffect(() => onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => setLikes(snapshot.docs)), [])

	// Hàm findIndex trả về index của giá trị thoả đk, nếu ko tìm đc thì trả về -1
	//Như bên dưới nếu ko tìm thấy sẽ trả về -1 và, -1 !== -1 sẽ là true(Nghĩa là đã có like)
	useEffect(() => {
		setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1)
	}, [likes])

	//function like post
	const likePost = async () => {
		if (liked) {
			await deleteDoc(doc(db, "posts", id, "likes", session.user.uid))
		} else {
			await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
				username: session.user.name,
			})
		}
	}

	// Fetch comment from server
	useEffect(() => {
		onSnapshot(query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")), (snapshot) => {
			setComment(snapshot.docs)
		})
	}, [db, id])

	return (
		<>
			<Flex flexDirection="column" pb="5" cursor="pointer">
				{/* Chứa avatar ,tên username,tag,timestamp,nội dung tweet  */}
				<Flex>
					<Box ml="1">
						{/* Chứa avatar */}
						<Avatar _hover={{ opacity: "50%" }} name="avatar" size="md" src={post?.userImg} />
					</Box>

					{/* username,tag,timestamp,tweet */}
					<Flex flexDirection="column" ml={{ sm: "1", md: "3" }}>
						<Flex align="center">
							{/* username,tag,timestamp */}
							<Text
								fontSize={{ base: "10", md: "14", lg: "20" }}
								fontWeight="bold"
								_hover={{ color: "blue.400", textDecoration: "underline" }}
							>
								{post?.username}
							</Text>
							<Text fontSize={{ base: "10", md: "14", lg: "16" }} ml="2">
								@{post?.tag}
							</Text>
							{/* Hiện đã tweet bao lâu rồi */}
							<Flex
								ml={{ base: "2", md: "100" }}
								fontSize={{ base: "10", md: "12", lg: "14" }}
								textTransform="uppercase"
								fontWeight="semibold"
							>
								<Moment fromNow>{post?.timestamp?.toDate()}</Moment>
							</Flex>
						</Flex>
						<Box mt="0.5" ml="2">
							{/* tweet */}
							<Text>{post?.text}</Text>
						</Box>
						{post?.image && (
							<Box mt="2">
								{/* CHua hinh user dang */}
								<Image
									onClick={() => router.push(`/${id}`)}
									rounded="2xl"
									src={post.image}
									alt="post image"
									maxHeight={{ base: "300", md: "600", lg: "700", xl: "800" }}
									maxWidth={{ base: "300", md: "500", lg: "600", xl: "700" }}
									objectFit="cover"
									_hover={{ opacity: "90%" }}
								/>
							</Box>
						)}
					</Flex>
				</Flex>
				<Flex mt="5" color="blue.400" align="center" justifyContent="center" gap="10">
					{/* Chứa các Icon comment,heart,share.... */}
					<Flex
						align="center"
						gap="2"
						onClick={(e) => {
							e.stopPropagation()
							setPostId(id)
							setIsOpen(!isOpen)
						}}
					>
						{/* show Modal Comment  */}

						{/* Chat Icon and length */}
						<Icon as={BsFillChatDotsFill} w="6" h="6" _hover={{ color: "green.400" }} />
						{comment.length > 0 && <Text> {comment.length} </Text>}
					</Flex>

					{/* Nếu user là người đăng tweet thì sẽ hiện ra ICON thùng rác */}
					{session.user.uid === post?.id ? (
						<Flex
							onClick={(e) => {
								e.stopPropagation()
								deleteDoc(doc(db, "posts", id))
								router.push("/")
							}}
						>
							<Icon as={BsFillTrashFill} w="6" h="6" _hover={{ color: "green.400" }} />
						</Flex>
					) : (
						<Box>
							<Icon as={HiOutlineSwitchHorizontal} w="6" h="6" _hover={{ color: "green.400" }} />
						</Box>
					)}
					{/* Nut like Post ,khi click se run likePost function*/}
					<Flex
						onClick={(e) => {
							e.stopPropagation()
							likePost()
						}}
					>
						{/* Nếu có Like thì show Heart Fill */}
						{liked ? (
							<Icon as={AiFillHeart} w="6" h="6" color="pink.400" _hover={{ color: "pink.400" }} />
						) : (
							<Icon as={AiOutlineHeart} w="6" h="6" _hover={{ color: "pink.400" }} />
						)}
						{likes.length > 0 && (
							<Text ml="1" fontWeight="semibold" color="pink.400">
								{likes.length}
							</Text>
						)}
					</Flex>
					{/* Nut share và nút chart, tạm thời chua có chức năng */}
					<Icon as={AiOutlineShareAlt} w="6" h="6" _hover={{ color: "green.400" }} />
					<Icon as={AiOutlineBarChart} w="6" h="6" _hover={{ color: "green.400" }} />
					<Icon as={BsThreeDots} w="6" h="6" _hover={{ color: "green.400" }} />
				</Flex>
			</Flex>
		</>
	)
}
export default Post
