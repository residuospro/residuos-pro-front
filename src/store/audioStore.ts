import { defineStore } from "pinia"

interface IAudioStore {
	audio: HTMLAudioElement | null
}

export const audioStore = defineStore("audioStore", {
	state: (): IAudioStore => ({
		audio: null,
	}),

	actions: {
		initializeAudio(audioSrc: string) {
			this.audio = new Audio(audioSrc)

			this.audio.addEventListener("ended", this.playAudio)

			console.log("som iniciado")
		},

		playAudio() {
			if (this.audio) {
				this.audio.play()
			}
		},

		pauseAudio() {
			if (this.audio) {
				this.audio.pause()
			}
		},
	},
})
