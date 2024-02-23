# Sử dụng một hình ảnh có sẵn của Node.js
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các tệp package.json và package-lock.json vào thư mục /app
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục /app
COPY . .

# Expose cổng 8080
EXPOSE 8008

# Chạy ứng dụng Express khi container được khởi chạy
CMD [ "npm", "dev" ]