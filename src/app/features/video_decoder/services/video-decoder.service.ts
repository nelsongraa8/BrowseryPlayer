import { Injectable } from '@angular/core';
import { FFmpegWrapperService } from './ffmpeg/ffmpeg-wrapper.service';

@Injectable({
	providedIn: 'root',
})
export class VideoDecoderService {
	constructor(private ffmpegWrapperService: FFmpegWrapperService) {}

	async processFile(file: File): Promise<string> {
		await this.ffmpegWrapperService.writeFile(file);
		return await this.ffmpegWrapperService.createThumbnail(file.name);
	}
}
