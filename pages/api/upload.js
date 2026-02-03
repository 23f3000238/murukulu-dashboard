const { parsePdfReportFromBuffer } = require('../../utils/parsePdf');

export const config = { 
  api: { 
    bodyParser: false,
    responseLimit: '50mb'
  } 
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read raw PDF bytes from request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Parse PDF from buffer
    const result = await parsePdfReportFromBuffer(fileBuffer);
    res.status(200).json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process PDF', 
      message: error.message 
    });
  }
}
