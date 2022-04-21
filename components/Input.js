import React, { useState, useRef } from "react"
import { Flex, Box, Avatar, Textarea, Icon, Button, Image, Input, Skeleton } from "@chakra-ui/react"
import { TiDelete } from "react-icons/ti"
import { MdPhotoLibrary } from "react-icons/md"
import { RiBarChartHorizontalFill, RiEmotionHappyLine, RiCalendarCheckLine } from "react-icons/ri"
import "emoji-mart/css/emoji-mart.css"
import { Picker } from "emoji-mart"

import { db, storage } from "../firebase"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "@firebase/firestore"
import { getDownloadURL, ref, uploadString } from "@firebase/storage"
import { useSession } from "next-auth/react"

const InputTweet = () => {
	const { data: session } = useSession()

	const [tweet, setTweet] = useState("")
	const [selectedFile, setSelectedFile] = useState(null)
	const [showEmoji, setShowEmoji] = useState(false)
	const [loading, setLoading] = useState(false)

	const filePickerRef = useRef(null)

	// Khi chưa có dòng tweet và hình ảnh thì nút post tweet sẽ bị ẩn
	const isDisabled = !tweet.trim() && !selectedFile

	// Add Image to tweet
	const addImage = (e) => {
		const reader = new FileReader()
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0])
		}
		reader.onload = (readerEvent) => {
			setSelectedFile(readerEvent.target.result)
		}
	}

	//Add Emoji to tweet function
	const addEmoji = (e) => {
		let sym = e.unified.split("-")
		let codesArray = []
		sym.forEach((el) => codesArray.push("0x" + el))
		let emoji = String.fromCodePoint(...codesArray)
		setTweet(tweet + emoji)
	}

	// Send post function, will send data to sever Firebase
	const sendPost = async () => {
		if (loading) return
		setLoading(true)
		// Tạo collection cho database Firebase
		const docRef = await addDoc(collection(db, "posts"), {
			id: session.user.uid,
			username: session.user.name,
			userImg: session.user.image,
			tag: session.user.tag,
			text: tweet,
			timestamp: serverTimestamp(),
		})
		const imageRef = ref(storage, `posts/${docRef.id}/image`)

		if (selectedFile) {
			await uploadString(imageRef, selectedFile, "data_url").then(async () => {
				const downloadURL = await getDownloadURL(imageRef)
				await updateDoc(doc(db, "posts", docRef.id), {
					image: downloadURL,
				})
			})
		}
		setLoading(false)
		setTweet("")
		setSelectedFile(null)
		setShowEmoji(false)
	}

	//================================================================================================

	return (
		<Flex flexDirection="column" p="3">
			<Flex gap="5">
				<Box>
					<Avatar _hover={{ opacity: "50%" }} name="avatar" size="lg" src={session.user.image} />
				</Box>
				<Box w="550px">
					<Textarea
						placeholder="Type something..."
						value={tweet}
						rows="3"
						onChange={(e) => setTweet(e.target.value)}
						variant="unstyled"
						minH="80px"
					/>
					{/* Hình preview hiện ra khi đã chọn hình */}
					{selectedFile && (
						<Box>
							<Box>
								{/* Nút x để clear hình */}
								<Button variant="outlined" _hover={{ opacity: "80" }} onClick={() => setSelectedFile(null)}>
									<Icon as={TiDelete} w="5" h="5" _hover={{ w: "8", h: "8" }} />
								</Button>
								<Image src={selectedFile} alt="imagetweet" rounded="2xl" objectFit="contain" maxHeight="60" />
							</Box>
						</Box>
					)}
				</Box>
			</Flex>
			{loading && <Skeleton startColor="green.500" endColor="orange.500" height="5px" mt="8px" />}
			{/* Nơi chứa Tất cã Icon upload image,emoji..chỉ hiện ra khi loading xong khi bấm nút */}
			{!loading && (
				<Flex mt="2">
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
						<Button color="blue.400" variant="outlined" _hover={{ opacity: "50%" }}>
							<Icon as={RiBarChartHorizontalFill} w="7" h="7" />
						</Button>
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
					<Box>
						<Button variant="outlined" color="blue.400" _hover={{ opacity: "50%" }}>
							<Icon as={RiCalendarCheckLine} w="7" h="7" />
						</Button>
					</Box>
					<Button
						color="white"
						ml="auto"
						bg="#1d9bf0"
						rounded="3xl"
						px="7"
						fontWeight="900"
						_hover={{ bg: "blue.500" }}
						onClick={sendPost}
						disabled={isDisabled}
					>
						Tweet
					</Button>
					{/* Show Emoji when click on Happy Face */}
					{showEmoji && (
						<Box zIndex="10" pos="absolute" mt="50px" ml={{ sm: "20px", md: "50px" }}>
							<Picker onSelect={addEmoji} theme="dark" />
						</Box>
					)}
				</Flex>
			)}
		</Flex>
	)
}

export default InputTweet
