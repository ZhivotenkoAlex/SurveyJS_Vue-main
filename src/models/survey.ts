import { db } from "@/firebase"
import { Timestamp } from "@firebase/firestore"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
export async function getSurveyLists() {
  const surveys = await getDocs(collection(db, "surveys"))
  const documents = surveys.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  return documents
}
export async function getCompanyInfo(id) {
  const companyDoc = await getDoc(doc(db, "company_users", id))
  return companyDoc.exists()
    ? { id: companyDoc.id, ...companyDoc.data() }
    : null
}
export async function getCompanySurvey(companyId: String) {
  const Collection = collection(db, "surveys")
  const q = query(Collection, where("companyId", "==", companyId))
  const querySnapshot = await getDocs(q)
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  return documents
}

export async function getCompanyBondedSurvey(companyId: String) {
  const gamificationCollection = collection(db, "gamification")
  const gamificationQuery = query(
    gamificationCollection,
    where("company_id", "==", companyId)
  )
  const gamificationSnapshot = await getDocs(gamificationQuery)
  const bondedSurveysIds = gamificationSnapshot.docs.map(
    (doc) => doc.data().survey_id
  )

  const surveysCollection = collection(db, "surveys")
  const surveysQuery = query(
    surveysCollection,
    where("companyId", "==", companyId)
  )
  const querySnapshot = await getDocs(surveysQuery)
  const documents = querySnapshot.docs
    .filter((doc) => bondedSurveysIds.includes(doc.id))
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  return documents
}

export async function getSurveyGamification(
  surveyId: String,
  companyId: String
) {
  const Collection = collection(db, "gamification")
  const q = query(
    Collection,
    where("survey_id", "==", surveyId),
    where("company_id", "==", companyId)
  )
  const querySnapshot = await getDocs(q)
  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  return documents[0] ?? null
}

export async function createSurvey(newObj: any) {
  const doc = await addDoc(collection(db, "surveys"), newObj)
  return { id: doc.id, name: newObj["name"], json: newObj["json"] }
}
export async function removeSurvey(id: string) {
  await deleteDoc(doc(db, "surveys", id))
}
export async function updateSurvey(id: string, json: any, companyId: string) {
  await updateDoc(doc(db, "surveys", id), { json: json, companyId })
}

export async function getFan(userId: string, companyId: string) {
  try {
    const Collection = collection(db, "fans")
    const q = query(
      Collection,
      where("user_id", "==", userId),
      where("company_id", "==", companyId)
    )
    const querySnapshot = await getDocs(q)
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any

    return documents[0] ?? null
  } catch (error) {
    console.log("🚀 ~ getFan ~ error:", error)
  }
}

export async function updateFan(
  userId: string,
  companyId: string,
  points: string
) {
  try {
    const fan = await getFan(userId, companyId)
    const prevPoints = fan?.money
    const currentPoints = parseInt(prevPoints) + parseInt(points)
    await updateDoc(doc(db, "fans", fan?.id), { money: currentPoints })
  } catch (error) {
    console.log("🚀 ~ error:", error)
  }
}

export async function createSurveyHistory(
  userId: string,
  companyId: string,
  gamificationId: string,
  points: number
) {
  const data = {
    company_id: companyId,
    date: Timestamp.now(),
    delta: null,
    foreign_id: "",
    gamification_id: gamificationId,
    money: points,
    partner_company_id: "",
    personal_number: null,
    points_type_id: "",
    reason: "",
    type: "S",
    user_id: userId,
  }
  await addDoc(collection(db, "personal-number-history"), data).catch(
    (error) => {
      console.error("Error adding document: ", error)
    }
  )
}

export async function getSurvey(id: any) {
  const surveyDoc = await getDoc(doc(db, "surveys", id))
  return surveyDoc.exists()
    ? { id: surveyDoc.id, ...(surveyDoc.data() as any) }
    : null
}
export async function postResult(id: string, json: any, userId: string) {
  await addDoc(collection(db, "results"), { json: json, userId })
}

export async function getResults(id: string) {
  const surveys = await getDocs(collection(db, "results"))
  const documents = surveys.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  const filteredResults = [...documents]
    .filter((a) => a["json"]["postid"] === id)
    .map((item) => item["json"]["surveyResultText"])
  return filteredResults
}
