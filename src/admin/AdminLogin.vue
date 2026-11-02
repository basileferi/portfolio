<template>
  <div class="login">
    <form class="login-card" novalidate @submit.prevent="submit">
      <p class="login-brand">Kosmo<span>.</span> Studio</p>
      <h1 class="login-title">Connexion</h1>
      <p class="login-sub">Espace privé de gestion des projets.</p>

      <p v-if="message" class="login-msg" :class="{ error: isError }" role="alert">{{ message }}</p>

      <label class="adm-label" for="login-user">Identifiant</label>
      <input
        id="login-user"
        ref="userInput"
        v-model.trim="username"
        class="adm-input"
        autocomplete="username"
        autocapitalize="none"
        spellcheck="false"
        required
      />

      <label class="adm-label" for="login-pass">Mot de passe</label>
      <div class="login-pass">
        <input
          id="login-pass"
          v-model="password"
          class="adm-input"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
        />
        <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" :aria-pressed="showPassword" @click="showPassword = !showPassword">
          {{ showPassword ? 'Masquer' : 'Afficher' }}
        </button>
      </div>

      <button type="submit" class="adm-btn adm-btn--primary login-submit" :disabled="busy || !username || !password">
        <span v-if="busy" class="adm-spinner" aria-hidden="true" />
        {{ busy ? 'Connexion…' : 'Se connecter' }}
      </button>

      <RouterLink to="/" class="login-back">← Retour au site</RouterLink>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from './api'
import { sfx } from '@/composables/useSound'

const props = defineProps({ notice: { type: String, default: '' } })
const emit = defineEmits(['logged-in'])

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const busy = ref(false)
const message = ref(props.notice)
const isError = ref(false)
const userInput = ref(null)

async function submit() {
  if (busy.value || !username.value || !password.value) return
  busy.value = true
  message.value = ''
  try {
    const me = await api.login(username.value, password.value)
    password.value = ''
    sfx.success()
    emit('logged-in', me)
  } catch (err) {
    isError.value = true
    message.value = err.message
    password.value = ''
    sfx.error()
  } finally {
    busy.value = false
  }
}

onMounted(() => userInput.value?.focus())
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background:
    radial-gradient(60rem 40rem at 80% -10%, rgba(137, 126, 255, 0.18), transparent 60%),
    radial-gradient(40rem 30rem at -10% 110%, rgba(137, 126, 255, 0.1), transparent 60%),
    var(--a-bg);
}
.login-card {
  width: min(100%, 400px);
  padding: 2.25rem;
  border-radius: 18px;
  border: 1px solid var(--a-line);
  background: rgba(24, 25, 24, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.login-brand { font-family: var(--font-display), sans-serif; font-size: 1.1rem; margin-bottom: 1.75rem; }
.login-brand span { color: var(--a-accent); }
.login-title { font-size: 1.6rem; margin: 0; }
.login-sub { color: var(--a-soft); margin: 0.25rem 0 1.5rem; font-size: 0.9rem; }
.login-msg { margin: 0 0 1rem; padding: 0.7rem 0.85rem; border-radius: 8px; background: rgba(137, 126, 255, 0.12); font-size: 0.88rem; }
.login-msg.error { background: rgba(255, 107, 107, 0.12); color: #ffb3b3; }
.adm-label { margin-top: 1rem; }
.login-pass { display: flex; gap: 0.5rem; align-items: center; }
.login-submit { width: 100%; height: 2.9rem; margin-top: 1.5rem; font-size: 0.95rem; }
.login-back { display: inline-block; margin-top: 1.25rem; font-size: 0.85rem; color: var(--a-soft); }
.login-back:hover { color: var(--a-text); }
</style>
