<template>
  <div>
    <v-app-bar app flat color="primary">
      <v-app-bar-nav-icon
        id="nav-drawer-button"
        @click.stop="drawer = !drawer"
        class="mr-2"
      />
      <span class="brand">PermaHub</span>
      <v-spacer />
      <user-menu :email="getEmail" :menu="menu" />
    </v-app-bar>

    <v-navigation-drawer
      id="app-bar-drawer"
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item>
            <v-list-item-title>Foo</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import UserMenu from "./userMenu";
import { mapGetters } from "vuex";

export default {
  name: "AppBar",
  components: { UserMenu },
  data: () => ({
    drawer: false,
    group: null,
    menu: [
      {
        title: "Profile",
        link: "/users/profile",
      },
    ],
  }),
  computed: {
    ...mapGetters("users", ["getEmail"]),
  },
};
</script>