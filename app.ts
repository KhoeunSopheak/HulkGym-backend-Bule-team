import express from "express";
const app = express();
import auth from "./src/routes/auth";
import { AppDataSource } from "./src/config/data-source";
import { DataSource } from "typeorm";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swagger";
import cors from "cors";
import bodyParser, { text } from "body-parser";
import activity from "./src/routes/activity";
import branch from "./src/routes/branch";
import coupon from "./src/routes/coupon"
import company from "./src/routes/company";
import telegramBot from "node-telegram-bot-api";
import { handleMessage } from "./src/service/telegram.service";
import axios from "axios";
import { Branch } from "./src/entity/branch.entity";
import { Promotion } from "./src/entity/promotion.entity";
import news from "./src/routes/new";
import promotion from "./src/routes/promotion"
import workout from "./src/routes/workout";
import { Workout_plan} from "./src/entity/workout_plan.entity"

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
app.use("/api/news",news);
app.use("/api/promotion",promotion);
app.use("/api/workout", workout);

// Create a bot that uses 'polling' to fetch new updates
const bot = new telegramBot(token, { polling: true });

const commands = [
  { command: "/start", description: "Start the bot and get command list" },
  {
    command: "/openminiapp",
    description: "Open Mini App",
    web_app: { url: "https://tg-miniapp4dev.vercel.app/" }
  },
  { command: "/help", description: "Get help and usage instructions" },
  { command: "/branches", description: "Get branch place" },
  { command: "/contact", description: "Get contact information" },
  { command: "/promotion", description: "See current promotions" },
  { command: "/workouts", description: "See workouts" },
  { command: "/feedback", description: "Submit feedback" },
  { command: "/image", description: "Send an image" },
  { command: "/text", description: "Send a text message" },
  { command: "/link", description: "Send a link" },
  { command: "/list", description: "Send a list" },
  { command: "/table", description: "Send a table" },
  { command: "/options", description: "Send options" },
  { command: "/showtext", description: "Send a text message" },
  { command: "/showimage", description: "Send a message with an image" },
  { command: "/showoptions", description: "Send options" },
  { command: "/askquestions", description: "Send questions" },
];

bot
  .setMyCommands(commands)
  .then(() => console.log("Commands set successfully"));

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `*💪 Welcome to Hulkgym-Bot!*
      Stay fit, stay updated, and enjoy exclusive perks! Here’s what you can do:

📌 *Commands:*

✅ /promotions – Check out the latest deals & discounts!

🎟 /freecoupons – Grab limited-time free coupons!

💰 /pricing – View membership and service pricing.

📰 /news – Get the latest updates and announcements.

🏋️ /workouts – Explore workout plans & fitness tips.

📋 /survey – Share your feedback & help us improve.

📋 /branches – View all branches of Hulk Gym.

🚀 /joinus – Become a member and start your journey!

❤️ /survey – Help us to improve our customer experience by giving a survey.

📜 /mymembership – View your membership details.

🔔 /subscribe – Stay updated with notifications.`,
  );
});

bot.onText(/\/showtext/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to WMAD Class"
  );
});

const img = "https://plus.unsplash.com/premium_photo-1682310158823-917a4f726802?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvbW90aW9ufGVufDB8fDB8fHww";

bot.onText(/\/promotion/, async (msg) => {
  const promotionRepo = AppDataSource.getRepository(Promotion);
  const branchRepo = AppDataSource.getRepository(Branch);

  try {
    const promotion = await promotionRepo.find({
      order: { createAt: "DESC" },
    });

    if (promotion.length === 0) {
      return bot.sendMessage(msg.chat.id, "No promotion found.");
    }

    for (const promotions of promotion) {
      const branches = await branchRepo.findOne({ where: { id: promotions.branch.id } });
  
      if (!branches) {
        return bot.sendMessage(msg.chat.id, "No branches found.");
      }
  
      await bot.sendPhoto(msg.chat.id, img, {
        caption: `📢 *${promotions.title}* 📢 \n\n\n📌 *Location:* ${branches.name}\n\n🔥 *Discount:* *${promotions.percentage}%* 🔥 \n\n📅 *End-date:* *${promotions.end_date}*\n\n📝 *Description:* ${promotions.description}`,
        parse_mode: "Markdown",
      });
    }
  } catch (error) {
    console.error("Error fetching promotion:", error);
    bot.sendMessage(msg.chat.id, "Failed to fetch promotion. Please try again later.");
  }
});



// Handle other commands
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "This bot allows you to access various features. Use /start to see available commands."
  );
});

bot.onText(/\/branches/, async (msg) => {
  const chatId = msg.chat.id;
  const branchRepo = AppDataSource.getRepository(Branch);

  const branches = await branchRepo.find();

  if (branches.length === 0) {
    bot.sendMessage(chatId, "No branches found.");
    return;
  }

  const branch = branches.map((gym) => ({
    text: gym.name,
    callback_data: `branchs=${gym.name}`,
  }));

  const options = {
    reply_markup: {
      inline_keyboard: [branch],
    },
  };

  bot.sendMessage(chatId, "Choose your location branch of Hulk_gym:", options);
});

bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message;
  const selectedOption = callbackQuery.data;
  const branchRepo = AppDataSource.getRepository(Branch);

  if (!msg || !selectedOption) {
    return;
  }

  const branch = await branchRepo.findOneBy({ name: selectedOption.split("=")[1] });
  if (!branch) {
    bot.sendMessage(msg.chat.id, "Branch not found.");
    return;
  }

  const name = branch.name;
  const open_time = branch.open_time;
  const close_time = branch.close_time;
  const location = branch.location;
  const image = branch.image;

  if (image) {
    bot.sendPhoto(msg.chat.id, image, {
      caption: `*${name} Branch*\n\n⏰ *Open time:* ${open_time}\n⏰ *Close time:* ${close_time}\n\n📍 *Location:* ${location}`,
      parse_mode: "Markdown",
    });
  } else {
    bot.sendMessage(msg.chat.id, `*${name}*\n\n📍 *Location:* ${location}`, {
      parse_mode: "Markdown",
    });
  }

  bot.answerCallbackQuery(callbackQuery.id);
});



bot.onText(/\/contact/, (msg) => {
  bot.sendMessage(msg.chat.id, "You can contact Rika.")});

bot.onText(/\/workouts/, async (msg) => {
  const workoutRepo = AppDataSource.getRepository(Workout_plan);

  try {
    const workouts = await workoutRepo.find({
      take: 10,
      order: { create_at: "DESC" },
    });

    if (workouts.length === 0) {
      return bot.sendMessage(msg.chat.id, "No workout plan found.");
    }

    const options = {
      reply_markup: {
        inline_keyboard: workouts.map(workout => [
          {
            text: `🏋🏼‍♂️${workout.name}`,
            callback_data: `${workout.id}`,
          }
        ]),
      },
    };
      bot.sendMessage(msg.chat.id, "You can view Hulk Gym Workout Plans.", options);
    }catch (error) {
      console.error("Error fetching branches:", error);
      bot.sendMessage(msg.chat.id, "Failed to fetch branches. Please try again later.");
    }
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
