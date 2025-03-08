import { Injectable } from '@angular/core';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { CreateFFmpegService } from './create-ffmpeg.service';

@Injectable({
	providedIn: 'root',
})
export class FFmpegWrapperService {
	constructor(private createFFmpegService: CreateFFmpegService) {}

	async initialize(): Promise<void> {
		await this.createFFmpegService.load();
	}

	async writeFile(file: File): Promise<void> {
		await this.initialize();

		const fileName = file.name;

		this.createFFmpegService.ffmpeg.FS(
			'writeFile',
			fileName,
			await fetchFile(file),
		);
	}

	async createThumbnail(fileName: string): Promise<string> {
		await this.createFFmpegService.ffmpeg.run(
			'-i',
			fileName,
			'-frames:v',
			'1',
			'/tmp/thumbnail.jpg',
		);

		const data = this.createFFmpegService.ffmpeg.FS(
			'readFile',
			'/tmp/thumbnail.jpg',
		);
		const blob: Blob = new Blob([data.buffer], { type: 'image/jpeg' });

		return URL.createObjectURL(blob);
	}
}
