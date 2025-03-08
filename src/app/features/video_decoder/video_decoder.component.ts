import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VideoDecoderService } from './services/video-decoder.service';

@Component({
	selector: 'video-decoder',
	standalone: true,
	imports: [CommonModule],
	templateUrl: 'video_decoder.component.html',
	styleUrls: ['video_decoder.component.scss'],
})
export class VideoDecoderComponent implements OnInit {
	private videoFile!: File;
	private imageUrl!: string;

	constructor(private videoDecoderService: VideoDecoderService) {}

	ngOnInit() {}

	async load(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (!inputElement.files?.length) return;

		this.videoFile = inputElement.files[0];

		await this.decodeFileVideo();

		this.getFileAndShow();
	}

	private async decodeFileVideo() {
		this.imageUrl = await this.videoDecoderService.processFile(this.videoFile);
	}

	private getFileAndShow() {
		const imgElement = document.getElementById('thumbnail') as HTMLImageElement;
		imgElement.src = this.imageUrl;
	}
}
