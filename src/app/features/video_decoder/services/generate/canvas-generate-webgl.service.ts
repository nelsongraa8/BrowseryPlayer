import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CanvasGenerateWebGlService {
	generate(canvas: HTMLCanvasElement, imageUrl: string) {
		const gl = canvas.getContext('webgl');

		if (!gl) {
			console.error('WebGL no es soportado en este navegador.');
			return;
		}

		const img = new Image();
		img.onload = () => {
			// Establece el tamaño del canvas según la imagen
			canvas.width = img.width;
			canvas.height = img.height;
			gl.viewport(0, 0, canvas.width, canvas.height);

			// Shaders
			const vertexSrc = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main(){
                gl_Position = vec4(a_position, 0, 1);
                v_texCoord = a_texCoord;
            }
        `;

			const fragmentSrc = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_texture;
            void main(){
                gl_FragColor = texture2D(u_texture, v_texCoord);
            }
        `;

			// Función para compilar shaders
			function createShader(
				gl: WebGLRenderingContext,
				type: number,
				source: string,
			): WebGLShader | null {
				const shader = gl.createShader(type);
				if (!shader) return null;
				gl.shaderSource(shader, source);
				gl.compileShader(shader);
				if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					return shader;
				}
				console.error(
					'Error compilando el shader:',
					gl.getShaderInfoLog(shader),
				);
				gl.deleteShader(shader);
				return null;
			}

			const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
			const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
			if (!vertexShader || !fragmentShader) return;

			// Crea y configura el programa
			const program = gl.createProgram();
			if (!program) return;
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.error(
					'Error al enlazar el programa:',
					gl.getProgramInfoLog(program),
				);
				return;
			}
			gl.useProgram(program);

			// Define un quad para renderizar la textura (coordenadas en clip space)
			const vertices = new Float32Array([
				//  X,   Y,    U, V
				-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, -1, 1, 0, 0, 1, -1, 1, 1, 1, 1,
				1, 0,
			]);

			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

			const a_position = gl.getAttribLocation(program, 'a_position');
			const a_texCoord = gl.getAttribLocation(program, 'a_texCoord');
			const stride = 4 * Float32Array.BYTES_PER_ELEMENT;
			gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, stride, 0);
			gl.enableVertexAttribArray(a_position);
			gl.vertexAttribPointer(
				a_texCoord,
				2,
				gl.FLOAT,
				false,
				stride,
				2 * Float32Array.BYTES_PER_ELEMENT,
			);
			gl.enableVertexAttribArray(a_texCoord);

			// Crea y configura la textura
			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

			// Asigna la textura al uniform
			const u_texture = gl.getUniformLocation(program, 'u_texture');
			gl.uniform1i(u_texture, 0);

			// Dibuja el quad
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			URL.revokeObjectURL(img.src);
		};
		img.src = imageUrl;
	}
}
