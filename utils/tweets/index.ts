import axios from "axios"

export const gettweetresponse = async (tweetId: string) => {
    const tweetInfo = await axios.post(`https://twitter-api-v1-1-enterprise.p.rapidapi.com/base/apitools/tweetSimple?cursor=-1&apiKey=${process.env.RAPID_APIKEY}&resFormat=json&id=${tweetId}`,
        {}, {
       headers: {
       id: tweetId,
           "x-rapidapi-key": process.env.RAPID_APIKEY_V2,
           "x-rapidapi-host": "twitter-api-v1-1-enterprise.p.rapidapi.com",
           "Content-Type": "application/json"
       }
   })

   return tweetInfo
}