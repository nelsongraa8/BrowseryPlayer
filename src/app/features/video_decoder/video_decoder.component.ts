import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VideoDecoderService } from './services/video-decoder.service';
import { CanvasGenerate2dService } from './services/generate/canvas-generate-2d.service';
import { CanvasGenerateWebGlService } from './services/generate/canvas-generate-webgl.service';

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

	constructor(
		private videoDecoderService: VideoDecoderService,
		private canvasGenerate2dService: CanvasGenerate2dService,
		private canvasGenerateWebGlService: CanvasGenerateWebGlService,
	) {}

	ngOnInit() {}

	async load(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (!inputElement.files?.length) return;

		this.videoFile = inputElement.files[0];

		await this.decodeFileVideo();

		this.getFileAndShowCanvas();
		this.getFileAndShowCanvasWebGl();
	}

	private async decodeFileVideo() {
		this.imageUrl = await this.videoDecoderService.processFile(this.videoFile);
	}

	private getFileAndShowCanvas() {
		const canvas = document.getElementById(
			'thumbnailCanvas',
		) as HTMLCanvasElement;
		this.canvasGenerate2dService.generate(canvas, this.imageUrl);
	}

	private getFileAndShowCanvasWebGl() {
		const canvas = document.getElementById(
			'thumbnailCanvaswgl',
		) as HTMLCanvasElement;
		this.canvasGenerateWebGlService.generate(canvas, this.imageUrl);
	}
}
