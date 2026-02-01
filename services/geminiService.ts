import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Anda adalah "Uneed AI Assistant", konsultan teknis virtual untuk "Uneed Developer".
Uneed Developer adalah agensi software house yang berfokus pada:
1. Pembuatan Web App (React, Next.js, Dashboard Enterprise).
2. Pembuatan Mobile App (Flutter, React Native, iOS/Android).
3. Jasa Pembuatan Laporan Otomatis & Business Intelligence (Data visualization, PDF reporting tools).

Tugas anda:
- Menyapa calon klien dengan ramah dan profesional.
- Membantu mereka merumuskan kebutuhan proyek (apakah butuh web, mobile, atau sekadar sistem laporan).
- Memberikan estimasi kasar teknologi yang cocok (Tech Stack).
- Selalu arahkan mereka untuk mengisi formulir kontak atau menghubungi WhatsApp admin di akhir percakapan jika mereka terlihat tertarik serius.
- Gunakan Bahasa Indonesia yang baik, namun santai (profesional casual).
- Jangan memberikan harga pasti (nominal uang), tapi katakan harga tergantung kompleksitas fitur.

Jaga jawaban tetap ringkas (maksimal 3 paragraf pendek) agar mudah dibaca di chat widget.
`;

const GEMINI_MODEL = "gemini-3-flash-preview";

let chatSession: Chat | null = null;

const initializeChat = async (): Promise<Chat> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  chatSession = ai.chats.create({
    model: GEMINI_MODEL,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "Maaf, saya sedang mengalami gangguan koneksi. Silakan coba lagi.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan hubungi kami secara langsung.";
  }
};
