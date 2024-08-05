<script lang="ts" setup>
import { SurveyCreatorModel } from "survey-creator-core"
import { getSurvey, updateSurvey } from "../models/survey"
import { useRoute } from "vue-router"
import { onMounted } from "vue"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase"
import "survey-core/survey.i18n.js"
import "survey-creator-core/survey-creator-core.i18n.js"
import "survey-core/defaultV2.css"
import "survey-creator-core/survey-creator-core.css"
import custom from "./survey_theme.json"
const router = useRoute()
const { id: surveyId } = router.params
let currentUser: any = {
  email: String,
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = { ...user }
  }
})
const creator = new SurveyCreatorModel({
  //   showLogicTab: true,
  showThemeTab: true,
  // showTranslationTab: true,
})

creator.isAutoSave = true
creator.saveSurveyFunc = async (saveNo, callback) => {
  await updateSurvey(`${surveyId}`, creator.JSON, currentUser?.email)
  callback(saveNo, true)
}

// creator.saveThemeFunc = (saveNo, callback) => {
//   console.log("🚀 ~ saveNo:", saveNo)
//   console.log("save theme, creator.theme", creator.theme)
//   console.log(
//     "save theme, creator.theme",
//     creator.theme.cssVariables?.["--sjs-font-family"]
//   )

// }

onMounted(async () => {
  const surveyData: any = await getSurvey(`${surveyId}`)
  creator.JSON = surveyData.survey.json
  if (surveyData.customization) {
    creator.theme = surveyData.customization as any
  }
})
</script>
<template>
  <div style="position: fixed; top: 52px; left: 0; width: 100vw; bottom: 0">
    <SurveyCreatorComponent
      :model="creator"
      class="body"
    ></SurveyCreatorComponent>
  </div>
</template>
