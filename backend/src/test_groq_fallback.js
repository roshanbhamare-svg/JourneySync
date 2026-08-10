import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({ path: "./.env" });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testGeneratePlaces(city) {
    console.log(`Testing Groq Places generation for "${city}"...`);
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: `You are an expert travel guide. Generate a list of 10 top tourist attractions in ${city}.
Return ONLY valid JSON with key "places" as an array of objects:
{
  "places": [
    {
      "placeId": "groq_place_1",
      "name": "Attraction Name",
      "category": "Historic Site / Temple / Beach / Museum",
      "rating": 4.6,
      "address": "Full address, ${city}",
      "openingHours": "9:00 AM",
      "closingHours": "6:00 PM",
      "description": "2-3 sentences about this place.",
      "estimatedEntryFee": "Free or ₹100",
      "bestTimeToVisit": "Morning or Sunset",
      "recommendedVisitDuration": "1-2 hours",
      "travelTips": "Practical tip",
      "estimatedCost": 100
    }
  ]
}`
            }
        ],
        response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    console.log("✅ Generated places count:", data.places?.length);
    console.log("Sample:", data.places?.[0]?.name, "-", data.places?.[0]?.category);
}

testGeneratePlaces("Goa");
