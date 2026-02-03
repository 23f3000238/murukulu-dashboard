const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { parsePdfReportFromBuffer } = require('../../utils/parsePdf');

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

  let uploadedFile = null;
  
  try {
    // Use system temp directory or fallback
    let tempDir;
    try {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-upload-'));
    } catch (e) {
      // If system temp fails, try current directory
      tempDir = path.join(process.cwd(), '.tmp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
    }

    // Parse form with file
    const form = formidable({
      uploadDir: tempDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB max
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      try {
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

        uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

        // Validate file type
        if (!uploadedFile.mimetype.includes('pdf') && !uploadedFile.originalFilename.endsWith('.pdf')) {
          try {
            fs.unlinkSync(uploadedFile.filepath);
          } catch (e) {
            console.error('Error deleting file:', e);
          }
          return res.status(400).json({ 
            success: false,
            error: 'Invalid file type. Please upload a PDF file.' 
          });
        }

        try {
          // Read file into buffer
          const fileBuffer = fs.readFileSync(uploadedFile.filepath);
          
          // Parse PDF from buffer
          const result = await parsePdfReportFromBuffer(fileBuffer);

          // Clean up temp file
          try {
            fs.unlinkSync(uploadedFile.filepath);
            // Try to remove temp directory
            fs.rmdirSync(tempDir, { force: true });
          } catch (e) {
            console.error('Cleanup error:', e);
          }

          res.status(200).json(result);
        } catch (parseError) {
          console.error('PDF parse error:', parseError);
          try {
            fs.unlinkSync(uploadedFile.filepath);
          } catch (e) {
            console.error('Error deleting file:', e);
          }
          res.status(500).json({ 
            success: false,
            error: 'Failed to parse PDF',
            message: parseError.message 
          });
        }
      } catch (innerError) {
        console.error('Inner error:', innerError);
        if (uploadedFile?.filepath) {
          try {
            fs.unlinkSync(uploadedFile.filepath);
          } catch (e) {
            console.error('Error deleting file:', e);
          }
        }
        res.status(500).json({ 
          success: false,
          error: 'Processing error',
          message: innerError.message 
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
