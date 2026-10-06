import { get, list, put } from '@vercel/blob';

// Cada comentario se guarda como un archivo JSON en Vercel Blob.
// El nombre usa un timestamp invertido para que el listado salga del más reciente al más antiguo.
const PREFIX = 'comentarios/';
const MAX_LENGTH = 100;
const MAX_RESULTS = 30;
const TIPOS = ['bueno', 'malo'];
const ACCESS = process.env.BLOB_ACCESS === 'public' ? 'public' : 'private';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ comentarios: await obtenerComentarios() });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
      const texto = typeof body.texto === 'string' ? body.texto.trim() : '';
      const tipo = body.tipo;

      if (!texto || texto.length > MAX_LENGTH) {
        return res.status(400).json({ error: `El comentario debe tener entre 1 y ${MAX_LENGTH} caracteres.` });
      }
      if (!TIPOS.includes(tipo)) {
        return res.status(400).json({ error: 'Indica si tu experiencia fue buena o mala.' });
      }

      const comentario = { texto, tipo, fecha: new Date().toISOString() };
      const orden = String(9999999999999 - Date.now()).padStart(13, '0');
      const id = Math.random().toString(36).slice(2, 8);

      await put(`${PREFIX}${orden}-${id}.json`, JSON.stringify(comentario), {
        access: ACCESS,
        contentType: 'application/json',
        addRandomSuffix: false,
      });

      return res.status(201).json({ comentario });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('comments api error:', error);
    return res.status(500).json({ error: 'No pudimos procesar los comentarios en este momento.' });
  }
}

async function obtenerComentarios() {
  const { blobs } = await list({ prefix: PREFIX, limit: MAX_RESULTS });

  const comentarios = await Promise.all(
    blobs.map(async (blob) => {
      try {
        const result = await get(blob.url, { access: ACCESS });
        if (!result || result.statusCode !== 200) return null;
        const data = JSON.parse(await new Response(result.stream).text());
        return TIPOS.includes(data.tipo) && typeof data.texto === 'string' ? data : null;
      } catch {
        return null;
      }
    })
  );

  return comentarios
    .filter(Boolean)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}
