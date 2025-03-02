import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'video-decoder',
	standalone: true,
	imports: [CommonModule],
	templateUrl: 'video_decoder.component.html',
	styleUrls: ['video_decoder.component.scss'],
})
export class VideoDecoderComponent {}
