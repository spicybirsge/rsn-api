require("dotenv").config()
const express = require('express');
const app = express()
const logger = require('morgan')
const cors = require("cors")
const authorizer = require("./middleware/authorizer")
const fetch = require('node-fetch')

app.use(logger('dev'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/latest_video', authorizer, async(req, res) => {
    const channel_id = 'UCo-Z-aFPvCJ-YCOAmUPBVTw'

   

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel_id}&maxResults=3&order=date&type=video&key=${process.env.GOOGLE_API_KEY}`;

    const r = await fetch(url, {
        method: 'GET'
    })

    const data = await r.json()
    const videoids = []
    for(const v of data.items) {
        videoids.push(v.id.videoId)
    }
    return res.json({last_video_id: data.items[0].id.videoId, last_3: videoids})

})


const PORT = process.env.PORT || 5081

app.listen(PORT, () => {
    console.log("[^] Server started on PORT: "+PORT)
})