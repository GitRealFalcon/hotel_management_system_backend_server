import axios from "axios";
import dayjs from "dayjs";

const today = dayjs().format("YYYY-MM-DD");
const assistentService = async(message)=>{
    try {

        const response = await axios.post("https://api.mulerouter.ai/vendors/openai/v1/chat/completions",
           {
                model: "qwen3-max",
                messages: [
                    {
                        "role": "system", "content": `You are an assistant that extracts user intent and entities for hotel  Falcon Hotel — a modern sanctuary where elegance meets comfort. Located at the heart of the city Moradabad, Falcon Hotel blends refined design with warm, personalized hospitality to create a memorable experience for every traveler.Our Services: Spa & Wellness,Rooftop Pool & Lounge,In-Room Dining,Concierge & Guest Services,Meeting & Event Support,Laundry & Valet.Contactus: monaeem8@gmail.com,9720950255. extract user intent. Today's date is ${today}.The user message can express ONE of these intents:-chat - check_availability- make_booking- active_booking_info- cancel_booking- suggestions Extract also these entities if present: - checkIn (date in YYYY-MM-DD)- checkOut (date in YYYY-MM-DD)- roomType (e.g., single, double, suite)- numGuests (number of people)- bookingId (unique booking identifier) Return exactly this JSON format with no extra text: {"intent": "","checkIn": "","checkOut": "","roomNo": "","bookingId": "",chatResponce:""}` },
                    { "role": "user", "content": `${message}` }
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MULEROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        )

        return response

    } catch (error) {

        return { error: "Failed to process the message",error };

    }
}

export default assistentService;