import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import fastifyStatic from '@fastify/static'
import { request } from 'http';
import { env } from 'process';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);

const imagesDir = path.join(process.cwd(), 'images');
const ppDir = path.join(process.cwd(), 'pp');
const __dirname = path.dirname(__filename)

export default async function(fastify, options) {
	fastify.register(fastifyStatic, {
		root: process.cwd(),
		decorateReply: true,
		serve: false
	})

	async function getImageList(dir) {
		const images = await fs.readdir(dir);

		return images.map((filename, i) => ({
			filename,
			id: String(i),
		}));
	}

	fastify.get('/list', async (request, reply) => {
		try {
			const list = await getImageList(imagesDir);
			return list.map((filename, i) => ({
				id: String(i),
				url: `/id?id=${i}`
			}));
		} catch {
			return reply.code(500).send({ error: 'Internal server error'});
		}
	})

	fastify.get('/id', async (request, reply) => {
		try {
			const { id } = request.query
			if (typeof id === 'undefined') {
				return reply.code(400).send({ error: 'Missing id query parameter' })
			}
			const list = await getImageList(imagesDir)
			const image = list.find(img => img.id === id)
			if (!image) {
				return reply.code(404).send({ error: 'Image not found' })
			}
			return reply.sendFile(path.join("images", image.filename))
		} catch {
			return reply.code(500).send({ error: 'Internal server error'});
		}
	});

	fastify.get('/pp', async (request, reply) => {
		try {
			const { id } = request.query
			const list = await getImageList(ppDir)
			let image
			if (typeof id === 'undefined') {
				image = list[Math.floor(Math.random() * list.length)]
			} else {
				image = list.find(img => img.id === id)
			}
			if (!image) {
				return reply.code(404).send({ error: 'Image not found' })
			}
			return reply.sendFile(path.join("pp", image.filename));
		} catch {
			return reply.code(500).send({ error: 'Internal server error'});
		}
	});

	
	fastify.get('/random', async (request, reply) => {
		try {
			const list = await getImageList(imagesDir)
			if (list.length === 0) {
				return reply.code(404).send({ error: 'No images available' })
			}
			const randomImage = list[Math.floor(Math.random() * list.length)]
			return reply.sendFile(path.join("images", randomImage.filename))
		} catch {
			return reply.code(500).send({ error: 'Internal server error'});
		}
	});

	fastify.get('/color', async (request, reply) => {
		try {
			const color = process.env.CAT_COLOR || '';
			if (color === '') {
				throw error;
			}
			let regex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
			if (regex.test(color) == true) {
				return reply.code(200).send({ color: color });
			} else {
				throw error;
			}
		} catch {
			return reply.code(500).send({ error: 'Internal server error'});
		}
	})

	fastify.get('/', async (request, reply) => {
		try {
			const htmlPath = path.join(__dirname, 'index.html')
			const html = await fs.readFile(htmlPath, 'utf-8')
			reply.type('text/html').send(html)
		} catch {
			return reply.code(500).send({ error: 'Internal server error'});
		}
	});

	fastify.get('/favicon.ico', async (req, reply) => {
		try {
			const faviconPath = path.join(__dirname, 'favicon.ico')
			const icon = await fs.readFile(faviconPath)
			reply.type('image/x-icon').send(icon)
		} catch {
			return reply.code(500).send({ error: 'Internal server error'});
		}
	})
}
