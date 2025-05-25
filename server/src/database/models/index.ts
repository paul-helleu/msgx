import User from './User';
import Conversation from './Conversation';
import Message from './Message';

// Message
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(Conversation, { foreignKey: 'conv_id' });

// Conversation
Conversation.belongsTo(User, { as: 'UserA', foreignKey: 'user_a' });
Conversation.belongsTo(User, { as: 'UserB', foreignKey: 'user_b' });
Conversation.hasMany(Message, { foreignKey: 'conv_id' });

// User
User.hasMany(Conversation, { foreignKey: 'user_a', as: 'conversationsA' });
User.hasMany(Conversation, { foreignKey: 'user_b', as: 'conversationsB' });
User.hasMany(Message, { foreignKey: 'sender_id' });

export { User, Conversation, Message };