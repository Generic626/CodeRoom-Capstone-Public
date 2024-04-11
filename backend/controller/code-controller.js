const axios = require("axios");

const commonOptions = {
  params: {
    base64_encoded: "true",
    fields: "*",
  },
  headers: {
    "content-type": "application/json",
    "Content-Type": "application/json",
    "X-RapidAPI-Key": "b5472446acmshc5b1de911fc975cp190724jsn3a3dc33e6285",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  },
};

async function createSubmission(langId, sourceCode, stdin) {
  const options = {
    ...commonOptions,
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    data: {
      language_id: langId,
      source_code: sourceCode,
      stdin: stdin,
    },
  };

  const result = await axios.request(options);
  return result.data.token;
}

async function getSubmissionResult(token) {
  const options = {
    ...commonOptions,
    method: "GET",
    url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
  };

  const response = await axios.request(options);
  if (response.data.stderr) {
    return response.data.stderr;
  }
  return response.data.stdout;
}

const submitCodeRequest = async (req, res, next) => {
  const { lang, sourceCode, stdin } = req.body;

  const langId = lang.toLowerCase() == "python" ? 72 : 63;

  try {
    // Create Submission
    await createSubmission(langId, btoa(sourceCode), btoa(stdin)).then(
      // async (token) => {
      //   setTimeout(async () => {
      //     console.log("[submitCodeRequest] token created");

      //     // Get Submission
      //     await getSubmissionResult(token).then((stdout) => {
      //       console.log("[submitCodeRequest] retrieved request");
      //       res.status(200).json({ output: atob(stdout) });
      //     });
      //   }, 3000);
      // }
      async(token)=>{
        console.log("[submitCodeRequest] token created");

          // Get Submission
          await getSubmissionResult(token).then((stdout) => {
            console.log("[submitCodeRequest] retrieved request");
            res.status(200).json({ output: atob(stdout) });
          });
      }
    );
  } catch (error) {
    console.log("[submitCodeRequest] internal server error");
    console.log(error);
    res.sendStatus(500);
  }
};

exports.submitCodeRequest = submitCodeRequest;
