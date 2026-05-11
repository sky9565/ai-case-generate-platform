import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

function parseMarkdownLines(content) {
  if (!content) return []
  return content.split('\n')
}

function buildDocxParagraphs(lines) {
  const paragraphs = []

  lines.forEach(line => {
    const trimmed = line.trim()

    if (trimmed.startsWith('# ')) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed.replace(/^# /, ''), bold: true, size: 36 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 120 }
      }))
    } else if (trimmed.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed.replace(/^## /, ''), bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120 }
      }))
    } else if (trimmed.startsWith('### ')) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed.replace(/^### /, ''), bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 120 }
      }))
    } else if (trimmed.startsWith('> ')) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed.replace(/^> /, ''), italics: true, color: '666666' })],
        indent: { left: 720 },
        spacing: { before: 80, after: 80 }
      }))
    } else if (trimmed === '') {
      paragraphs.push(new Paragraph({
        children: [],
        spacing: { before: 80, after: 80 }
      }))
    } else {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: trimmed, size: 22 })],
        spacing: { before: 60, after: 60 }
      }))
    }
  })

  return paragraphs
}

export function exportMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || '需求规格说明书.md'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportDocx(content, filename) {
  const lines = parseMarkdownLines(content)
  const paragraphs = buildDocxParagraphs(lines)

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || '需求规格说明书.docx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}