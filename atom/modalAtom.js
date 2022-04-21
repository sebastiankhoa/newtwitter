import { atom } from "recoil"

export const modalState = atom({
	key: "modal",
	default: false,
})

export const postIdState = atom({
	key: "postId",
	default: "",
})
