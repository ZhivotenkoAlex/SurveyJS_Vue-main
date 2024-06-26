<script lang="ts" setup>
import { SurveyCreatorModel } from 'survey-creator-core';
import { getSurvey, updateSurvey } from "../models/survey";
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/firebase";
const router = useRoute()
const { id: surveyId } = router.params;
let currentUser:any ={
    email:String
};
onAuthStateChanged(auth, (user) => {
    if(user){
        currentUser = {...user}
    }
})
const creator = new SurveyCreatorModel({
    showLogicTab: true,
    showThemeTab: true,
    showTranslationTab: true
});
creator.isAutoSave = true;
creator.saveSurveyFunc = async (saveNo, callback) => {
    await updateSurvey(`${surveyId}`, creator.JSON,currentUser?.email);
    callback(saveNo, true)
}

onMounted(async () => {
    const surveryData: { json: any } = await getSurvey(`${surveyId}`);
    creator.JSON = surveryData.json
})

</script>
<template>
    <div style="position: fixed; top: 52px; left: 0; width: 100vw; bottom: 0">
        <SurveyCreatorComponent :model="creator"></SurveyCreatorComponent>
    </div>
</template>