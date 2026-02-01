import dotenv from "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    try {
        const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY,
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: message }],
                    },
                ],
            }),
        }
        );

        if (!response.ok) {
            throw new Error(`Gemini API failed: ${response.status}`);
        }

        const data = await response.json();

        return (data.candidates?.[0]?.content?.parts?.[0]?.text || "No response");
    } 
    catch (error) {
        console.error("Gemini API Error:", error);
        throw error; // controller will handle response
    }
};

export default getOpenAIAPIResponse;
