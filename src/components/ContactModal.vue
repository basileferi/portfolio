<template>
  <div class="modal-content">
    <div class="modal-header">
      <p class="modal-subtitle">
        Discutons ensemble, je suis certain de pouvoir être un atout pour votre équipe.
      </p>
      <button class="close-btn" @click="$emit('close')" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <form
        class="modal-form"
        action="https://formspree.io/f/mqaqaabz"
        method="POST"
    >
      <div class="grid-form">
        <div>
          <label for="firstName">Prénom</label>
          <input id="firstName" type="text" name="firstName" placeholder="Prénom" required />
        </div>
        <div>
          <label for="lastName">Nom</label>
          <input id="lastName" type="text" name="lastName" placeholder="Nom" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input id="email" type="email" name="email" placeholder="Email" required />
        </div>
        <div>
          <label for="telephone">Téléphone</label>
          <input id="telephone" type="tel" name="telephone" placeholder="Téléphone" />
        </div>
      </div>

      <div class="message-field">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="3" placeholder="Votre message..." required></textarea>
      </div>

      <div class="modal-footer">
        <div class="social-links flex items-center gap-4 sm:gap-5">

          <!-- LinkedIn -->
          <a href="https://linkedin.com/in/basileferi"
             target="_blank"
             rel="noopener noreferrer"
             class="flex items-center gap-1.5 text-white hover:text-gray-300 transition-colors"
             aria-label="LinkedIn">

            <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg"
                class="w-2.5 h-2.5 invert opacity-90"
                alt="LinkedIn">

            <span class="text-[0.65rem] font-nord font-thin leading-none">LinkedIn</span>
          </a>

          <!-- GitHub -->
          <a href="https://github.com/basileferi"
             target="_blank"
             rel="noopener noreferrer"
             class="flex items-center gap-1.5 text-white hover:text-gray-300 transition-colors"
             aria-label="GitHub">

            <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"
                class="w-2.5 h-2.5 invert opacity-90"
                alt="GitHub">

            <span class="text-[0.65rem] font-nord font-thin leading-none">GitHub</span>
          </a>

        </div>
        <button @click="copyToClipboard" class="btn-inner"><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>Copier mon Mail</title><g id="copy_line" fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F9F9F9FF' d='M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z'/></g></svg>
          Email</button>


        <animated-button type="submit" class="submit-btn modal-animated-btn">Envoyer</animated-button>
      </div>
    </form>
  </div>
</template>

<script setup>
import AnimatedButton from "@/components/AnimatedButton.vue";
import { useModalStore } from '@/stores/useModalStore'
const modal = useModalStore()

const MailToCopy = "basileferi.pro@proton.me";

function copyToClipboard() {
  navigator.clipboard.writeText(MailToCopy)
      .then(() => {
        alert("Email basileferi.pro@proton.me copié dans le presse-papiers !");
      })
      .catch(console.error);
}
</script>

<style scoped>
.modal-content {
  position: relative;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  background: var(--color-bg);
  color: var(--color-text);
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-subtitle {
  font-size: 0.9rem;
  font-style: italic;
  flex: 1;
}


.close-btn {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.25rem;
}

.modal-form label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.modal-form input,
.modal-form textarea {
  width: 100%;
  padding: 0.5rem;
  background-color: rgba(38, 38, 38, 0.3);
  border: 1px solid var(--color-subtitle);
  border-radius: 8px;
  color: var(--color-text);
  font-weight: 400;
  backdrop-filter: blur(4px);
  margin-bottom: 1rem;
}

.message-field textarea {
  resize: none;
  background-color: rgba(38,38,38,0.15);
  border-color: var(--color-subtitle);
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}


  .btn-inner {
    position: relative;
    z-index: 1;
    border-radius: 100px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 1rem 2.5rem; /* définit la zone cliquable */
    color: var(--color-text);
    border: none;
    transition: transform 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem; /* espace entre l’icône et le texte */
  }

.btn-inner:hover {
  transform: scale(0.95);
  color: var(--color-subtitle);
}


.modal-footer {
  display: flex;
  justify-content: space-between;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 130px;
  flex-shrink: 0;
}

.social-links a {
  display: flex;
  align-items: center;
  gap: 4px;
}

.social-links img {
  width: 14px;
  height: 14px;
  object-fit: contain;
  filter: invert(1);
  opacity: 0.9;
}


.social-links a {
  margin-right: 1rem;
  font-size: 0.75rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s;
}

.social-links a:hover {
  color: var(--color-accent);
}

.submit-btn {
  border-radius: 999px; /* capsule compatible avec le SVG */
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

@media (max-width: 640px) {
  .modal-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .social-links {
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  .btn-inner,
  .submit-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>
