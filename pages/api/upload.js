const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const { parsePdfReport } = require('../../utils/parsePdf');

export const config = { 
  api: { 
    bodyParser: false,
    responseLimit: '50mb'
  } 
};

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Parse form with file
    const form = formidable({
      uploadDir: tempDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB max
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(400).json({ 
          success: false,
          error: 'File upload failed',
          message: err.message 
        });
      }

      if (!files.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No file uploaded' 
        });
      }

      const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

      // Validate file type
      if (!uploadedFile.mimetype.includes('pdf') && !uploadedFile.originalFilename.endsWith('.pdf')) {
        fs.unlinkSync(uploadedFile.filepath);
        return res.status(400).json({ 
          success: false,
          error: 'Invalid file type. Please upload a PDF file.' 
        });
      }

      try {
        // Parse PDF
        const result = await parsePdfReport(uploadedFile.filepath);

        // Clean up temp file
        fs.unlinkSync(uploadedFile.filepath);

        res.status(200).json(result);
      } catch (parseError) {
        console.error('PDF parse error:', parseError);
        fs.unlinkSync(uploadedFile.filepath);
        res.status(500).json({ 
          success: false,
          error: 'Failed to parse PDF',
          message: parseError.message 
        });
      }
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
}
