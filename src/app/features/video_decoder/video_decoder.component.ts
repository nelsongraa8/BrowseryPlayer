import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Component({
	selector: 'video-decoder',
	standalone: true,
	imports: [CommonModule],
	templateUrl: 'video_decoder.component.html',
	styleUrls: ['video_decoder.component.scss'],
})
export class VideoDecoderComponent implements OnInit {
	ffmpeg = createFFmpeg({ log: true });

	async ngOnInit() {
		await this.ffmpeg.load();
	}

	async load(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (!inputElement.files?.length) return;

		const file = inputElement.files[0];
		const fileName = file.name;

		this.ffmpeg.FS('writeFile', fileName, await fetchFile(file));

		await this.runFfmpeg(fileName);

		this.getFileAndShow();
	}

	private async runFfmpeg(fileName: string) {
		await this.ffmpeg.run(
			'-i',
			fileName,
			'-frames:v',
			'1',
			'/tmp/thumbnail.jpg',
		);
	}

	private getFileAndShow() {
		const data = this.ffmpeg.FS('readFile', '/tmp/thumbnail.jpg');
		const blob = new Blob([data.buffer], { type: 'image/jpeg' });
		const url = URL.createObjectURL(blob);

		const imgElement = document.getElementById('thumbnail') as HTMLImageElement;
		imgElement.src = url;
	}
}
