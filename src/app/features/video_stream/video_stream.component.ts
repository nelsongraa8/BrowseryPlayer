import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Component({
	selector: 'video-stream',
	standalone: true,
	imports: [CommonModule],
	templateUrl: 'video_stream.component.html',
})
export class VideoStreamComponent implements OnInit {
	@ViewChild('videoCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

	private ffmpeg = createFFmpeg({ log: true });

	async ngOnInit() {
		await this.loadFFmpeg();
	}

	async loadFFmpeg() {
		if (!this.ffmpeg.isLoaded()) {
			await this.ffmpeg.load();
		}
	}

	async handleFile(event: any) {
		const file = event.target.files[0];
		if (!file) return;

		const fileName = 'input.mp4';
		this.ffmpeg.FS('writeFile', fileName, await fetchFile(file));

		// Definir el tamaño del video (puedes ajustarlo según el video real)
		const width = 640; // Cambia según el video
		const height = 360;

		// Extraer frames como raw RGBA directamente en memoria
		await this.ffmpeg.run(
			'-i',
			fileName, // Archivo de entrada
			'-vf',
			`fps=25,scale=${width}:${height}`, // Escalar a 640x360 y 25 FPS
			'-f',
			'rawvideo', // Salida en formato crudo
			'-pix_fmt',
			'rgba', // Formato sin compresión
			'output.raw', // Guardar en memoria virtual
		);

		// Leer datos binarios de la memoria virtual
		const frameData = this.ffmpeg.FS('readFile', 'output.raw');

		this.playFrames(frameData, width, height);
	}

	async playFrames(frameData: Uint8Array, width: number, height: number) {
		console.info('Inicia la reproduccion ...');

		const ctx = this.canvas.nativeElement.getContext('2d');
		if (!ctx) return;

		this.canvas.nativeElement.width = width;
		this.canvas.nativeElement.height = height;

		const frameSize = width * height * 4; // 4 bytes por píxel (RGBA)
		const totalFrames = frameData.length / frameSize;

		for (let i = 0; i < totalFrames; i++) {
			const frameSlice = frameData.slice(i * frameSize, (i + 1) * frameSize);
			const imageData = new ImageData(new Uint8ClampedArray(frameSlice), width, height);

			ctx.putImageData(imageData, 0, 0);
			await new Promise((resolve) => setTimeout(resolve, 40)); // Simular 25 FPS
		}
	}
}
