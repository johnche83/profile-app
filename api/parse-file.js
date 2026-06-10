// api/parse-file.js
// 업로드된 PDF/이미지에서 Claude Vision으로 점수를 추출합니다

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { content } = req.body;
  if (!content || !content.length) {
    return res.status(400).json({ ok: false, error: "파일이 없습니다" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 800,
        messages: [{ role: "user", content }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API 오류");

    const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return res.status(200).json({ ok: true, result });

  } catch (err) {
    console.error("parse-file error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
