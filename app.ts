import express from "express";
const app = express();
import auth from "./src/routes/auth";
import { AppDataSource } from "./src/config/data-source";
import { DataSource } from "typeorm";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swagger";
import cors from "cors";
import bodyParser from "body-parser";
import activity from "./src/routes/activity";
import branch from "./src/routes/branch";
import coupon from "./src/routes/coupon"
import company from "./src/routes/company";
import telegramBot from "node-telegram-bot-api";
import { handleMessage } from "./src/service/telegram.service";
import axios from "axios";

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN || "";

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(bodyParser.json());

// Swagger setup
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes setuphttps://fboxmschac.sharedwithexpose.com
app.use("/api/auth", auth);
app.use("/api/activity", activity);
app.use("/api/branch", branch);
app.use("/api/company", company);
app.use("/api/coupon", coupon);

// Create a bot that uses 'polling' to fetch new updates
const bot = new telegramBot(token, {polling: true});

const commands = [
  { command: "/start", description: "Start the bot and get command list" },
  { command: "/showtext", description: "Send a text message" },
  { command: "/showimage", description: "Send a message with an image" },
  { command: "/showoptions", description: "Send options" },
  { command: "/askquestions", description: "Send questions" },
];

bot
  .setMyCommands(commands)
  .then(() => console.log("Commands set successfully"));

  bot.onText(/\/showtext/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "Welcome to WMAD Class"
    );
  });

  bot.onText(/\/showimage/, (msg) => {
    const imageUrl = "https://res.cloudinary.com/dzimzklgj/image/upload/c_thumb,w_400/Hulk%20Gym/announcement";
    const description = `
 *1️⃣ Hulk Gym Open House – Try for Free! 🎉*\n
 *📅 Date:* March 10, 2025\n
 *📍 Location:* All Hulk Gym branches\n
 Ever wanted to experience Hulk Gym before signing up? Now’s your chance! Join us for an *exclusive Open House* where you can try our facilities *for FREE* for one day. Get access to top-notch equipment, professional trainers, and special discounts on memberships.
 *👉 Don’t miss out! Bring a friend and train together.*
 `;
     bot.sendPhoto(
       msg.chat.id, imageUrl,
       {
         caption: description,
         parse_mode: "Markdown",
       }
     );
   });

   bot.onText(/\/showoptions/, (msg) => {
    const chatId = msg.chat.id;
    const fruits = [
      [
        {
          text: "Fruit 1",
          callback_data: "showoptions=id-1",
        },
      ],
      [
        {
          text: "Fruit 2",
          callback_data: "showoptions=id-2",
        },
      ],
    ];
    
    const options = {
      reply_markup: {
        inline_keyboard: fruits,
      },
    };
    bot.sendMessage(chatId, "Choose your favourite fruit:", options);
  });
  
// Handle callback query when user selected on a fruit
bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  console.log(callbackQuery);
  if (msg) {
    bot.sendMessage(msg.chat.id, `You selected: ${callbackQuery.data}`);
    bot.answerCallbackQuery(callbackQuery.id);
  }
});

interface SurveyData {
  [key: number]: { step: number; answers: string[] };
}

const userAnswer: SurveyData = {};

const questions = [
  "1️⃣ What is your full name?",
  "2️⃣ Where do you live?"
];

bot.onText(/\/askquestions/, (msg) => {
  const chatId = msg.chat.id;

  userAnswer[chatId] = { step: 0, answers: [] };

  bot.sendMessage(chatId, questions[0]);
});

bot.on("message", (msg) => {
  try {
    console.log("Message: ", msg);
    const chatId = msg.chat.id;

    // Ignore system commands
    if (msg.text?.startsWith("/")) return;

    // Check if user is in a survey session
    if (!userAnswer[chatId]) return;

    // Store answer
    const step = userAnswer[chatId].step;
    userAnswer[chatId].answers[step] = msg.text || "";

    // Move to next question
    if (step + 1 < questions.length) {
      userAnswer[chatId].step++;
      bot.sendMessage(chatId, questions[step + 1]);
    } else {
      // Survey completed
      bot.sendMessage(
        chatId,
        `Your fullname: ${userAnswer[chatId].answers[0]}\nYour address: ${userAnswer[chatId].answers[1]}`
      );

      // Cleanup user data
      delete userAnswer[chatId];
    }
  } catch (err) {
    console.log(err);
  }
});



// Start server
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};

export default app;
