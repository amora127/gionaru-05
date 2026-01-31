 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..76ad13d8500db6c11f328a4ac9be236d3cb0aecf
--- /dev/null
+++ b/script.js
@@ -0,0 +1,100 @@
+const toggleButton = document.querySelector(".sound-toggle");
+const sparklesContainer = document.querySelector(".floating-sparkles");
+const profileImage = document.querySelector(".profile-ring img");
+
+let audioContext;
+let oscillator;
+let gainNode;
+
+const createSparkles = () => {
+  const sparkleCount = 18;
+  for (let i = 0; i < sparkleCount; i += 1) {
+    const sparkle = document.createElement("span");
+    sparkle.classList.add("sparkle");
+    sparkle.style.left = `${Math.random() * 100}%`;
+    sparkle.style.top = `${Math.random() * 100}%`;
+    sparkle.style.animationDelay = `${Math.random() * 8}s`;
+    sparkle.style.animationDuration = `${6 + Math.random() * 6}s`;
+    sparklesContainer.appendChild(sparkle);
+  }
+};
+
+const startAudio = async () => {
+  if (!audioContext) {
+    audioContext = new AudioContext();
+    gainNode = audioContext.createGain();
+    gainNode.gain.value = 0.06;
+    gainNode.connect(audioContext.destination);
+  }
+
+  if (audioContext.state === "suspended") {
+    await audioContext.resume();
+  }
+
+  oscillator = audioContext.createOscillator();
+  oscillator.type = "triangle";
+  oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
+  oscillator.frequency.exponentialRampToValueAtTime(
+    294,
+    audioContext.currentTime + 4
+  );
+  oscillator.connect(gainNode);
+  oscillator.start();
+};
+
+const stopAudio = () => {
+  if (oscillator) {
+    oscillator.stop();
+    oscillator.disconnect();
+    oscillator = null;
+  }
+};
+
+const toggleAudio = async () => {
+  const isPlaying = toggleButton.classList.contains("is-playing");
+  if (isPlaying) {
+    stopAudio();
+    toggleButton.classList.remove("is-playing");
+    toggleButton.setAttribute("aria-pressed", "false");
+    toggleButton.querySelector(".sound-label").textContent = "Hidupkan Suara";
+  } else {
+    try {
+      await startAudio();
+      toggleButton.classList.add("is-playing");
+      toggleButton.setAttribute("aria-pressed", "true");
+      toggleButton.querySelector(".sound-label").textContent =
+        "Matikan Suara";
+    } catch (error) {
+      console.error("Audio gagal dimulai:", error);
+    }
+  }
+};
+
+const addHoverNotes = () => {
+  document.querySelectorAll(".line").forEach((line) => {
+    line.addEventListener("mouseenter", () => {
+      line.style.transform = "translateY(-2px)";
+      line.style.boxShadow = "0 12px 20px rgba(226, 127, 150, 0.2)";
+    });
+    line.addEventListener("mouseleave", () => {
+      line.style.transform = "translateY(0)";
+      line.style.boxShadow = "none";
+    });
+  });
+};
+
+const setProfileFallback = () => {
+  const fallbackSvg =
+    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23ffe7ef'/%3E%3Cstop offset='100%25' stop-color='%23f3b6c3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='320' rx='160' fill='url(%23g)'/%3E%3Ctext x='160' y='180' text-anchor='middle' font-family='Arial' font-size='72' fill='%237a3f4f'%3EPFP%3C/text%3E%3C/svg%3E";
+  if (profileImage) {
+    profileImage.addEventListener("error", () => {
+      profileImage.src = fallbackSvg;
+    });
+  }
+};
+
+createSparkles();
+addHoverNotes();
+setProfileFallback();
+
+toggleButton.addEventListener("click", toggleAudio);
 
EOF
)
