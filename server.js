const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { model, messages } = req.body;

    console.log("Gelen istek:", { model, messages });
    console.log("API KEY:", process.env.OPENROUTER_API_KEY); // debug için eklendi

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: model || "openai/gpt-3.5-turbo-0613",
        messages,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "OpenRouter API Hatası:",
      JSON.stringify(error.response?.data || error.message, null, 2)
    );
    res.status(500).json({
      error: "OpenRouter API hatası",
      detail: error.response?.data || error.message,
    });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
