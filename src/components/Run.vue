<template>
    <h1>{{ surveyData.name }}</h1>
    <SurveyComponent :model="survey" />
</template>
<script>

import { Model, StylesManager } from 'survey-core'
import { getSurvey, postResult } from '../models/survey';
import 'survey-core/defaultV2.css';
import { auth } from "@/firebase";
import { getCurrentUser } from '@/models/users';

StylesManager.applyTheme("defaultV2");

export default {
    data: () => ({
        surveyData: {},
        survey: null,
        user: {},
        role:'user'
    }),
    created() {
        this.initialize();
    },
    methods: {
        async initialize() {
            const { id: surveyId } = this.$route.params
            const data = await getSurvey(`${surveyId}`);
            this.surveyData = data;
            this.survey = new Model(data.json);
            try {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        this.role = await getCurrentUser(user.email);
                        this.user = { ...user };
                    } else {
                        this.user = {  };
                    }
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
            this.survey.onComplete.add(async (sender) => {
                const json = {
                    postid: surveyId,
                    surveyResult: sender.data,
                    surveyResultText: JSON.stringify(sender.data),
                    timestamp: new Date()
                }
                if(this.role ===  'user')await postResult(surveyId, json,this.user.email)
            })
        }
    },

}
</script>