/* eslint-disable no-console */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const ANGULAR_DEV_SERVER = 'http://localhost:4200';

// Configurar cabeceras necesarias para SharedArrayBuffer
app.use((req, res, next) => {
	res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
	res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
	next();
});

// Proxy para redirigir peticiones a Angular en modo desarrollo
app.use(
	'/',
	createProxyMiddleware({
		target: ANGULAR_DEV_SERVER,
		changeOrigin: true,
		ws: true,
	}),
);

// Iniciar el servidor
app.listen(PORT, () => {
	console.log(
		'Servidor proxy corriendo en http://localhost:' +
			PORT +
			', redirigiendo a Angular en ' +
			ANGULAR_DEV_SERVER,
	);
});
