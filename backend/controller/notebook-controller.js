const Notebook = require("../models/notebook");
const User = require("../models/user");
const mongoose = require("mongoose");

// [POST] handles create notebook request
// [DESC] creates a default notebook template based on the language selected
// [RETURNS] the created notebooks's id
const createNotebook = async (req, res, next) => {
  // 1. get language from request body
  const { lang } = req.body;
  const user = req.user;
  try {
    // 2. create notebook template based on language
    const templateCode = {
      python: {
        title: "Template Notebook - python",
        code: "# Write code as you please",
      },
      javascript: {
        title: "Template Notebook - javascript",
        code: "// Write code as you please",
      },
    };

    const templateQuestion = "<p>Type your question here</p>";
    // 3. save notebook to mongoDB
    const today = new Date();
    const newNotebook = new Notebook({
      code: templateCode[lang].code,
      question: templateQuestion,
      readOnly: false,
      title: templateCode[lang].title,
      cloned: false,
      type: lang,
      createdDate: today,
      author: { email: user.email, avatar: user.avatar },
      sharedWith: [],
      lastOpenAt: today,
    });

    // 4. return created notebook's id back
    newNotebook.save().then((savedNotebook) => {
      const notebookId = savedNotebook._id;
      console.log("[createNotebook] success");
      res.status(201).json({ id: notebookId });
    });
  } catch (error) {
    console.log("[createNotebook] internal server error");
    res.status(500).json({ message: "Internal Server Error has occurred" });
  }
};

// [PATCH] handles update notebook request
// [DESC] updates the selected notebook
// [RETURNS] successful message
const updateNotebook = async (req, res, next) => {
  const { code, title, question, readOnly } = req.body;
  const today = new Date();

  const updateNotebook = {
    lastOpenAt: today,
  };

  if (code) {
    updateNotebook.code = code;
  }

  if (title) {
    updateNotebook.title = title;
  }

  if (question) {
    updateNotebook.question = question;
  }

  if (readOnly) {
    updateNotebook.readOnly = readOnly;
  }

  try {
    const updatedNotebook = await Notebook.findByIdAndUpdate(
      req.params.id,
      { $set: updateNotebook },
      { new: true }
    );
    if (!updatedNotebook) {
      console.log("[updateNotebook] notebook not found error");
      return res.status(404).json({ message: "Notebook not found" });
    }
    console.log("[updateNotebook] success");
    res.status(200).json(updatedNotebook);
  } catch (error) {
    console.log("[updateNotebook] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [DELETE] handles update notebook request
// [DESC] updates the selected notebook
// [RETURNS] successful message
const deleteNotebook = async (req, res, next) => {
  try {
    // 1. retrieve id from parameter
    const id = req.params.id;
    // 2. issue delete request using id
    const deletedNotebook = await Notebook.findByIdAndDelete(id);
    // if there is no such notebook, return 404 not found error
    if (!deletedNotebook) {
      console.log("[deleteNotebook] notebook not found error");
      return res.status(404).json({ message: "Notebook does not exist" });
    }
    // else return delete successfully
    console.log("[deleteNotebook] success");
    res.status(200).json({ message: "Notebook deleted successfully" });
  } catch (error) {
    console.log("[deleteNotebook] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [PATCH] handles share notebook request
// [DESC] updates the selected notebook's shared with field
// [RETURNS] successful message
const shareNotebook = async (req, res, next) => {
  // 1. retrieve target email from request body
  const { sharedWith } = req.body;
  let profiles = [];

  for (const email of sharedWith) {
    try {
      const user = await User.findOne(
        { email },
        { _id: 0, email: 1, avatar: 1 }
      );
      if (user) {
        profiles.push({ email, avatar: user.avatar });
      }
    } catch (error) {
      console.log("[shareNotebook] could not find appropriate avatars");
      res.status(500).json({ message: "An error occurred" });
    }
  }

  console.log(profiles);

  const today = new Date();
  // const updateNotebook = {
  //   sharedWith: profiles,
  //   lastOpenAt: today,
  // };
  const updateNotebook = {
    sharedWith: profiles.map(({ email, avatar }) => ({ email, avatar })),
    lastOpenAt: today,
  };

  // attempt to save notebook
  try {
    const updatedNotebook = await Notebook.findByIdAndUpdate(
      req.params.id,
      { $set: updateNotebook },
      { new: true }
    );
    if (!updatedNotebook) {
      console.log("[shareNotebook] notebook not found error");
      return res.status(404).json({ message: "Notebook not found" });
    }
    console.log("[shareNotebook] success");
    res.status(200).json(updatedNotebook);
    // res.sendStatus(200);
  } catch (error) {
    console.log(error);

    console.log("[shareNotebook] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [GET] handles get notebook request by id
// [DESC] retrieve the specified notebook based by id
// [RETURNS] successful message
const getNotebookByNotebookId = async (req, res, next) => {
  try {
    // 1. retrieve id from parameter
    const id = req.params.id;
    // 2. issue a get request using the id
    const notebook = await Notebook.findById(id);
    // if there is no such notebook, return 404 not found error
    if (!notebook) {
      console.log("[getNotebookByNotebookId] notebook not found error");
      return res.status(404).json({ message: "Notebook does not exist" });
    }
    // else return delete successfully
    console.log("[getNotebookByNotebookId] success");
    res.status(200).json(notebook);
  } catch (error) {
    console.log("[getNotebookByNotebookId] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [GET] handles get notebook request by author's id
// [DESC] retrieve the specified notebook based by author's id
// [RETURNS] successful message
const getNotebookByAuthorEmail = async (req, res, next) => {
  // 1. retrieve the email from the request body
  const email = req.user.email;

  try {
    // 2. issue a get request using the provided email
    const notebooks = await Notebook.find({ "author.email": email });
    console.log("[getNotebookByAuthorEmail] success");
    res.status(200).json(notebooks);
  } catch (error) {
    console.log("[getNotebookByAuthorEmail] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [GET] handles get notebook request by the shared with user's id
// [DESC] retrieve the specified notebook based by shared with user's id
// [RETURNS] successful message
const getNotebookBySharedWithEmail = async (req, res, next) => {
  // 1. retrieve the email from the request body
  const email = req.user.email;
  try {
    // 2. issue a get request using the provided email
    const notebooks = await Notebook.find({
      "sharedWith.email": { $in: [email] },
    });
    console.log("[getNotebookBySharedWithEmail] success");
    res.status(200).json(notebooks);
  } catch (error) {
    console.log("[getNotebookBySharedWithEmail] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [GET] handles get notebook request by the latest last opeded date
// [DESC] retrieve the specified notebook based by the latest last opeded date
// [RETURNS] successful message
const getNotebookByLastOpened = async (req, res, next) => {
  // 1. retrieve the email from the request body
  const email = req.user.email;
  try {
    // 2. issue a get request using the provided email
    const notebooks = await Notebook.find({
      $or: [{ "author.email": email }, { "sharedWith.email": email }],
    })
      .sort({ lastOpenAt: "desc" })
      .exec();
    console.log("[getNotebookByLastOpened] success");
    res.status(200).json(notebooks);
  } catch (error) {
    console.log("[getNotebookByLastOpened] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [POST] handles clone notebook request
// [DESC] will duplicate the provided notebook and set its author to the sharedWith users
// [RETURNS] successful message
// const cloneNotebook = async (req, res, next) => {
//   const notebookId = req.params.notebookId;

//   // get notebook by id
//   const notebook = await Notebook.findById(notebookId);

//   if (notebook.sharedWith.length == 0) {
//     res.status(500).json({ message: "No notebooks to be cloned" });
//   }

//   try {
//     // loop throught the given notebooks sharedWith and clone the notebooks accordingly
//     for (let i = 0; i < notebook.sharedWith.length; i++) {
//       const sharedWithEmail = notebook.sharedWith[i].email;
//       const newNotebookJSON = {
//         ...notebook.toObject(),
//         _id: new mongoose.Types.ObjectId(),
//         title: "(clone) " + notebook.title,
//         sharedWith: [{ email: sharedWithEmail }],
//       };

//       const newNotebook = new Notebook(newNotebookJSON);
//       await newNotebook.save();
//     }

//     res.status(200).json({ message: "Cloned Success" });
//   } catch (error) {
//     console.log("[cloneNotebook] internal server error");
//     console.log(error);

//     res.status(500).json({ message: "An error occurred" });
//   }
// };

const cloneNotebook = async (req, res, next) => {
  const notebookId = req.params.notebookId;

  // const { email } = req.body;

  const email = req.user.email;

  const notebook = await Notebook.findById(notebookId);

  try {
    const newAuthor = email;
    const newSharedWithEmail = notebook.author.email;

    const newNotebookJSON = {
      ...notebook.toObject(),
      _id: new mongoose.Types.ObjectId(),
      title: "(clone) " + notebook.title,
      cloned: true,
      author: { email: newAuthor },
      sharedWith: [{ email: newSharedWithEmail }],
    };

    const newNotebook = new Notebook(newNotebookJSON);
    await newNotebook.save();

    res.status(200).json({ message: "Cloned Success" });
  } catch (error) {
    console.log("[cloneNotebook] internal server error");
    console.log(error);

    res.status(500).json({ message: "An error occurred" });
  }
};

exports.createNotebook = createNotebook;
exports.updateNotebook = updateNotebook;
exports.deleteNotebook = deleteNotebook;
exports.shareNotebook = shareNotebook;
exports.getNotebookByNotebookId = getNotebookByNotebookId;
exports.getNotebookByAuthorEmail = getNotebookByAuthorEmail;
exports.getNotebookBySharedWithEmail = getNotebookBySharedWithEmail;
exports.getNotebookByLastOpened = getNotebookByLastOpened;
exports.cloneNotebook = cloneNotebook;
