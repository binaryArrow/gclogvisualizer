import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./assets/main.css";

// fontawesome
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faArrowUp, faArrowDown, faTrash} from "@fortawesome/free-solid-svg-icons";

library.add(faArrowUp, faArrowDown, faTrash)

const app = createApp(App);

app.use(createPinia())
app.use(Antd).mount('#app')
