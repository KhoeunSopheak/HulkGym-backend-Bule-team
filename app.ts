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

// Create a bot that uses 'polling' to fetch new updates
const bot = new telegramBot(token, { polling: true });

// Define the command list
const commands = [
  { command: "/start", description: "Start the bot and get command list" },
  { command: "/help", description: "Get help and usage instructions" },
  { command: "/contact", description: "Get contact information" },
  { command: "/promotion", description: "See current promotions" },
  { command: "/feedback", description: "Submit feedback" },
  { command: "/image", description: "Send an image" },
  { command: "/text", description: "Send a text message" },
  { command: "/link", description: "Send a link" },
  { command: "/list", description: "Send a list" },
  { command: "/table", description: "Send a table" },
  { command: "/options", description: "Send options" },
];

// Set bot commands in Telegram
bot
  .setMyCommands(commands)
  .then(() => console.log("Commands set successfully"));

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  let response = "Welcome! Here are the available commands:\n\n";
  commands.forEach((cmd) => {
    response += `${cmd.command} - ${cmd.description}\n`;
  });
  bot.sendMessage(chatId, response);
});

// Handle other commands
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "This bot allows you to access various features. Use /start to see available commands."
  );
});

bot.onText(/\/contact/, (msg) => {
  bot.sendMessage(msg.chat.id, "You can contact us at support@example.com.");
});

bot.onText(/\/promotion/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Check out our latest promotions at https://example.com/promotions"
  );
});

bot.onText(/\/feedback/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Please send your feedback here, and we will review it."
  );
});

// Handle /image command
bot.onText(/\/image/, (msg) => {
  bot.sendPhoto(msg.chat.id, "https://picsum.photos/seed/picsum/200/300", {
    caption: "Here is an image for you!",
  });
});

// Handle /text command
bot.onText(/\/text/, (msg) => {
  bot.sendMessage(msg.chat.id, "This is a sample text message.");
});

// Handle /link command
bot.onText(/\/link/, (msg) => {
  bot.sendMessage(msg.chat.id, "Check out this link: https://example.com");
});

// Handle /list command
bot.onText(/\/list/, (msg) => {
  const list = "- Item 1\n- Item 2\n- Item 3\n- Item 4";
  bot.sendMessage(msg.chat.id, `Here is your list:\n${list}`);
});

// Handle /table command
bot.onText(/\/table/, (msg) => {
  const table = `
  <pre>
  | Tables   |      Are      |  Cool |
  |----------|:-------------:|------:|
  | col 1 is |  left-aligned | $1600 |
  | col 2 is |    centered   |   $12 |
  | col 3 is | right-aligned |    $1 |
  </pre>
  `;
  bot.sendMessage(msg.chat.id, `Here is a table:\n${table}`, {
    parse_mode: "HTML",
  });
});

// Listen for any kind of message. There are different kinds of
bot.on("message", (msg) => {
  try {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    const message = handleMessage(msg) || "";
    console.log("------ ", msg);
    if (message.length > 0) bot.sendMessage(chatId, message);
  } catch (err) {
    console.log(err);
  }
});

// Handle /options command with inline buttons
bot.onText(/\/options/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Option 1", callback_data: "option_1" },
          { text: "Option 2", callback_data: "option_2" },
        ],
        [{ text: "Option 3", callback_data: "option_3" }],
      ],
    },
  };
  bot.sendMessage(chatId, "Please select an option:", options);
});

// Handle callback queries from inline buttons
bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  if (msg) {
    bot.sendMessage(msg.chat.id, `You selected: ${callbackQuery.data}`);
    bot.answerCallbackQuery(callbackQuery.id);
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
