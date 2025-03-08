import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CanvasGenerate2dService {
	generate(canvas: HTMLCanvasElement, imageUrl: string) {
		const context = canvas.getContext('2d');

		if (!context) {
			console.error('No se pudo obtener el contexto 2D del canvas.');
			return;
		}

		const img = new Image();
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img, 0, 0);
			URL.revokeObjectURL(img.src);
		};
		img.src = imageUrl;
	}
}
