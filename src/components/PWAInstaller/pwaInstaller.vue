<template>
  <div>
    <Button id="installApp">Instalar Ovcapp</Button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // Initialize deferredPrompt for use later to show browser install prompt.
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
  });

  let buttonInstall = document.getElementById("installApp");

  buttonInstall.addEventListener("click", async () => {
    // Hide the app provided install promotion
    hideInstallPromotion();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
  });

  const showInstallPromotion = () => {
    buttonInstall.style.display = "block";
  };
  const hideInstallPromotion = () => {
    buttonInstall.style.display = "none";
  };
});
</script>
