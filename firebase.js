// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBVJKQ0w-vCd-UjLJgD6qsnBk_1DezwDhY",
	authDomain: "twister-eea1a.firebaseapp.com",
	projectId: "twister-eea1a",
	storageBucket: "twister-eea1a.appspot.com",
	messagingSenderId: "702698516185",
	appId: "1:702698516185:web:e2d57619793372ae8298c8",
	measurementId: "G-7YJZQ0M4LB",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export default app
export { db, storage }
