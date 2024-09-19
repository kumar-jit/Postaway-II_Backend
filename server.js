import { app } from "./index.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
// port configure
const PORT = process.env.PORT || 8100

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectUsingMongoose();
})