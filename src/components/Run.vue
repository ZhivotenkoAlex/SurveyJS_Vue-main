<template>
  <h1>{{ surveyData.name }}</h1>
  <SurveyComponent :model="survey" />
</template>
<script>
import { Model, StylesManager } from "survey-core"
import {
  getSurvey,
  postResult,
  getSurveyGamification,
  updateFan,
  createSurveyHistory,
} from "../models/survey"
import "survey-core/defaultV2.css"
import { auth } from "@/firebase"
import { getCurrentUser, getUserData } from "@/models/users"

StylesManager.applyTheme("defaultV2")

export default {
  data: () => ({
    surveyData: {},
    survey: null,
    user: {},
    userEmail: null,
    role: "user",
  }),
  created() {
    this.initialize()
  },
  methods: {
    async initialize() {
      const { id: surveyId } = this.$route.params

      const data = await getSurvey(`${surveyId}`)
      this.surveyData = data
      this.survey = new Model(data.json)
      try {
        const userId = localStorage.getItem("userId")

        if (userId) {
          const user = await getUserData(userId)
          this.userEmail = user.contact_email
          this.role = await getCurrentUser(this.userEmail)
          this.user = { ...user }
        } else {
          auth.onAuthStateChanged(async (user) => {
            if (user) {
              this.role = await getCurrentUser(user.email)
              this.user = { ...user }
            } else {
              this.user = {}
            }
          })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
      this.survey.onComplete.add(async (sender) => {
        try {
          const gamification = await getSurveyGamification(
            surveyId,
            this.surveyData.companyId
          )
          const points = parseInt(gamification?.points)
          const json = {
            postid: surveyId,
            surveyResult: sender.data,
            surveyResultText: JSON.stringify(sender.data),
            timestamp: new Date(),
            points: points ?? 0,
          }

          updateFan(this.user.id, this.surveyData.companyId, points ?? 0)

          createSurveyHistory(
            this.user.id,
            this.surveyData.companyId,
            gamification.id,
            points ?? 0
          )

          if (this.role === "user" && this.userEmail) {
            await postResult(surveyId, json, this.user.id)
          } else {
            await postResult(surveyId, json, this.user.email)
          }
        } catch (error) {
          console.error("Error posting survey result:", error)
        }
      })
    },
  },
}
</script>
