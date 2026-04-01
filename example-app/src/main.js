import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import AppSection from './components/AppSection.vue';
import AppButton from './components/AppButton.vue';
import AppField from './components/AppField.vue';
import AppSelect from './components/AppSelect.vue';

const app = createApp(App);
app.component('AppSection', AppSection);
app.component('AppButton', AppButton);
app.component('AppField', AppField);
app.component('AppSelect', AppSelect);
app.mount('#app');
