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
                        Run
                    </v-btn>
                    <!-- <v-btn v-if="user.role == 'company'" :loading="loading3" :disabled="loading3" color="blue-grey"
                        class="ma-2 white--text" @click="editSurvey(survey.id)">
                        Edit
                    </v-btn>
                    <v-btn v-if="user.role == 'company'" class="ma-2" :loading="loading2" :disabled="loading2"
                        color="success" @click="resultSurvey(survey.id)">
                        Results
                        <template v-slot:loader>
                            <span>Loading...</span>
                        </template>
                    </v-btn>
                    <v-btn v-if="user.role == 'company'" class="ma-2" :loading="loading4" :disabled="loading4"
                        color="red" @click="_removeSurvey(survey.id)">
                        Remove
                        <template v-slot:loader>
                            <span class="custom-loader">
                                <v-icon light>mdi-cached</v-icon>
                            </span>
                        </template>
                    </v-btn> -->
                </v-col>
            </v-row>
        </div>
        <!-- <v-btn v-if="user.role == 'company'" class="ma-2" :loading="loading4" :disabled="loading4" color="success"
            @click="addSurvey">
            Add Survey
            <template v-slot:loader>
                <span class="custom-loader">
                    <v-icon light>mdi-cached</v-icon>
                </span>
            </template>
        </v-btn> -->
    </v-container>
</template>
<script>
import { getSurveyLists,getCompanyInfo,getCompanySurvey } from '@/models/survey';
import { auth } from "@/firebase";
import { getCurrentUser } from '@/models/users';

export default {

    data: () => ({
        surveyList: [],
        user:{role:123}
    }),
    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            (async () => {
                const companyId = this.$route.params.id
                const companyInfo = await getCompanyInfo(companyId);
                const surveyLists = await getCompanySurvey(companyInfo.email)
                this.surveyList = surveyLists;
                try {
                    auth.onAuthStateChanged(async(user) => {
                        if (user) {
                            const getRole = await getCurrentUser(user.email);
                            this.user = {...user,role:getRole};
                        } else {
                            this.user = {role:123};
                        }
                    });
                } catch (error) {
                    console.error('Error fetching user:', error);
                }

            })();
        },
        runSurvey(uid) {
            this.$router.push(`/run/${uid}`);
        },
    }
}
</script>