import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import fastifyStatic from '@fastify/static'
import { request } from 'http';

const __filename = fileURLToPath(import.meta.url);

const imagesDir = path.join(process.cwd(), 'images');
const __dirname = path.dirname(__filename)

export default async function(fastify, options) {
	fastify.register(fastifyStatic, {
		root: imagesDir,
		decorateReply: true,
		serve: false
	})

	async function getImageList() {
		const images = await fs.readdir(imagesDir);

		return images.map((filename, i) => ({
			filename,
			id: String(i),
		}));
	}

	fastify.get('/list', async () => {
		const list = await getImageList();
		return list.map((filename, i) => ({
			id: String(i),
			url: `/id?id=${i}`
		}));
	})

	fastify.get('/id', async (request, reply) => {
		const { id } = request.query
		if (typeof id === 'undefined') {
			return reply.code(400).send({ error: 'Missing id query parameter' })
		}
		const list = await getImageList()
		const image = list.find(img => img.id === id)
		if (!image) {
			return reply.code(404).send({ error: 'Image not found' })
		}
		return reply.sendFile(image.filename)
	});

	fastify.get('/random', async (request, reply) => {
		const list = await getImageList()
		if (list.length === 0) {
			return reply.code(404).send({ error: 'No images available' })
		}
		const randomImage = list[Math.floor(Math.random() * list.length)]
		return reply.sendFile(randomImage.filename)
	});

	fastify.get('/', async (request, reply) => {
		const htmlPath = path.join(__dirname, 'index.html')
		const html = await fs.readFile(htmlPath, 'utf-8')
		reply.type('text/html').send(html)
	});

	fastify.get('/favicon.ico', async (req, reply) => {
		const faviconPath = path.join(__dirname, 'favicon.ico')
		const icon = await fs.readFile(faviconPath)
		reply.type('image/x-icon').send(icon)
	})
}
