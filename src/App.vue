<template>
  <v-app id="app">
    <app-bar />
    <v-main>
      <v-container fill-height fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "./components/appBar";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: { AppBar },
  methods: {
    ...mapActions("users", ["loadUser"]),
  },
  created() {
    this.loadUser();
  },
};
</script>
