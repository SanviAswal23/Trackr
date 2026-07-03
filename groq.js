// routes/groq.js
import express from 'express'

const router = express.Router()

router.post('/api/groq', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY // set this in your server's .env — no VITE_ prefix
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
    res.json(data)
  } catch (err) {
    console.error('Groq proxy error:', err)
    res.status(500).json({ error: 'Groq request failed' })
  }
})

export default router