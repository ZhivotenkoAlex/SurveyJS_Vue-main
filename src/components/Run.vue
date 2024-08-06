<template>
  <!-- <h1>{{ surveyData.name }}</h1>  -->
  <SurveyComponent class="body-custom" :model="survey" />
</template>
<script>
import { Model } from "survey-core"
import {
  getSurvey,
  postResult,
  getSurveyGamification,
  updateFan,
  createSurveyHistory,
  getCompany,
} from "../models/survey"
import "survey-core/defaultV2.css"
import { auth } from "@/firebase"
import { getCurrentUser, getUserData } from "@/models/users"

export default {
  data: () => ({
    surveyData: {},
    survey: null,
    custom: null,
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

      this.surveyData = data.survey
      this.survey = new Model(data.survey.json)
      const company = await getCompany(data.survey.companyId)
      if (company.layout_font_url && company.layout_font_font_type) {
        this.applyCustomFont(
          company.layout_font_url,
          company.layout_font_font_type,
          company.main_color
        )
      }

      const customStyles = {
        headerView: "basic",
        isPanelless: "true",
        themeName: "custom",
        cssVariables: {
          "--sjs-font-surveytitle-color": company.main_font_color,
          "--sjs-font-questiontitle-color": company.main_font_color,
          "--sjs-font-questiondescription-color": company.primary_font_color,
          "--sjs-primary-backcolor": company.main_color,
          "--sjs-primary-backcolor-light": `${company.main_color}1a`,
          "--sjs-general-forecolor-light": company.primary_font_color,
          "--sjs-general-backcolor-dim": company.layout_background_color_inner,
          "--sjs-primary-forecolor": company.main_font_color,
        },
      }

      this.custom = customStyles
      if (this.custom) {
        this.survey.applyTheme(this.custom)
      }
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

    applyCustomFont(url, family, main_color) {
      const style = document.createElement("style")
      style.innerHTML = `
        @import url('${url}');

        * {
            font-family: '${family}', sans-serif !important;
          }
        .container-fluid {
          background-color: ${main_color} !important;
        }
      `
      document.head.appendChild(style)
    },
  },
}
</script>

<style scoped>
.body-custom :deep(.sd-body) {
  padding-left: 12px;
  /* padding-right: 10px; */
  /* padding-left: 0; */
  padding-right: 0;
}

.body-custom :deep(.sd-page) {
  padding: 0 calc(1 * (var(--sjs-base-unit, var(--base-unit, 8px))));
  /* padding-right: 0; */
}

/* .body-custom :deep(.sd-btn) {
  color: #fff;
} */

/* .body-custom :deep(.sd-title) {
  font-family: "Popins";
} */

.body-custom :deep(.sd-action-bar) {
  justify-content: center;
}
</style>
