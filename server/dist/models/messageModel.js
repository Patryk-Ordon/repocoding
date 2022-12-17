"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel = new mongoose_1.default.Schema({
    conversationId: {
        type: String,
    },
    sender: {
        type: String,
    },
    text: {
        type: String,
    },
}, { timestamps: true });
const Message = mongoose_1.default.model('Message', messageModel, 'message');
exports.default = Message;
//# sourceMappingURL=messageModel.js.map