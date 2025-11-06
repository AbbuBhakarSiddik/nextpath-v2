// backend/src/controllers/resumeController.js
import mammoth from "mammoth";
import textract from "textract";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: extract text from PDF using pdf2json
const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => reject(err));
    pdfParser.on("pdfParser_dataReady", () => {
      const rawText = pdfParser.getRawTextContent();
      resolve(rawText || "");
    });

    pdfParser.parseBuffer(buffer);
  });
};

export const analyzeResume = async (req, res) => {
  try {
    let resumeText = "";

    if (req.file) {
      const { buffer: fileBuffer, mimetype: fileType, originalname } = req.file;

      if (!fileBuffer || fileBuffer.length === 0)
        return res.status(400).json({ error: "Uploaded file is empty" });

      if (fileType === "application/pdf") {
        resumeText = await extractTextFromPDF(fileBuffer);
      } else if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        originalname.endsWith(".docx")
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeText = result.value || "";
      } else if (fileType === "application/msword" || originalname.endsWith(".doc")) {
        resumeText = await new Promise((resolve, reject) => {
          textract.fromBufferWithMime(fileType, fileBuffer, (err, text) => {
            if (err) reject(err);
            else resolve(text || "");
          });
        });
      } else {
        return res.status(400).json({ error: "Unsupported file format" });
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ error: "No resume provided" });
    }

    if (!resumeText.trim())
      return res.status(400).json({ error: "No content could be extracted from the resume" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a professional career advisor.
      Analyze the following resume and return ONLY valid JSON with this schema:
      {
        "score": number (0-100),
        "strengths": [list of strings],
        "weaknesses": [list of strings],
        "improvements": [list of strings],
        "skillsToLearn": [list of strings]
      }

      Resume:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith("```")) text = text.replace(/```(json)?/g, "").trim();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch (e) {
      console.error("❌ Parsing failed. AI Response:", text);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    res.json(jsonResponse);
  } catch (error) {
    console.error("❌ Resume analysis failed:", error);
    res.status(500).json({ error: "Resume analysis failed" });
  }
};
