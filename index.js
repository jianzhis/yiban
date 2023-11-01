const request = require("request");
const fs = require("fs");
require("dotenv").config();
const yiban_user_token = process.env.YIBAN_USER_TOKEN;

function getNextContent() {
  // Read existing data from the file
  fs.readFile("data.json", (err, data) => {
    if (err) throw err;

    let existingData = JSON.parse(data);

    // Get the num of the last item
    const lastNum = existingData[existingData.length - 1].num;

    // Calculate the new offset
    const newOffset = lastNum + 1;

    // Make a new request with the updated offset
    let options = {
      method: "GET",
      url: `https://www.yiban.cn/ajax/bbs/getListByBoard?offset=${newOffset}&count=10&boardId=21NiLGrzQpVX92D&orgId=2004412`,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
        Referer: "https://www.yiban.cn/school/index/id/18117",
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
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // Parse the response body as JSON
      let parsedBody = JSON.parse(body);

      // Extract ids from the list
      let ids = parsedBody.data.list.map((item, index) => {
        return {
          num: lastNum + index + 1, // 自增的值
          id: item.id,
          subject: item.subject,
          summary: item.summary,
        };
      });

      // Merge existing data with new data
      const mergedData = existingData.concat(ids);

      // Write the merged data back to the file
      fs.writeFile("data.json", JSON.stringify(mergedData, null, 2), (err) => {
        if (err) throw err;
        console.log("New content appended to data.json");

        // Check if num is 1000 and stop if true
        if (lastNum + 1 >= 1000) {
          console.log("Reached num 1000. Stopping execution.");
          process.exit(); // This will stop the script
        }
      });
    });
  });
}

// Call the function to get the next contents
setInterval(getNextContent, 60000);
