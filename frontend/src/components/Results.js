// frontend/src/components/Results.js
import React from "react";
import jsPDF from "jspdf";
import "../styles/ResumeAnalyzer.css"; // ensure this has your CSS

export default function Results({ results }) {
  if (!results) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("📄 Resume Analysis Report", margin, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Score: ${results.score}/100`, margin, y);
    y += 10;

    const addSection = (title, items) => {
      if (!items || items.length === 0) return;
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, y);
      doc.setFont("helvetica", "normal");
      y += 6;

      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2);
        lines.forEach((line) => {
          if (y > doc.internal.pageSize.getHeight() - 10) {
            doc.addPage();
            y = 10;
          }
          doc.text(line, margin + 5, y);
          y += 6;
        });
      });
      y += 6;
    };

    addSection("✅ Strengths", results.strengths);
    addSection("⚠️ Weaknesses", results.weaknesses);
    addSection("💡 Suggestions", results.improvements);
    addSection("📚 Recommended Skills", results.skillsToLearn);

    doc.save("resume-analysis.pdf");
  };

  const renderList = (title, items) =>
    items && items.length > 0 && (
      <div className="feedback">
        <h3>{title}</h3>
        <ul>
          {items.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="results">
      <div className="score-card">
        <h2>Resume Score</h2>
        <p className="score">{results.score}/100</p>
      </div>

      {renderList("✅ Strengths", results.strengths)}
      {renderList("⚠️ Weaknesses", results.weaknesses)}
      {renderList("💡 Suggestions", results.improvements)}
      {renderList("📚 Recommended Skills", results.skillsToLearn)}

      <button onClick={downloadPDF} className="download-btn">
        📥 Download PDF
      </button>
    </div>
  );
}
