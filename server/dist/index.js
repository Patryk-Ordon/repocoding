"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("./models/userModel"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const app = (0, express_1.default)();
const port = 5000;
(0, db_1.default)();
app.use((0, cors_1.default)());
app.get("/", (_, res) => {
    res.status(200).send();
});
app.use(body_parser_1.default.json()).use(body_parser_1.default.urlencoded({ extended: true }));
// Handle register
app.post("/api/register", [
    (0, express_validator_1.check)("password")
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
    (0, express_validator_1.check)("mail")
        .isEmail()
        .escape()
        .trim()
        .normalizeEmail()
        .withMessage("Zły mail"),
    (0, express_validator_1.check)("name").trim().escape(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.json({ ok: false, errors: errors.array() });
    }
    try {
        const newPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        yield userModel_1.default.create({
            name: req.body.name,
            email: req.body.mail,
            password: newPassword,
        });
        res.json({ ok: true });
    }
    catch (err) {
        console.log(err);
        res.json({ ok: false, errors: [{ msg: "Posiadasz już konto!" }] });
    }
}));
// Handle login
app.post("/api/login", [
    (0, express_validator_1.check)("password").trim().escape(),
    (0, express_validator_1.check)("mail").isEmail().trim().escape().normalizeEmail(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const user = yield userModel_1.default.findOne({
        email: req.body.mail,
    });
    if (!user) {
        return res.json({ ok: false, error: "Taki użytkownik nie istnieje" });
    }
    const isPasswordValid = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (isPasswordValid && process.env.JWT_SECRET) {
        const token = jsonwebtoken_1.default.sign({
            name: user.name,
            email: user.email,
        }, process.env.JWT_SECRET);
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
    else {
        return res.json({
            ok: false,
            user: false,
            error: "Mail lub hasło się nie zgadzają",
        });
    }
}));
app.post("/api/getData", [(0, express_validator_1.check)("mail").isEmail().trim().escape().normalizeEmail()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({
        email: req.body.mail,
    });
    if (!user) {
        return res.json({ ok: false, error: "Taki użytkownik nie istnieje" });
    }
    const token = jsonwebtoken_1.default.sign({
        name: user.name,
        email: user.email,
    }, process.env.JWT_SECRET);
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
}));
// Add to friends
app.post("/api/findFriends", [
    (0, express_validator_1.check)("id").trim().escape(),
    (0, express_validator_1.check)("inviterMail").isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)("inviterName").trim().escape(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.body.id, inviterMail = req.body.inviterMail, inviterName = req.body.inviterName;
    console.log(id);
    console.log(inviterMail);
    console.log(inviterName);
    try {
        const user = yield userModel_1.default.findById(id);
        const inviterUser = yield userModel_1.default.findOne({ id: inviterMail });
        console.log(user);
        console.log(inviterUser);
        let friendList = user.friendList, newFriendA = {
            inviterID: inviterUser._id,
            inviterMail: inviterMail,
            inviterName: inviterName,
        }, newFriendB = {
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
        yield userModel_1.default.updateOne({ _id: id }, {
            friendList: [...friendList, newFriendA],
        });
        yield userModel_1.default.updateOne({ _id: inviterUser._id }, {
            friendList: [...inviterUser.friendList, newFriendB],
        });
        return res.json({ ok: true, msg: `Dodano ${user.name}` });
    }
    catch (err) {
        console.log("test");
        return res.json({ ok: false, error: "Wystąpił błąd" });
    }
}));
app.post("/api/getUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.body.id);
        res.json({
            ok: true,
            userName: user.name,
            userAvatar: user.profileImage,
        });
    }
    catch (err) {
        res.json({ ok: false, error: "Bład" });
    }
}));
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
app.post("/api/getMessages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.body.userId, chatId = req.body.chatId;
    console.log("get");
    try {
        const user = yield userModel_1.default.findById(id);
        const user2 = yield userModel_1.default.findById(chatId);
        const conv = user.friendList.filter((el) => {
            console.log(el.inviterID);
            console.log(user2._id);
            if (el.inviterID.toString() === user2._id.toString()) {
                console.log("found " + el.toString());
                return el;
            }
        });
        return res.json(conv[0]);
    }
    catch (err) {
        return res.json({ ok: false, error: "Błąd" });
    }
}));
app.post("/api/sendMessage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.body.userId, // moje id
    chatId = req.body.chatId, // id rozmowcy
    obj = req.body.message; // obiekt wiadomosci
    try {
        const userA = yield userModel_1.default.findById(id);
        const userB = yield userModel_1.default.findById(chatId);
        let AIndex = -1, BIndex = -1;
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
        yield userModel_1.default.updateOne({ _id: userA._id }, { friendList: userA.friendList });
        if (!userB.friendList[BIndex].messages)
            userB.friendList[BIndex].messages = [];
        obj.author = false;
        userB.friendList[BIndex].messages = [
            ...userB.friendList[BIndex].messages,
            obj,
        ];
        yield userModel_1.default.updateOne({ _id: userB._id }, { friendList: userB.friendList });
        return res.json({ ok: true });
    }
    catch (err) {
        return res.json({ ok: false, error: "Błąd" });
    }
}));
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
//# sourceMappingURL=index.js.map