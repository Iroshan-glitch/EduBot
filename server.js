import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an A/L ICT teacher. Answer exam-oriented."
            },
            { role: "user", content: userQuestion }
          ]
        })
      }
    );

    const data = await response.json();
    console.log(data);
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("✅ EduBot server running on port 3000");
});
