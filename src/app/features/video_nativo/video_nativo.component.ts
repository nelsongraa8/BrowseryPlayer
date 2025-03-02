import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

interface FullscreenVideoElement extends HTMLVideoElement {
	mozRequestFullScreen?: () => Promise<void>;
	webkitRequestFullscreen?: () => Promise<void>;
	msRequestFullscreen?: () => Promise<void>;
}

@Component({
	selector: 'video-nativo',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './video_nativo.component.html',
	styleUrl: './video_nativo.component.scss',
})
export class VideoNativoComponent implements AfterViewInit {
	@ViewChild('video', { static: false }) video!: ElementRef;
	videoElement!: HTMLVideoElement;

	currentTime: number = 0;
	duration: number = 0;
	volume: number = 1;
	playbackRate: number = 1;
	muted: boolean = false;

	ngAfterViewInit(): void {
		this.videoElement = this.video.nativeElement;

		this.video.nativeElement.onloadedmetadata = () => {
			this.duration = this.getDuration();
		};

		this.video.nativeElement.ontimeupdate = () => {
			this.currentTime = this.getCurrentTime();
		};
	}

	play() {
		this.videoElement.play();
	}

	pause() {
		this.videoElement.pause();
	}

	stop() {
		this.videoElement.pause();
		this.videoElement.currentTime = 0;
	}

	setVolume(volume: number) {
		this.videoElement.volume = volume;
	}

	setPlaybackRate(rate: number) {
		this.videoElement.playbackRate = rate;
	}

	getDuration() {
		return this.videoElement.duration;
	}

	getCurrentTime() {
		return this.videoElement.currentTime;
	}

	seek(time: number) {
		this.videoElement.currentTime = time;
	}

	mute() {
		this.videoElement.muted = true;
	}

	unmute() {
		this.videoElement.muted = false;
	}

	toggleFullscreen() {
		const objectElement = this.videoElement as FullscreenVideoElement;

		if (this.videoElement.requestFullscreen) {
			this.videoElement.requestFullscreen();
			return;
		}

		if (objectElement.mozRequestFullScreen) {
			objectElement.mozRequestFullScreen();
			return;
		}

		if (objectElement.webkitRequestFullscreen) {
			objectElement.webkitRequestFullscreen();
			return;
		}

		if (objectElement.msRequestFullscreen) {
			objectElement.msRequestFullscreen();
			return;
		}
	}
}
