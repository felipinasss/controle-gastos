import { registerSW } from 'virtual:pwa-register'

/** Registra o service worker para uso offline */
export function registerServiceWorker() {
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl) {
      console.info('[pwa] service worker registrado:', swUrl)
    },
    onRegisterError(error) {
      console.warn('[pwa] falha ao registrar service worker', error)
    },
  })
}
