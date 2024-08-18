# 1. Official OpenJDK base imageを使用
FROM openjdk:21-jdk-slim

# 2. 作業ディレクトリを設定
WORKDIR /app

# 3. Gradleビルドによって生成されたJARファイルをコピー
COPY build/libs/*-SNAPSHOT.jar app.jar

# 4. ポート番号を指定
EXPOSE 8080

# 5. JARファイルを実行するコマンド
ENTRYPOINT ["java", "-Dspring.profiles.active=${ENV}", "-jar", "app.jar"]