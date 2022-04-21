import React, { useState, useEffect, useRef } from "react"

import { MdPhotoLibrary } from "react-icons/md"
import { RiEmotionHappyLine } from "react-icons/ri"
import { BiMailSend } from "react-icons/bi"
import { TiDelete } from "react-icons/ti"
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Text,
	Box,
	Flex,
	Image,
	Avatar,
	Textarea,
	Icon,
	Input,
	IconButton,
} from "@chakra-ui/react"
import { Picker } from "emoji-mart"

import { useRecoilState } from "recoil"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Moment from "react-moment"
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	addDoc,
	serverTimestamp,
	updateDoc,
} from "@firebase/firestore"

import { modalState, postIdState } from "../atom/modalAtom"
import { db } from "../firebase"

export const CommentModal = () => {
	const router = useRouter()
	const filePickerRef = useRef(null)
	const { data: session } = useSession()

	const [post, setPost] = useState()
	const [comment, setComment] = useState("")
	const [selectedFile, setSelectedFile] = useState(null)
	const [showEmoji, setShowEmoji] = useState(false)

	const [postId, setPostId] = useRecoilState(postIdState)
	const [isOpen, setIsOpen] = useRecoilState(modalState)

	console.log({ postId })

	// Fetch post from server
	useEffect(() => {
		if (postId) {
			onSnapshot(doc(db, "posts", postId), (snapshot) => {
				setPost(snapshot.data())
			})
		}
	}, [db, postId])

	const addImage = (e) => {
		const reader = new FileReader()
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0])
		}
		reader.onload = (readerEvent) => {
			setSelectedFile(readerEvent.target.result)
		}
	}

	const addEmoji = (e) => {
		let sym = e.unified.split("-")
		let codesArray = []
		sym.forEach((el) => codesArray.push("0x" + el))
		let emoji = String.fromCodePoint(...codesArray)
		setComment(comment + emoji)
	}

	const sendComment = async (e) => {
		e.preventDefault()

		await addDoc(collection(db, "posts", postId, "comments"), {
			comments: comment,
			username: session.user.name,
			tag: session.user.tag,
			userImg: session.user.image,
			timestamp: serverTimestamp(),
		})
		setIsOpen(false)
		setComment("")
		router.push(`/${postId}`)
	}

	return (
		<Box>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered motionPreset="scale" closeOnEsc size="lg">
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
				<ModalContent>
					<ModalHeader>
						{/* Nơi chứa ảnh,nội dung,username của user đăng bài, */}
						<Flex gap="4" align="center">
							<Avatar src={post?.userImg} w="50" h="50" />
							<Text>{post?.username}</Text>
							<Text color="gray.500" fontSize="13">
								@{post?.tag}
							</Text>
							<Text color="gray.700" fontSize="14">
								<Moment fromNow>{post?.timestamp?.toDate()}</Moment>
							</Text>
						</Flex>
					</ModalHeader>
					<ModalCloseButton fontSize="10" />
					<ModalBody>
						<Flex flexDirection="column">
							<Box borderBottom="1px" borderColor="gray.200">
								<Text>{post?.text}</Text>
							</Box>
							{/* Nơi chứa ảnh user đang login,textarea */}
							<Flex mt="5" gap="2">
								<Box>
									<Avatar src={session.user.image} w="40px" h="40px" />
								</Box>
								<Box w="full">
									<Textarea
										placeholder="Type something..."
										value={comment}
										rows="2"
										onChange={(e) => setComment(e.target.value)}
										variant="outline"
										minH="70px"
									/>
								</Box>
							</Flex>
							{selectedFile && (
								<Box>
									<Box>
										{/* Nút x để clear hình */}
										<Button variant="outlined" _hover={{ opacity: "80" }} onClick={() => setSelectedFile(null)}>
											<Icon as={TiDelete} w="5" h="5" _hover={{ w: "8", h: "8" }} />
										</Button>
										<Image src={selectedFile} alt="imagetweet" rounded="2xl" objectFit="contain" maxHeight="150px" />
									</Box>
								</Box>
							)}
							{/* Nơi chứa các Icon */}
							<Flex mt="5">
								<Box>
									<Button
										color="blue.400"
										variant="outlined"
										_hover={{ bg: "black", opacity: "50%" }}
										onClick={() => filePickerRef.current.click()}
									>
										<Icon as={MdPhotoLibrary} w="7" h="7" />
									</Button>
									<Input type="file" hidden onChange={addImage} ref={filePickerRef} />
								</Box>
								<Box>
									<Button
										variant="outlined"
										color="blue.400"
										_hover={{ opacity: "50%" }}
										onClick={() => setShowEmoji(!showEmoji)}
									>
										<Icon as={RiEmotionHappyLine} w="7" h="7" />
									</Button>
								</Box>
								<IconButton
									onClick={(e) => sendComment(e)}
									fontSize="25"
									ml="auto"
									color="blue.400"
									variant="outline"
									icon={<BiMailSend />}
								/>
							</Flex>
							{showEmoji && (
								<Box zIndex="10" pos="absolute" mt="180px" ml={{ sm: "20px", md: "50px" }}>
									<Picker onSelect={addEmoji} />
								</Box>
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	)
}
