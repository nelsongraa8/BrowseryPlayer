import { Injectable } from '@angular/core';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

@Injectable({
	providedIn: 'root',
})
export class CreateFFmpegService {
	public ffmpeg = createFFmpeg({ log: true });

	async load() {
		await this.ffmpeg.load();
	}
}
