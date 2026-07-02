"use client";

import { useEffect } from "react";

export default function useSpeech(text) {
  useEffect(() => {
    if (!text) return;

    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const femaleVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes("female")
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [text]);
}