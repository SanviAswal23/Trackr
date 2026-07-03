// api/groq.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  
    try {
      const apiKey = process.env.GROQ_API_KEY
  
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(req.body)
      })
  
      if (!groqRes.ok) {
        const text = await groqRes.text()
        return res.status(groqRes.status).json({ error: text })
      }
  
      const data = await groqRes.json()
      res.status(200).json(data)
    } catch (err) {
      console.error('Groq proxy error:', err)
      res.status(500).json({ error: 'Groq request failed' })
    }
  }