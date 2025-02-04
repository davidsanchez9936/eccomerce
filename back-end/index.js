const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const {
    readdirSync
} = require("fs")
const {
    mongoURL
} = require("./keys.js");
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const PORT = process.env.PORT || 3000;
mongoose.connect(mongoURL)



//middlewares
app.use(morgan("dev"))
app.use(bodyParser.json({
    limit: "2mb"
}))
/* app.use(cors()); */
app.use(
    cors({
      origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
          `http://localhost:5175`,
        ];
        if (ACCEPTED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }
        if (!origin) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
    })
  );
//mongoose
mongoose.connection.on("error", () => {
    console.log("not connectedconnected to mongoDB");
})

mongoose.connection.on("connected", () => {
    console.log("succesfully connected to mongoDB");
})
//route middleware
readdirSync('./routes').map((r) => app.use("/api", require("./routes/" + r)))

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});