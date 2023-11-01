# 使用一个带有 Node.js 的基础镜像
FROM node:14

# 设置工作目录
WORKDIR /usr/src/app

# 将项目文件复制到工作目录中
COPY . .

# 默认命令，可以根据你的项目需要进行修改
CMD [ "node", "index.js" ]