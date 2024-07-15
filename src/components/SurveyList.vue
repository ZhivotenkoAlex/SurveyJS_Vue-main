<template>
  <v-container>
    <div v-for="survey in surveyList" :key="survey.id">
      <v-row>
        <v-col cols="4" sm="4" md="4">
          <div class="text-body-1">{{ survey.name }}</div>
        </v-col>
        <v-col cols="8" sm="8" md="8">
          <v-btn
            class="ma-2"
            :loading="loading"
            :disabled="loading"
            color="secondary"
            @click="runSurvey(survey.id)"
          >
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

    <div v-if="error">
      <v-alert type="error" dismissible> Error fetching user </v-alert>
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
import { getCompanyInfo, getCompanySurvey } from "@/models/survey"
import { auth } from "@/firebase"
import { getCurrentUser, fetchUserData } from "@/models/users"
import { getParamFromUrl } from "@/utils"

export default {
  data: () => ({
    surveyList: [],
    user: { role: 123 },
    error: false,
  }),
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      ;(async () => {
        const access_token = getParamFromUrl("access_token")
        try {
          if (access_token) {
            const user = await fetchUserData(access_token)

            if (user) {
              const getRole = await getCurrentUser(user.email)
              this.user = { ...user, role: getRole }
            } else {
              this.user = null
              this.error = true
            }
          } else {
            auth.onAuthStateChanged(async (user) => {
              if (user) {
                const getRole = await getCurrentUser(user.email)
                this.user = { ...user, email: user.email, role: getRole }
              } else {
                this.user = { role: 123 }
              }
            })
          }

          if (this.user) {
            const userCompanyId = this.$route.params.id
            const companyInfo = await getCompanyInfo(userCompanyId)
            const companyId = companyInfo.company_id
              ? companyInfo.company_id
              : companyInfo.email
            const surveyLists = await getCompanySurvey(companyId)
            this.surveyList = surveyLists
          }
        } catch (error) {
          console.error("Error fetching user:", error)
        }
      })()
    },
    runSurvey(uid) {
      this.$router.push(`/run/${uid}`)
    },
  },
}
</script>
