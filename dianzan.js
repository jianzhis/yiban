const request = require("request");
const fs = require("fs");
require("dotenv").config();
const yiban_user_token = process.env.YIBAN_USER_TOKEN;
const yiban_user_id = process.env.YIBAN_USER_ID;

let currentIndex = 0;
const file = "db.txt";

function readCurrentIndex() {
  try {
    currentIndex = parseInt(fs.readFileSync(file, "utf8")) || 0;
    console.log("Current Index:", currentIndex);
  } catch (error) {
    console.error("读取文件时发生错误", error);
  }
}

function updateCurrentIndex() {
  try {
    fs.writeFileSync(file, currentIndex.toString());
    console.log("写入成功");
  } catch (err) {
    console.error("写入文件时发生错误", err);
  }
}

function thumbPost(postId) {
  const options = {
    method: "POST",
    url: "https://s.yiban.cn/api/post/thumb",
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
      Cookie: `MESSAGE_NEW_VERSION=1; preview_hidden=0; https_waf_cookie=ac1c8da0-060b-425a8b8071f6b9b7e75132390ee733c5f864; YB_SSID=21a05b01349f782468dd1d1384c882ea; timezone=-8; Hm_lvt_ed61a54fb63b75cc82ad5c1796518f16=1697769830,1698217713,1698759582,1698815816; yiban_user_token=${yiban_user_token}; Hm_lpvt_ed61a54fb63b75cc82ad5c1796518f16=1698818122`,
      Host: "s.yiban.cn",
    },
    body: JSON.stringify({
      action: "up",
      postId: postId,
      userId: yiban_user_id,
    }),
  };

  request(options, function (error, response, body) {
    if (error) {
      console.error("发送请求时发生错误", error);
      return;
    }

    try {
      const responseData = JSON.parse(body);
      console.log("响应数据:", responseData);
    } catch (parseError) {
      console.error("解析响应数据时发生错误", parseError);
    }
  });
}

function processItem(index, jsonData) {
  if (index < jsonData.length) {
    const currentItem = jsonData[index];
    const itemId = currentItem.id;
    const numId = currentItem.num;

    console.log("Current Item ID:", itemId, numId);

    thumbPost(itemId);

    currentIndex++;

    updateCurrentIndex();

    setTimeout(() => {
      processItem(index + 1, jsonData);
    }, 5000);
  }
}

readCurrentIndex();

fs.readFile("data.json", "utf8", (err, data) => {
  if (err) {
    console.error("读取文件时发生错误", err);
    return;
  }

  const jsonData = JSON.parse(data);

  processItem(currentIndex, jsonData);
});
