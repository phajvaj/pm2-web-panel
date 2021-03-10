<template>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>Login form</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <Notification :message="error" v-if="error"/>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-text-field
                  v-model="username"
                  label="Username"
                  prepend-icon="mdi-email"
                  type="text"
                />

                <v-text-field
                  v-model="password"
                  prepend-icon="mdi-lock"
                  :append-icon="pwd_show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="pwd_show ? 'text' : 'password'"
                  label="Password"
                  @click:append="pwd_show = !pwd_show"
                  v-on:keyup="btn13($event)"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
</template>

<script>
  import Notification from '~/components/Notification'
  export default {
    middleware: 'guest',
    name: "login",
    loading: false,
    layout: "bank",
    head: {
      title: 'Login'
    },
    components: {
      Notification,
    },
    data () {
      return {
        pwd_show: false,
        valid: true,
        username: '',
        password: '',
        error: null
      }
    },
    methods: {
      btn13: function(e) {
        if (e.keyCode === 13) {
          this.validate();
        }
      },
      async validate () {
        this.$refs.form.validate();
        try {
          let rs = await this.$auth.loginWith('local', { data: {username: this.username, password: this.password} });
          //console.log(rs);
          if (rs.data.ok){
            const token = rs.data.token;
            //const httpHead = {headers: {Authorization: 'Bearer ' + token}};
            this.$auth.setToken(token, `Bearer`);
            this.$router.push('/');
          } else {
            this.error = rs.data.error;
          }
        } catch (err) {
          //console.log(err);
          this.error = err;
        }
      },
      reset () {
        this.$refs.form.reset()
      },
    },
    mounted() {
      if (this.$auth.loggedIn) {
        this.$router.push('/');
      }
    }
  }
</script>
