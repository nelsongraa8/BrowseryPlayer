import { Routes } from '@angular/router';

const videoDecoder = () =>
	import('./features/video_decoder/video_decoder.component').then(
		(m) => m.VideoDecoderComponent
	);

const videoNativo = () =>
	import('./features/video_nativo/video_nativo.component').then(
		(m) => m.VideoNativoComponent
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
	{ path: '', redirectTo: '/video/decoder', pathMatch: 'full' },
];
