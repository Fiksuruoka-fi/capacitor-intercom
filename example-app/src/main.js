import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Section from './components/Section.vue'
import Button from './components/Button.vue'
import Field from './components/Field.vue'
import Select from './components/Select.vue'

const app = createApp(App)
app.component('Section', Section)
app.component('Button', Button)
app.component('Field', Field)
app.component('Select', Select)
app.mount('#app')
