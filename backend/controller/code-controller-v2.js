const axios = require("axios");
require("dotenv").config();

const key = process.env.RAPID_API_KEY;

const commonOptions = {
  headers: {
    "content-type": "application/json",
    "x-compile": "rapidapi",
    "Content-Type": "application/json",
    "X-RapidAPI-Key": `${key}`,
    "X-RapidAPI-Host": "code-compiler10.p.rapidapi.com",
  },
};

const submitCodeRequest = async (req, res, next) => {
  const { lang, sourceCode, stdin } = req.body;

  const landIdentifier = lang == "javascript" ? "nodejs" : lang;

  // /* Write code as you please*/\r\n

  try {
    console.log("[submitCodeRequest] processing");
    const payload = {
      ...commonOptions,
      method: "POST",
      url: "https://code-compiler10.p.rapidapi.com/",
      data: {
        langEnum: [
          "php",
          "python",
          "c",
          "c_cpp",
          "csharp",
          "kotlin",
          "golang",
          "r",
          "java",
          "typescript",
          "nodejs",
          "ruby",
          "perl",
          "swift",
          "fortran",
          "bash",
        ],
        lang: landIdentifier,
        code:
          landIdentifier == "nodejs"
            ? "/*extra padding to prevent api from error*/\r\n" + sourceCode
            : sourceCode,
        input: stdin,
      },
    };

    const response = await axios.request(payload);

    res.status(200).json({ output: response.data.output });
  } catch (error) {
    console.log("[submitCodeRequest] internal server error");
    // console.log(error);
    res.sendStatus(500);
  }
};

exports.submitCodeRequest = submitCodeRequest;
