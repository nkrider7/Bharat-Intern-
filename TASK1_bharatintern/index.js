const express=require("express"); //framework of nodejs which helps to simplify application process
const mongoose=require("mongoose");
const bodyParser=require("body-parser") ; //data which comes from client to server is complex so it helps by converting in readable form
const dotenv= require("dotenv"); //

const app=express();  //express instant
dotenv.config();

const port = process.env.PORT || 3000;


mongoose.connect(`mongodb://127.0.0.1:27017/ragis`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("connection successful")).catch((err) => console.log("Not Connect :"+ err));


const registrationSchema = new mongoose.Schema({

    name: String,
    
    email: String,
    
    password: String
    
    });


const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({extended: true })); 

app.use(bodyParser.json());



app.get("/",(req,res)=>
{
    res.sendFile(__dirname + "/frontened/index.html");
})

app.post("/register",async(req,res)=>
{
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });

        // check for existing user
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password,
            });

            await registrationData.save();
            res.redirect("/success");
        } else {
            // Alerting on the server side won't work, consider sending a message to the client or logging
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.log("Error:", error);
        res.redirect("/error");
    }
})

app.get("/success", (req, res)=>{

    res.sendFile (__dirname+"/frontened/success.html");
    
    })
    
    app.get("/error", (req, res)=>{
    
    res.sendFile (__dirname+"/frontened/error.html");
    })


app.listen(port, () => {
    console.log("Server is running on port " + port);
});