const cache = require("memory-cache");
const request = require("request");
const fs = require("fs");

let currentIndex = cache.get("currentIndex") || 0;
console.log("Current Index:", currentIndex);

// 点赞API
function thumbPost(postId) {
  const options = {
    method: "POST",
    url: "https://s.yiban.cn/api/post/thumb",
    headers: {
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
      Cookie:
        "MESSAGE_NEW_VERSION=1; preview_hidden=0; https_waf_cookie=ac1c8da0-060b-425a8b8071f6b9b7e75132390ee733c5f864; YB_SSID=21a05b01349f782468dd1d1384c882ea; timezone=-8; Hm_lvt_ed61a54fb63b75cc82ad5c1796518f16=1697769830,1698217713,1698759582,1698815816; yiban_user_token=d5f492d4b24a90f4218492d22fcdc5f5; Hm_lpvt_ed61a54fb63b75cc82ad5c1796518f16=1698818122",
      "Content-Type": "application/json",
      Host: "s.yiban.cn",
    },
    body: JSON.stringify({
      action: "up",
      postId: postId,
      userId: "5375816",
    }),
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

fs.readFile("data.json", "utf8", (err, data) => {
  if (err) {
    console.error("读取文件时发生错误", err);
    return;
  }

  const jsonData = JSON.parse(data);

  // 定义处理函数
  function processItem(index) {
    if (index < jsonData.length) {
      const currentItem = jsonData[index];
      const itemId = currentItem.id;
      const NumId = currentItem.num;

      // 在这里处理你的数据
      console.log("Current Item ID:", itemId, NumId);

      thumbPost(itemId);

      // 更新索引
      currentIndex++;
      cache.put("currentIndex", currentIndex);

      // 延迟两秒后处理下一个数据
      setTimeout(() => {
        processItem(index + 1);
      }, 5000);
    }
  }

  // 开始处理数据
  processItem(currentIndex);
});
