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
	@ViewChild('audioPlayer', { static: true }) audioPlayer!: ElementRef<HTMLAudioElement>;

	private ffmpeg = createFFmpeg({ log: true });
	public hasAudio = false; // Variable para controlar si hay audio
	public errorMessage: string | null = null; // Mensaje de error o advertencia

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

		try {
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

			// Reproducir los frames de video
			this.playFrames(frameData, width, height);

			// Intentar extraer el audio
			try {
				await this.ffmpeg.run(
					'-i',
					fileName, // Archivo de entrada
					'-q:a', // Calidad de audio
					'0',
					'-map',
					'a', // Mapear solo el stream de audio
					'output.mp3', // Guardar el audio en memoria virtual
				);

				// Verificar si el archivo de audio existe
				if (this.ffmpeg.FS('readdir', '/').includes('output.mp3')) {
					const audioData = this.ffmpeg.FS('readFile', 'output.mp3');
					this.playAudio(audioData);
					this.hasAudio = true; // Hay audio
					this.errorMessage = null; // Limpiar mensaje de error
				} else {
					this.hasAudio = false; // No hay audio
					this.errorMessage = 'El archivo de video no contiene una pista de audio.';
				}
			} catch (audioError) {
				this.hasAudio = false; // No hay audio
				this.errorMessage = 'No se pudo extraer el audio del archivo de video.';
				console.error('Error al extraer el audio:', audioError);
			}
		} catch (videoError) {
			this.errorMessage = 'Error al procesar el archivo de video.';
			console.error('Error al procesar el video:', videoError);
		}
	}

	async playFrames(frameData: Uint8Array, width: number, height: number) {
		console.info('Inicia la reproducción del video...');

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

	playAudio(audioData: Uint8Array) {
		console.info('Inicia la reproducción del audio...');

		// Verificar si el elemento audioPlayer está disponible
		if (!this.audioPlayer || !this.audioPlayer.nativeElement) {
			console.error('El reproductor de audio no está disponible en el DOM.');
			return;
		}

		// Crear un Blob con los datos de audio
		const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
		const audioUrl = URL.createObjectURL(audioBlob);

		// Asignar la URL al elemento de audio
		this.audioPlayer.nativeElement.src = audioUrl;
		this.audioPlayer.nativeElement.play();
	}
}
