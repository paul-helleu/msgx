import User from "./User";
import Conversation from "./Conversation";
import Message from "./Message";
import UserConversation from "./UserConversation";

// Message
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
Message.belongsTo(UserConversation, { foreignKey: "conversation_id" });

// Conversation
Conversation.belongsTo(Message, { foreignKey: "conversation_id" });

// User
User.hasMany(Message, { foreignKey: "sender_id" });
User.hasMany(UserConversation, { foreignKey: "user_id" });

// UserConversation
UserConversation.belongsTo(User, { foreignKey: "user_id" });
UserConversation.hasMany(Conversation, { foreignKey: "conversation_id" });
UserConversation.hasMany(Message, { foreignKey: "conversation_id" });

export { User, Conversation, Message, UserConversation };
