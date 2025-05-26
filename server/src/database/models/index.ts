import User from "./User";
import Conversation from "./Conversation";
import Message from "./Message";
import UserConversation from "./UserConversation";

// Message
Message.belongsTo(User, { foreignKey: "sender_id", as: "Sender" });
Message.belongsTo(Conversation, { foreignKey: "conversation_id" });

// Conversation
Conversation.hasMany(Message, { foreignKey: "conversation_id" });
Conversation.belongsToMany(User, {
  through: UserConversation,
  foreignKey: "conversation_id",
  otherKey: "user_id",
});

// User
User.hasMany(Message, { foreignKey: "sender_id" });
User.belongsToMany(Conversation, {
  through: UserConversation,
  foreignKey: "user_id",
  otherKey: "conversation_id",
});

// UserConversation
UserConversation.belongsTo(User, { foreignKey: "user_id" });
UserConversation.belongsTo(Conversation, { foreignKey: "conversation_id" });

export { User, Conversation, Message, UserConversation };
