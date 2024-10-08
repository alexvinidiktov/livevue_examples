// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix"
import { h } from "vue"
import { LiveSocket } from "phoenix_live_view"
import topbar from "topbar"
import { getHooks } from "live_vue"
import "../css/app.css"
import components from "../vue"
import "vite/modulepreload-polyfill"

// Integrate with PrimeVue
import PrimeVue from "primevue/config"
import { definePreset } from '@primevue/themes'
import Aura from "@primevue/themes/aura"
import Lara from "@primevue/themes/lara"
// import Nora from "@primevue/themes/nora"

// const MyPreset = definePreset(Aura, {
//     semantic: {
//         primary: {
//             50: '{indigo.50}',
//             100: '{indigo.100}',
//             200: '{indigo.200}',
//             300: '{indigo.300}',
//             400: '{indigo.400}',
//             500: '{indigo.500}',
//             600: '{indigo.600}',
//             700: '{indigo.700}',
//             800: '{indigo.800}',
//             900: '{indigo.900}',
//             950: '{indigo.950}'
//         }
//     }
// });

const Noir = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.500}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{zinc.950}',
                    inverseColor: '#ffffff',
                    hoverColor: '{zinc.900}',
                    activeColor: '{zinc.800}'
                },
                highlight: {
                    background: '{zinc.950}',
                    focusBackground: '{zinc.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '{zinc.50}',
                    inverseColor: '{zinc.950}',
                    hoverColor: '{zinc.100}',
                    activeColor: '{zinc.200}'
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
});

const initializeApp = ({ createApp, component, props, slots, plugin, el }) => {
    const app = createApp({ render: () => h(component, props, slots) })
    app.use(plugin)
    app.use(PrimeVue, { theme: { preset: Noir } })
    app.mount(el)
    return app
}

const hooks = {
    ...getHooks(components, { initializeApp }),
}

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, { hooks: hooks, params: { _csrf_token: csrfToken } })

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" })
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket
