const request = require("request-promise-native"); // 使用 Promise 版本的 request
const fs = require("fs").promises;
require("dotenv").config();
const yiban_user_token = process.env.YIBAN_USER_TOKEN;
const API_URL = "https://www.yiban.cn/ajax/bbs/getListByBoard";
const SCHOOL_ID = "18117";
const BOARD_ID = "4NEcxJy1grZXq91";
const ORG_ID = "2004412";

async function getNextContent() {
  try {
    const data = await fs.readFile("./data/data.json", "utf8");
    const existingData = JSON.parse(data);

    const lastNum = existingData[existingData.length - 1]?.num || 0;
    const newOffset = lastNum + 1;

    const options = {
      method: "GET",
      uri: `${API_URL}?offset=${newOffset}&count=10&boardId=${BOARD_ID}&orgId=${ORG_ID}`,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
        Referer: `https://www.yiban.cn/school/index/id/${SCHOOL_ID}`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        "sec-ch-ua":
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        Cookie: `MESSAGE_NEW_VERSION=1; preview_hidden=0; https_waf_cookie=ac1c8da0-060b-425a8b8071f6b9b7e75132390ee733c5f864; YB_SSID=21a05b01349f782468dd1d1384c882ea; timezone=-8; Hm_lvt_ed61a54fb63b75cc82ad5c1796518f16=1697769830,1698217713,1698759582,1698815816; yiban_user_token=${yiban_user_token}; Hm_lpvt_ed61a54fb63b75cc82ad5c1796518f16=1698818122`,
        Host: "www.yiban.cn",
      },
      json: true, // 将响应自动解析为 JSON
    };

    const parsedBody = await request(options);

    const ids = parsedBody.data.list.map((item, index) => ({
      num: lastNum + index + 1,
      id: item.id,
      subject: item.subject,
      summary: item.summary,
    }));

    const mergedData = existingData.concat(ids);

    await fs.writeFile("./data/data.json", JSON.stringify(mergedData, null, 2));

    if (lastNum + 1 >= 1500) {
      console.log("Reached num 1500. Stopping execution.");
      process.exit();
    }

    console.log("New content appended to data.json");
  } catch (error) {
    console.error("Error:", error);
  }
}

setInterval(getNextContent, 5000);
