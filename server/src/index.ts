import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "./models/userModel";
import Conversation from "./models/conversationModel";
import Message from "./models/messageModel";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
const multer = require("multer");
//const upload = multer({ dest: "public/files" });

// var storage = multer.diskStorage(
//   {
//       destination: 'public/files',
//       filename: function ( req:any, file:any, cb:any ) {
//           //req.body is empty...
//           //How could I get the new_file_name property sent from client here?
//           cb( null, req.body.filename+file.originalname.slice(file.originalname.indexOf(".")) );
//       }
//   }
// );

// var upload = multer( { storage: storage } );

console.log("test!");

const app = express();
const port = 5000;

connectDB();

app.use(cors());

app.get("/", (_, res) => {
  res.status(200).send();
});

app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

// Handle register
app.post(
  "/api/register",
  [
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Prosze podać hasło")
      .isLength({ min: 8 })
      .withMessage("Hasło musi mieć min 8 znaków")
      .matches(/(?=.*?[A-Z])/)
      .withMessage("Hasło musi mieć przynajmniej jeden duzy znak")
      .matches(/(?=.*?[a-z])/)
      .withMessage("Hasło musi mieć przynajmniej jeden mały znak")
      .matches(/(?=.*?[0-9])/)
      .withMessage("Hasło musi mieć przynajmniej jeden numer")
      .not()
      .matches(/^$|\s+/)
      .withMessage("Znaki biały są niedozwolone"),
    check("mail")
      .isEmail()
      .escape()
      .trim()
      .normalizeEmail()
      .withMessage("Zły mail"),
    check("name").trim().escape(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ ok: false, errors: errors.array() });
    }

    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);

      await User.create({
        name: req.body.name,
        email: req.body.mail,
        password: newPassword,
      });

      res.json({ ok: true });
    } catch (err) {
      console.log(err);
      res.json({ ok: false, errors: [{ msg: "Posiadasz już konto!" }] });
    }
  }
);

// Handle login
app.post(
  "/api/login",
  [
    check("password").trim().escape(),
    check("mail").isEmail().trim().escape().normalizeEmail(),
  ],
  async (req: express.Request, res: express.Response) => {
    console.log(req.body);

    const user = await User.findOne({
      email: req.body.mail,
    });

    if (!user) {
      return res.json({ ok: false, error: "Taki użytkownik nie istnieje" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid && process.env.JWT_SECRET) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET
      );

      return res.json({
        ok: true,
        user: {
          id: user._id,
          token: token,
          name: user.name,
          mail: user.email,
          profileImage: user.profileImage,
          friendList: user.friendList,
        },
      });
    } else {
      return res.json({
        ok: false,
        user: false,
        error: "Mail lub hasło się nie zgadzają",
      });
    }
  }
);

app.post(
  "/api/getData",
  [check("mail").isEmail().trim().escape().normalizeEmail()],
  async (req: express.Request, res: express.Response) => {
    const user = await User.findOne({
      email: req.body.mail,
    });

    if (!user) {
      return res.json({ ok: false, error: "Taki użytkownik nie istnieje" });
    }

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    return res.json({
      ok: true,
      user: {
        id: user._id,
        token: token,
        name: user.name,
        mail: user.email,
        profileImage: user.profileImage,
        friendList: user.friendList,
      },
    });
  }
);

// Add to friends
app.post(
  "/api/findFriends",
  [
    check("id").trim().escape(),
    check("inviterMail").isEmail().trim().escape().normalizeEmail(),
    check("inviterName").trim().escape(),
  ],
  async (req: express.Request, res: express.Response) => {
    let id = req.body.id,
      inviterMail = req.body.inviterMail,
      inviterName = req.body.inviterName;

    console.log(id);
    console.log(inviterMail);
    console.log(inviterName);

    try {
      const user = await User.findById(id);
      const inviterUser = await User.findOne({ id: inviterMail });
      console.log(user);
      console.log(inviterUser);

      let friendList = user.friendList,
        newFriendA = {
          inviterID: inviterUser._id,
          inviterMail: inviterMail,
          inviterName: inviterName,
        },
        newFriendB = {
          inviterID: user._id,
          inviterMail: user.email,
          inviterName: user.name,
        };

      if (!friendList) {
        user.friendList = [];
        friendList = user.friendList;
      }

      friendList.forEach((el) => {
        console.log(el.inviterMail, newFriendA.inviterMail);
        if (el.inviterID.toString() == newFriendA.inviterID.toString()) {
          return res.json({
            ok: false,
            error: "Ta osoba jest juz twoim znajomym",
          });
        }
      });

      await User.updateOne(
        { _id: id },
        {
          friendList: [...friendList, newFriendA],
        }
      );

      await User.updateOne(
        { _id: inviterUser._id },
        {
          friendList: [...inviterUser.friendList, newFriendB],
        }
      );

      return res.json({ ok: true, msg: `Dodano ${user.name}` });
    } catch (err) {
      console.log("test");
      return res.json({ ok: false, error: "Wystąpił błąd" });
    }
  }
);
app.post(
  "/api/getUser",
  async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.findById(req.body.id);
      res.json({
        ok: true,
        userName: user.name,
        userAvatar: user.profileImage,
      });
    } catch (err) {
      res.json({ ok: false, error: "Bład" });
    }
  }
);
// app.post('/api/uploadFile', upload.single('file'), async (req: express.Request, res: express.Response) => {
//   try {
//     const title = req.body.filename;
//     const file = req.body.file;

//     console.log(title+"titlexd");
//     console.log(file+"filexd");
//     res.json({ok: true});
//   } catch(err) {
//     res.json({ok:false, error: err})
//   }
// });

// New conversation
// app.post('/api/conversation', async (req: express.Request, res: express.Response) => {
//   const newConversation = new Conversation({
//     members: [req.body.senderId, req.body.receiverId],
//   });

//   try {
//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// })

// app.get("/api/conversation/:userId", async (req: express.Request, res: express.Response) => {
//   try {
//     const conversation = await Conversation.find({
//       members: { $in: [req.params.userId] },
//     });
//     res.status(200).json(conversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// app.post("/api/message", async (req: express.Request, res: express.Response) => {
//   const newMessage = new Message(req.body);

//   try {
//     const savedMessage = await newMessage.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// })

// app.get("/api/message/:conversationId", async (req: express.Request, res: express.Response) => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

app.post(
  "/api/getMessages",
  async (req: express.Request, res: express.Response) => {
    let id = req.body.userId,
      chatId = req.body.chatId;

    console.log("get");
    try {
      const user = await User.findById(id);
      const user2 = await User.findById(chatId);

      const conv = user.friendList.filter((el) => {
        console.log(el.inviterID);
        console.log(user2._id);
        if (el.inviterID.toString() === user2._id.toString()) {
          console.log("found " + el.toString());
          return el;
        }
      });

      return res.json(conv[0]);
    } catch (err) {
      return res.json({ ok: false, error: "Błąd" });
    }
  }
);

app.post(
  "/api/sendMessage",
  async (req: express.Request, res: express.Response) => {
    let id = req.body.userId, // moje id
      chatId = req.body.chatId, // id rozmowcy
      obj = req.body.message; // obiekt wiadomosci

    try {
      const userA = await User.findById(id);
      const userB = await User.findById(chatId);
      let AIndex = -1,
        BIndex = -1;

      const conv = userA.friendList.filter((el, i) => {
        console.log("el.inviterID: " + el.inviterID);
        console.log("userB._id: " + userB._id);
        if (el.inviterID.toString() == userB._id.toString()) {
          console.log("found A: " + i);
          AIndex = i;
          return el;
        }
      });

      // console.log(userB);

      const convB = userB.friendList.filter((el, i) => {
        console.log("el.inviterID: " + el.inviterID);
        console.log("userA._id: " + userA._id);
        if (el.inviterID.toString() == userA._id.toString()) {
          console.log("found B: " + i);
          BIndex = i;
          return el;
        }
      });

      console.log(AIndex, BIndex);

      if (!userA.friendList[AIndex].messages)
        userA.friendList[AIndex].messages = [];
      userA.friendList[AIndex].messages = [
        ...userA.friendList[AIndex].messages,
        obj,
      ];
      await User.updateOne(
        { _id: userA._id },
        { friendList: userA.friendList }
      );

      if (!userB.friendList[BIndex].messages)
        userB.friendList[BIndex].messages = [];
      obj.author = false;
      userB.friendList[BIndex].messages = [
        ...userB.friendList[BIndex].messages,
        obj,
      ];
      await User.updateOne(
        { _id: userB._id },
        { friendList: userB.friendList }
      );

      return res.json({ ok: true });
    } catch (err) {
      return res.json({ ok: false, error: "Błąd" });
    }
  }
);

// app.get("/api/message/:conversationId", async (req: express.Request, res: express.Response) => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// app.use('/public', express.static('public'));

// app.get('/public/files/:filename',(req: express.Request,res: express.Response) => {
//   res.sendFile(__dirname + "/public/files/"+req.param('filename'));
//   });

app.listen(port, () => console.log(`Running on port http://localhost:${port}`));
