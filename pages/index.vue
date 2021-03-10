<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="10"
      class="elevation-1"
      loading
      loading-text="Loading... Please wait"
    >
      <v-toolbar-title>PM2 Panel Monitors countting: {{ timeter }} s.</v-toolbar-title>
      <template v-slot:item.status="{ item }">
        <v-chip :color="(item.pm2_env.status === 'online')? '#9EFB49' : '#FEC9C9'">{{ item.pm2_env.status }}</v-chip>
      </template>
      <template v-slot:item.restart="{ item }">
        {{ item.pm2_env.restart_time }}
      </template>
      <template v-slot:item.uptime="{ item }">
        {{ timing(item.pm2_env.pm_uptime) }}
      </template>
      <template v-slot:item.cpu="{ item }">
        {{ item.monit.cpu }} %
      </template>
      <template v-slot:item.memory="{ item }">
        {{ (item.monit.memory / (1024 * 1024 )).toFixed(2) }} MB
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small @click="refreshItem(item)" color="green" title="Refresh">mdi-refresh-circle</v-icon>
        <v-icon small @click="stopItem(item)" color="orange" title="Stop" v-if="item.pm2_env.status === 'online'">mdi-stop-circle</v-icon>
        <v-icon small @click="startItem(item)" color="green" title="Start" v-else>mdi-play-circle</v-icon>
        <v-icon small @click="deleteItem(item)" color="red" title="Delete">mdi-delete-alert</v-icon>
        <v-icon small @click="errorItem(item)" color="red" title="Show Log Error">mdi-alert-circle</v-icon>
        <v-icon small @click="outItem(item)" color="blue" title="Show Log Out">mdi-map-marker-alert</v-icon>
        <v-icon small @click="flushItem(item)" color="yellow" title="Flush Log">mdi-delete-empty</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>

    <v-dialog
      transition="dialog-top-transition"
      max-width="800"
      v-model="dialog"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >Show logs {{ logs.name }}</v-toolbar>
        <v-card-text>
          <code v-html="logs.data"></code>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            text
            @click="dialog = false"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    middleware: 'authenticated',
    head: {
      title: 'Monitor'
    },
    data () {
      return {
        timeter: 30,
        items: null,
        error: null,
        dialog: false,
        logs: {name: '', data: ''},
        headers: [
          { text: 'App name', align: 'center', sortable: false, value: 'name' },
          { text: 'ID', align: 'center', value: 'pm_id' },
          { text: 'PID', align: 'center', value: 'pid' },
          { text: 'Status', align: 'center', value: 'status' },
          { text: 'Restart', align: 'center', value: 'restart' },
          { text: 'Uptime', align: 'center', value: 'uptime' },
          { text: 'CPU', align: 'center', value: 'cpu' },
          { text: 'Mem', align: 'center', value: 'memory' },
          { text: 'Action', align: 'center', value: 'action', sortable: false },
        ],
        desserts: [],
      }
    },
    beforeCreate(){
      if (!this.$auth.loggedIn) {
        this.$router.push('/login');
      }
    },
    mounted() {
      this.initialize();

      setInterval(() => {
        this.timeter--;

        if (this.timeter == 0)
          this.initialize();
      }, 1000);
    },
    methods: {
      async initialize () {
        this.$axios.setToken(this.$auth.getToken('local'));
        const js = await this.$axios.get(`/list`);

        if (js.ok)
          this.desserts = js.rows;
        this.timeter = 30;
      },
      async refreshItem (item) {
        const swal = await this.$swal.fire({
          title: 'Are you sure refresh?',
          text: `You won't be able to revert this ${item.name}!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'OK'
        }).then((result) => {
          return result.value;
        });

        if (swal){
          this.$axios.setToken(this.$auth.getToken('local'));
          try {
            const form = {
              pid: item.pm_id
            };
            const res = await this.$axios.post(`/restart`, form);
            const js = res.data;
            if (js.ok){
              this.$toast.success('ดำเนินการเรียบร้อย', {icon: "done"});
              this.initialize();
            }
            else
              this.$toast.error(js.error, {icon: "error"});
          }catch (e) {
            console.log(e);
            this.$toast.error('เกิดข้อผิดพลาด', {icon: "error"});
          }
        }
      },
      async startItem (item) {
        const swal = await this.$swal.fire({
          title: 'Are you sure start?',
          text: `You won't be able to revert this ${item.name}!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'OK'
        }).then((result) => {
          return result.value;
        });

        if (swal){
          this.$axios.setToken(this.$auth.getToken('local'));
          try {
            const form = {
              pid: item.pm_id
            };
            const res = await this.$axios.post(`/start`, form);
            const js = res.data;
            if (js.ok){
              this.$toast.success('ดำเนินการเรียบร้อย', {icon: "done"});
              this.initialize();
            }
            else
              this.$toast.error(js.error, {icon: "error"});
          }catch (e) {
            console.log(e);
            this.$toast.error('เกิดข้อผิดพลาด', {icon: "error"});
          }
        }
      },
      async stopItem (item) {
        const swal = await this.$swal.fire({
          title: 'Are you sure stop?',
          text: `You won't be able to revert this ${item.name}!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'OK'
        }).then((result) => {
          return result.value;
        });

        if (swal){
          this.$axios.setToken(this.$auth.getToken('local'));
          try {
            const form = {
              pid: item.pm_id
            };
            const res = await this.$axios.post(`/stop`, form);
            const js = res.data;
            if (js.ok){
              this.$toast.success('ดำเนินการเรียบร้อย', {icon: "done"});
              this.initialize();
            }
            else
              this.$toast.error(js.error, {icon: "error"});
          }catch (e) {
            console.log(e);
            this.$toast.error('เกิดข้อผิดพลาด', {icon: "error"});
          }
        }
      },
      async flushItem (item) {
        const swal = await this.$swal.fire({
          title: 'Are you sure flush?',
          text: `You won't be able to revert this ${item.name}!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'OK'
        }).then((result) => {
          return result.value;
        });

        if (swal){
          this.$axios.setToken(this.$auth.getToken('local'));
          try {
            const form = {
              pid: item.pm_id
            };
            const res = await this.$axios.post(`/flush`, form);
            const js = res.data;
            if (js.ok){
              this.$toast.success('ดำเนินการเรียบร้อย', {icon: "done"});
              this.initialize();
            }
            else
              this.$toast.error(js.error, {icon: "error"});
          }catch (e) {
            console.log(e);
            this.$toast.error('เกิดข้อผิดพลาด', {icon: "error"});
          }
        }
      },
      async errorItem (item) {
        this.$axios.setToken(this.$auth.getToken('local'));
        try {
          const res = await this.$axios.get(`/log-error/${item.pm_id}/${item.name}`);
          const js = res.data;
          if (js.ok){
            this.$toast.success('ดำเนินการเรียบร้อย', {icon: "done"});
            this.logs = {
              name: 'Errors',
              data: js.logs.replace(/\n/g, '<br/>')
            };
            this.dialog = true;
          }else
            this.$toast.error(js.error, {icon: "error"});
        }catch (e) {
          console.log(e);
          this.$toast.error('เกิดข้อผิดพลาด', {icon: "error"});
        }
      },
      async outItem (item) {
        this.$axios.setToken(this.$auth.getToken('local'));
        try {
          const res = await this.$axios.get(`/log-out/${item.pm_id}/${item.name}`);
          const js = res.data;
          if (js.ok){
            this.$toast.success('ดำเนินการเรียบร้อย', {icon: "done"});
            this.logs = {
              name: 'Outs',
              data: js.logs.replace(/\n/g, '<br/>')
            };
            this.dialog = true;
          }
          else
            this.$toast.error(js.error, {icon: "error"});
        }catch (e) {
          console.log(e);
          this.$toast.error('เกิดข้อผิดพลาด', {icon: "error"});
        }
      },
      async deleteItem (item) {
        const swal = await this.$swal.fire({
          title: 'Are you sure?',
          text: `You won't be able to revert this ${item.name}!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'OK'
        }).then((result) => {
          return result.value;
        });

        if (swal){
          this.$axios.setToken(this.$auth.getToken('local'));
          try {
            const res = await this.$axios.delete(`/${item.pm_id}`);
            const js = res.data;
            if (js.ok){
              this.$toast.success('ดำเนินการเรียบร้อย', {icon: "done"});
              this.initialize();
            }
            else
              this.$toast.error(js.error, {icon: "error"});
          }catch (e) {
            console.log(e);
            this.$toast.error('เกิดข้อผิดพลาด', {icon: "error"});
          }
        }
      },
      timing: function (sec) {
        const date = new Date(null);
        const start = Date.now();
        date.setSeconds(Math.floor((start - sec) / 1000)); // specify value for SECONDS here
        return  date.toISOString().substr(11, 8);
      }
    }
  }
</script>
