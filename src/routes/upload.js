const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const uploadsDirectory = path.join(__dirname, '../../uploads');
const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/jpg']);
const allowedExtensions = new Set(['.png', '.jpg', '.jpeg']);
const genericMimeTypes = new Set(['application/octet-stream']);

fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, callback) => callback(null, uploadsDirectory),
	filename: (_req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		callback(null, `${crypto.randomUUID()}${extension}`);
	}
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		const mimeType = file.mimetype.toLowerCase();
		const validExtension = allowedExtensions.has(extension);
		const validMimeType = allowedMimeTypes.has(mimeType) || genericMimeTypes.has(mimeType);

		if (!validExtension || !validMimeType) {
			const error = new Error('Apenas arquivos PNG, JPG e JPEG são aceitos.');
			error.code = 'INVALID_FILE_TYPE';
			return callback(error);
		}

		return callback(null, true);
	}
});

router.post('/', (req, res) => {
	upload.single('arquivo')(req, res, (error) => {
		if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
			return res.status(413).json({ erro: 'O arquivo excede o limite de 5 MB.' });
		}

		if (error instanceof multer.MulterError && error.code === 'LIMIT_UNEXPECTED_FILE') {
			return res.status(400).json({ erro: 'O campo do arquivo deve se chamar arquivo.' });
		}

		if (error && error.code === 'INVALID_FILE_TYPE') {
			return res.status(400).json({ erro: error.message });
		}

		if (error) {
			return res.status(400).json({ erro: 'Não foi possível realizar o upload.' });
		}

		if (!req.file) {
			return res.status(400).json({ erro: 'Envie um arquivo no campo arquivo.' });
		}

		return res.status(201).json({
			mensagem: 'Upload realizado com sucesso!',
			arquivo: {
				nomeOriginal: req.file.originalname,
				nomeArmazenado: req.file.filename,
				tipo: req.file.mimetype,
				tamanhoBytes: req.file.size,
				caminho: `uploads/${req.file.filename}`
			}
		});
	});
});

module.exports = router;