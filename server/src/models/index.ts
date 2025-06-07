import User from './User.ts';
import Conversation from './Conversation.ts';
import Message from './Message.ts';
import UserConversation from './UserConversation.ts';

// Message
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

// Conversation
Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Conversation.belongsToMany(User, {
  through: UserConversation,
  foreignKey: 'conversation_id',
  otherKey: 'user_id',
});

// User
User.hasMany(Message, { foreignKey: 'sender_id' });
User.belongsToMany(Conversation, {
  through: UserConversation,
  foreignKey: 'user_id',
  otherKey: 'conversation_id',
});

// UserConversation
UserConversation.belongsTo(User, { foreignKey: 'user_id' });
UserConversation.belongsTo(Conversation, { foreignKey: 'conversation_id' });

export { User, Conversation, Message, UserConversation };
