const fs = require("fs");
const { execSync } = require("child_process");
const crypto = require("crypto");

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
};

const emojis = {
  success: "✅",
  warning: "⚠️",
  info: "ℹ️",
  error: "❌",
};

(async function setup() {
  console.log(
    colors.cyan,
    `${emojis.info} Starting setup process...`,
    colors.reset
  );

  const openaiApiKey = 'sk-gznVtVrwsLR_lkduoPOi3E3LyctCD54p9QVnwY4EVfT3BlbkFJJA-9oGKyOvuFvcTMgC4uM7pj_MIoax3F3UkxpNMe0A';
  const mongodbUser = 'OliverJa';
  const mongodbPassword = 'ErgSo2497';
  const mongodbUrl = 'mongodb+srv://OliverJa:ErgSo2497@cluster0.vs2kc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const mongodbDbName = 'myDatabase';

  const openaiApiKey = await ask(
    `${colors.yellow}Enter your OPENAI_API_KEY: ${colors.reset}`
  );
  const mongodbUser = await ask(
    `${colors.yellow}Enter your MONGODB_USER: ${colors.reset}`
  );
  const mongodbPassword = await ask(
    `${colors.yellow}Enter your MONGODB_PASSWORD: ${colors.reset}`
  );
  const mongodbUrl = await ask(
    `${colors.yellow}Enter your MONGODB_URL: ${colors.reset}`
  );
  const mongodbDbName = await ask(
    `${colors.yellow}Enter your MONGODB_DB_NAME: ${colors.reset}`
  );

  const frontendUrl = "https://lexifire321.web.app";

  const jwtSecretKey = crypto.randomBytes(16).toString("hex");

  const envContent = `
  OPENAI_API_KEY="${openaiApiKey}"
  MONGODB_USER="${mongodbUser}"
  MONGODB_PASSWORD="${mongodbPassword}"
  MONGODB_URL="${mongodbUrl}"
  MONGODB_DB_NAME="${mongodbDbName}"
  FRONTEND_URL="${frontendUrl}"
  JWT_SECRET_KEY="${jwtSecretKey}"
  PORT=5000
  `.trim();

  fs.writeFileSync(".env", envContent);

  console.log(
    colors.green,
    `${emojis.success} .env file created successfully.`,
    colors.reset
  );

  console.log(
    colors.cyan,
    `${emojis.info} Installing dependencies...`,
    colors.reset
  );
  execSync("npm i", { stdio: "inherit" });

  console.log(colors.cyan, `${emojis.info} Installing types...`, colors.reset);
  execSync("npm i --save-dev @types/node", { stdio: "inherit" });

  console.log(
    colors.cyan,
    `${emojis.info} Building the project...`,
    colors.reset
  );
  execSync("npm run build", { stdio: "inherit" });

  // Hardcoded admin username and password
  const adminUsername = 'OliverJa';
  const adminPassword = 'ErgSo2497';

  console.log(
    colors.cyan,
    `${emojis.info} Creating admin user with hardcoded credentials...`,
    colors.reset
  );

  try {
    execSync(
      `node build/server.js create-user ${adminUsername} ${adminPassword}`,
      { stdio: "inherit" }
    );
    console.log(colors.green, `${emojis.success} Admin user created successfully!`, colors.reset);
  } catch (error) {
    console.error(colors.red, `${emojis.error} Error creating admin user.`, colors.reset);
    process.exit(1);
  }

  console.log(colors.green, `${emojis.success} Setup complete!`, colors.reset);
})();
