<template>
  <v-menu bottom left close-on-click offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="menu-button" icon v-bind="attrs" v-on="on">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>

    <v-list min-width="200">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="grey--text text--darken-1 text-center"
            >Account</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item id="menu__user-profile">
        <v-list-item-content>
          <v-list-item-title>{{ email }}</v-list-item-title>
          <v-list-item-subtitle>{{ name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item-group id="menu__content">
        <v-list-item
          v-for="menuItem in menu"
          :key="'user_menu_' + menuItem.title"
          :href="menuItem.link"
        >
          <v-list-item-content>{{ menuItem.title }}</v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-content> Logout </v-list-item-content>
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: "UserMenu",
  props: {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: "(name)",
    },
    menu: {
      type: Array,
      required: true,
    },
  },
};
</script>