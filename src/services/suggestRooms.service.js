import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.model.js";
import axios from "axios";

const suggetsRooms = async(message)=>{

    try {

         const rooms = await Room.find().select({
            roomNo:1,
            price:1,
            capacity:1,
            type:1,
            isAvailable:1
        })

        

        const response = await axios.post("https://api.mulerouter.ai/vendors/openai/v1/chat/completions",
           {
                model: "qwen3-max",
                messages: [
                    {
                        "role": "system", "content": `You are an assistant that suggest rooms match user query from this rooms data:${JSON.stringify(rooms)}. Return exactly this JSON format with no extra text: [{"_id": "","roomNo": "","price": "","capacity": "","type": ""}]` },
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
       
       
        return JSON.parse(response.data.choices[0].message.content);

    } catch (error) {
        throw new ApiError(error.statusCode,error.message) 
    }
}
   


export default suggetsRooms