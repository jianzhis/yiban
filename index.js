let request = require("request");
let fs = require("fs");
let options = {
  method: "GET",
  url: "https://www.yiban.cn/ajax/bbs/getListByBoard?offset=1&count=2&boardId=21NiLGrzQpVX92D&orgId=2004412",
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
    Cookie:
      "MESSAGE_NEW_VERSION=1; preview_hidden=0; https_waf_cookie=73f90cb6-a0b6-4618bb6e61fb011caca0c224138464820247; YB_SSID=be3d6f965b00afec3041accb2621bf05; timezone=-8; Hm_lvt_ed61a54fb63b75cc82ad5c1796518f16=1697464398,1697769830,1698217713,1698759582; yiban_user_token=4e9c9583043c10e1c63d1532d0610a6e; Hm_lpvt_ed61a54fb63b75cc82ad5c1796518f16=1698759602; yiban_user_token=4e9c9583043c10e1c63d1532d0610a6e",
    Host: "www.yiban.cn",
  },
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  // Parse the response body as JSON
  let parsedBody = JSON.parse(body);

  // Write the JSON data to a file
  fs.writeFile(
    "data.json",
    JSON.stringify(parsedBody, null, 2),
    function (err) {
      if (err) throw err;
      console.log("Data saved to data.json");
    }
  );
});
