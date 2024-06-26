<!-- src/components/Header.vue -->
<template>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="/">SurveyJS + Vue 3</a>
        </div>
        <ul class="nav navbar-nav">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/admin/users">User Manager</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  <style scoped>
  .navbar {
    margin-bottom: 20px;
  }
  </style>
  