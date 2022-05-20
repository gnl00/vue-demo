import { createApp } from 'vue'
import App from './App.vue'
import { Button, Input, Uploader } from '@varlet/ui'
import './assets/css/base.css'
import '@varlet/ui/es/style.js'

createApp(App)
  .use(Button)
  .use(Input)
  .use(Uploader)
  .mount('#app')
