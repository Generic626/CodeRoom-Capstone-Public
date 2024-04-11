# Welcome to CodeRoom 🧑‍🏫

This project is the Capstone Project for Fung Matthew Tze Ken during the year 2023-2024. [@Generic626](https://github.com/Generic626)

## Steps to run the project

Prerequisite: Have [Node.js](https://nodejs.org/en) installed and a code editor installed ([Visual Studio Code](https://code.visualstudio.com/) is recommended)

Use either the following to download the project:

1. create a folder of your choosing and open it in the code editor or terminal and type

```shell
git clone https://github.com/Generic626/CodeRoom-Capstone.git
```

OR

2. download the zip file from the repository and unzipped it in the chosen directory

## Install and run frontend

1. open terminal, and cd to frontend directory
2. type in the command to install dependencies

```shell
npm install
```

3. type in the command to run the frontend

```shell
npm run dev
```

## Install and run backend

1. create a .env file inside of the backend directory
2. if you have the env.txt, copy the contents in .env, otherwise create your own as follows:

```shell
DEFAULT_AVATAR_PATH = "/avatars/default.png"
JWT_ACCESS_SECRET = "YOUR_SECRET"
JWT_REFRESH_SECRET = "YOUR_SECRET"
JUDGE0_KEY= "YOUR_API_KEY"
PYTHON_LANGID= 72
JAVASCRIPT_LANGID= 93
MONGO_CONNECTION =  "YOUR_MONGO_CONNECT_STRING"
RAPID_API_KEY = "YOUR_API_KEY"
```

3. open another terminal, and cd to backend directory
4. type in the command to install dependencies

```shell
npm install
```

5. type in the command to run the api backend

```shell
npm run api
```

6. open another terminal and cd to backend directory
7. type in the command to run the rtc backend

```shell
npm run rtc
```
