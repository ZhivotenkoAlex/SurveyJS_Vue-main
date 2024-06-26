<template>
    <v-container>
        <div v-for="survey in surveyList" :key="survey.id">
            <v-row>
                <v-col cols="4" sm="4" md="4">
                    <div class="text-body-1	">{{ survey.name }}</div>
                </v-col>
                <v-col cols="8" sm="8" md="8">
                    <v-btn class="ma-2" :loading="loading" :disabled="loading" color="secondary"
                        @click="runSurvey(survey.id)">
                        Preview
                    </v-btn>
                    <v-btn  :loading="loading3" :disabled="loading3" color="blue-grey"
                        class="ma-2 white--text" @click="editSurvey(survey.id)">
                        Edit
                    </v-btn>
                    <v-btn  class="ma-2" :loading="loading2" :disabled="loading2"
                        color="success" @click="resultSurvey(survey.id)">
                        Results
                        <template v-slot:loader>
                            <span>Loading...</span>
                        </template>
                    </v-btn>
                    <v-btn  class="ma-2" :loading="loading4" :disabled="loading4"
                        color="red" @click="_removeSurvey(survey.id)">
                        Remove
                        <template v-slot:loader>
                            <span class="custom-loader">
                                <v-icon light>mdi-cached</v-icon>
                            </span>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <v-btn  class="ma-2" :loading="loading4" :disabled="loading4" color="success"
            @click="addSurvey">
            Add Survey
            <template v-slot:loader>
                <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                </span>
            </template>
        </v-btn>
    </v-container>
</template>
<script>
import { getSurveyLists, createSurvey, removeSurvey, getCompanySurvey } from '@/models/survey';
import { auth } from "@/firebase";
import { getCurrentUser } from '@/models/users';

export default {

    data: () => ({
        surveyList: [],
        user: { role: 123 }
    }),
    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            (async () => {

                try {
                    auth.onAuthStateChanged(async (user) => {
                        if (user) {
                            const surveyLists = await getCompanySurvey(user.email);
                            this.surveyList = surveyLists;
                            const getRole = await getCurrentUser(user.email);
                            this.user = { ...user, role: getRole };
                        } else {
                            this.user = { role: 123 };
                        }
                    });
                } catch (error) {
                    console.error('Error fetching user:', error);
                }

            })();
        },
        async addSurvey() {
            const newObj = {
                name: `New Survey ${[...this.surveyList].length + 1} `,
                companyId: this.user.email,
                json: "{}"
            };
            const updatedLists = [...this.surveyList, newObj];
            this.surveyList = [...updatedLists];
            await createSurvey({ ...newObj });
        },
        async _removeSurvey(uid) {
            const currentList = [...this.surveyList];
            const removedList = currentList.filter(list => list.id !== uid);
            this.surveyList = [...removedList];
            await removeSurvey(uid);
        },
        editSurvey(uid) {
            this.$router.push(`/edit/${uid}`);
        },
        runSurvey(uid) {
            this.$router.push(`/run/${uid}`);
        },
        resultSurvey(uid) {
            this.$router.push(`/result/${uid}`);
        }
    }
}
</script>