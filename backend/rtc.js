const axios = require("axios");

const io = require("socket.io")(5002, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("[socket] socket connected");

  // get notebook
  socket.on("get-notebook", async (payload) => {
    const response = await axios.get(
      `http://localhost:5001/api/notebook/${payload.notebookId}`,
      {
        headers: payload.requestHeaders,
      }
    );

    // join socket to the specified room
    socket.join(payload.notebookId);

    // sends back result data
    socket.emit("load-notebook", response.data);

    // send code changes back to the specified room
    socket.on("code-changes", (code) => {
      socket.broadcast
        .to(payload.notebookId)
        .emit("receive-code-changes", code);
    });

    // send title changes back to the specified room
    socket.on("title-changes", (title) => {
      socket.broadcast
        .to(payload.notebookId)
        .emit("receive-title-changes", title);
    });

    // send question changes back to the specified room
    socket.on("question-changes", (question) => {
      socket.broadcast
        .to(payload.notebookId)
        .emit("receive-question-changes", question);
    });

    // send readonly changes back to the specified room
    socket.on("readonly-changes", (readOnly) => {
      socket.broadcast
        .to(payload.notebookId)
        .emit("receive-readonly-changes", readOnly);
    });

    // save changes to db
    socket.on("save-notebook", async (body) => {
      await axios.patch(
        `http://localhost:5001/api/notebook/${payload.notebookId}`,
        body,
        {
          headers: payload.requestHeaders,
        }
      );
    });
  });
});
