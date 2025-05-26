import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // 1. Insert users
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'Alice',
        password: '$2b$10$VbcsmzDCZF4DMbHx705BIOyafO38irp94OLUwDu7b8HiDEccSdfEe', // hash of 1234
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: 'Bob',
        password: 'bob123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 2. Insert conversation
    await queryInterface.bulkInsert('conversations', [
      {
        id: 1,
        channel_id: 'alice_bob_channel',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 3. Link users to the conversation (via user_conversations)
    await queryInterface.bulkInsert('user_conversations', [
      {
        id: 1,
        user_id: 1, // Alice
        conversation_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        user_id: 2, // Bob
        conversation_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 4. Insert messages
    await queryInterface.bulkInsert('messages', [
      {
        id: 1,
        conversation_id: 1,
        sender_id: 1, // Alice
        content: 'Salut Bob !',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        conversation_id: 1,
        sender_id: 2, // Bob
        content: 'Salut Alice, ça va ?',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        conversation_id: 1,
        sender_id: 1, // Alice
        content: 'Oui nickel, merci !',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('messages', {}, {});
    await queryInterface.bulkDelete('user_conversations', {}, {});
    await queryInterface.bulkDelete('conversations', {}, {});
    await queryInterface.bulkDelete('users', { id: [1, 2] });
  },
};
