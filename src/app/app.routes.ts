import { Routes } from '@angular/router';

const videoDecoder = () =>
	import('./features/video_decoder/video_decoder.component').then(
		(m) => m.VideoDecoderComponent,
	);

const videoNativo = () =>
	import('./features/video_nativo/video_nativo.component').then(
		(m) => m.VideoNativoComponent,
	);

const VideoStream = () =>
	import('./features/video_stream/video_stream.component').then(
		(m) => m.VideoStreamComponent,
	);

export const routes: Routes = [
	{
		path: 'video/nativo',
		loadComponent: videoNativo,
	},
	{
		path: 'video/decoder',
		loadComponent: videoDecoder,
	},
	{
		path: 'video/stream',
		loadComponent: VideoStream,
	},
	{ path: '', redirectTo: '/video/stream', pathMatch: 'full' },
];
