// database/db.js
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.db);

// Init: ensure auxiliary table for single-use tokens exists
(async () => {
	try {
		await pool.query(`
			CREATE TABLE IF NOT EXISTS public.used_tokens (
				token_hash TEXT PRIMARY KEY,
				token_type TEXT NOT NULL,
				used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
		`);
	} catch (err) {
		console.warn('No se pudo inicializar tabla used_tokens:', err.message);
	}
})();

module.exports = pool;