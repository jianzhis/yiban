const express = require("express");
const bodyParser = require("body-parser");
const rp = require("request-promise-native");
const fs = require("fs").promises;
const cron = require("cron").CronJob;
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));

let yiban_user_token = "";
let yiban_user_ssid = "";
let yiban_user_id = "";
let currentIndex = 0;
let requestCount = 0;

const file = "db.txt";
const TIMEOUT_MS = process.env.TIMEOUT_MS || 5000;

async function readCurrentIndex() {
  try {
    const data = await fs.readFile(file, "utf8");
    return parseInt(data) || 0;
  } catch (error) {
    console.error("读取文件时发生错误", error);
    return 0;
  }
}

async function updateCurrentIndex() {
  try {
    await fs.writeFile(file, currentIndex.toString());
    console.log("写入成功");
  } catch (err) {
    console.error("写入文件时发生错误", err);
  }
}

async function thumbPost(postId) {
  const options = {
    method: "POST",
    uri: "https://s.yiban.cn/api/post/thumb",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      Connection: "keep-alive",
      Origin: "https://s.yiban.cn",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      platform: "yiban_web",
      "sec-ch-ua":
        '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      Cookie: `MESSAGE_NEW_VERSION=1; preview_hidden=0; https_waf_cookie=ac1c8da0-060b-425a8b8071f6b9b7e75132390ee733c5f864; YB_SSID=${yiban_user_ssid}; timezone=-8; Hm_lvt_ed61a54fb63b75cc82ad5c1796518f16=1697769830,1698217713,1698759582,1698815816; yiban_user_token=${yiban_user_token}; Hm_lpvt_ed61a54fb63b75cc82ad5c1796518f16=1698818122`,
      Host: "s.yiban.cn",
    },
    body: {
      action: "up",
      postId: postId,
      userId: yiban_user_id,
    },
    json: true,
  };

  try {
    const responseData = await rp(options);
    console.log("响应数据:", responseData);
    return responseData; // 返回响应数据
  } catch (error) {
    console.error("发送请求时发生错误", error);
    return { error: "发送请求时发生错误" }; // 返回错误信息
  }
}

async function processItem(index, jsonData, socket) {
  if (index < jsonData.length && requestCount < 30) {
    const currentItem = jsonData[index];
    const itemId = currentItem.id;

    console.log("Current Item ID:", itemId);

    const response = await thumbPost(itemId);

    currentIndex++;
    requestCount++;

    await updateCurrentIndex();

    if (socket) {
      socket.emit("progress", { currentIndex, requestCount, response });
    }

    setTimeout(() => {
      processItem(index + 1, jsonData, socket);
    }, TIMEOUT_MS);
  }
}

app.use(express.static(__dirname + "/public"));

const job = new cron("0 0 * * *", async () => {
  if (yiban_user_token && yiban_user_ssid) {
    yiban_user_id = process.env.YIBAN_USER_ID;
    currentIndex = await readCurrentIndex();
    requestCount = 0;

    try {
      const data = await fs.readFile("data.json", "utf8");
      const jsonData = JSON.parse(data);
      await processItem(currentIndex, jsonData, null);
    } catch (error) {
      console.error("发生错误", error);
    }
  }
});

job.start();

io.on("connection", (socket) => {
  socket.on("start", async () => {
    if (yiban_user_token && yiban_user_ssid) {
      currentIndex = await readCurrentIndex();
      requestCount = 0;

      try {
        const data = await fs.readFile("data.json", "utf8");
        const jsonData = JSON.parse(data);
        await processItem(currentIndex, jsonData, socket);
      } catch (error) {
        console.error("发生错误", error);
      }
    }
  });
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
