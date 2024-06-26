<!-- src/components/Header.vue -->
<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <img src='/assets/logo.svg' class="" alt="logo" height="50px">
      </div>
      <ul class="nav navbar-nav">
        <li v-if="isLoggedIn && role == 'user'">
          <router-link to="#" class="white" @click="gotoSurvey">Surveys</router-link>
        </li>
        <li v-if="isLoggedIn && role == 'company'">
          <router-link to="my_survey" class="white">My Survey</router-link>
        </li>
        <li>
          <router-link to="#" @click="gotoAbout">About</router-link>
        </li>
        <li v-if="isLoggedIn">
          <router-link to="#" @click="_signOut">Logout</router-link>
        </li>
        <li v-if="isLoggedIn && role == 'company'">
          <router-link to="#" @click="dialog = true">Get Invite Link</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="login">Login</router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="register">Register</router-link>
        </li>
      </ul>
    </div>
  </nav>

  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="400" prepend-icon="mdi-book"
      text="Please click to copy invite link following button." title="Copy Inivete link.">
      <button v-clipboard="() => inviteLink">
        Copy to clipboard
      </button>


      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
export default {
  data() {
    return {
      dialog: false,
      value:'234234234234'
    }
  },
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '@/models/users';
import { getCompanyInfo } from '../models/company_users'


const router = useRouter()
const isLoggedIn = ref(false)
var role = 'false';
const inviteLink = ref('');
onAuthStateChanged(auth, async (user) => {
  if (user) {
    role = await getCurrentUser(user.email);
    const companyInfo = await getCompanyInfo(user.email);    
    inviteLink.value = `${location.origin}/${companyInfo?.id}/register`
  }
  isLoggedIn.value = !!user;
})
const _signOut = () => {
  signOut(auth).then(() => {
    if(role == 'company'){
      router.push('/login');
    }else{
      const uid = router.currentRoute.value.params
      router.push(`/${uid.id}/login`);
    }
  }).catch((error) => {
    console.error("Error signing out:", error)
  })
}
const gotoSurvey = ()=>{
  if(role == 'company'){
      // router.push('/');
    }else{
      const uid = localStorage.getItem('baseUrl')
      router.push(`/${uid}/survey`);
    }
}
const gotoAbout = ()=>{
  if(role == 'company'){
      router.push('/about');
    }else{
      const uid = localStorage.getItem('baseUrl')
      router.push(`/${uid}/about`);
    }
}
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

.container-fluid {
  background-color: #19b394;
}

.navbar-nav li a {
  color: white;
  font-size: 22px;
}
</style>