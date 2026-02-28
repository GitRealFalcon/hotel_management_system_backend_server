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
                        "role": "system", "content": `You are an assistant that extracts user intent and entities for hotel booking. Today's date is ${today}.The user message can express ONE of these intents: - check_availability- make_booking- active_booking_info- cancel_booking- suggestions Extract also these entities if present: - checkIn (date in YYYY-MM-DD)- checkOut (date in YYYY-MM-DD)- roomType (e.g., single, double, suite)- numGuests (number of people)- bookingId (unique booking identifier) Return exactly this JSON format with no extra text: {"intent": "","checkIn": "","checkOut": "","roomType": "","numGuests": "","bookingId": ""}` },
                    { "role": "user", "content": `${req.body.messages}` }
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
        return { error: "Failed to process the message" };
    }
}

export default assistentService;