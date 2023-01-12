import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./assets/main.css";

// fontawesome
import {library} from "@fortawesome/fontawesome-svg-core";
import {faArrowUp, faArrowDown, faRepeat, faTrash} from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faRepeat, faArrowUp, faArrowDown)

const app = createApp(App);

app.use(createPinia())
app.use(Antd).mount('#app')
