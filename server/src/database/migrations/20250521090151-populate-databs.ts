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
        password: '$2b$10$VbcsmzDCZF4DMbHx705BIOyafO38irp94OLUwDu7b8HiDEccSdfEe', // same as Alice
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        username: 'Eve',
        password: '$2b$10$VbcsmzDCZF4DMbHx705BIOyafO38irp94OLUwDu7b8HiDEccSdfEe', // same as Alice
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 2. Insert conversations
    await queryInterface.bulkInsert('conversations', [
      {
        id: 1,
        channel_id: 'alice_bob_channel',
        name: 'Alice,Bob',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        channel_id: 'bob_eve_channel',
        name: 'Bob,Eve',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        channel_id: 'alice_eve_channel',
        name: 'Alice,Eve',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        channel_id: 'groupe_avec_tout_le_monde',
        name: 'Groupe',
        is_group: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 3. Link users to conversations
    await queryInterface.bulkInsert('user_conversations', [
      // Alice ↔ Bob
      {
        id: 1,
        user_id: 1,
        conversation_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        user_id: 2,
        conversation_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Bob ↔ Eve
      {
        id: 3,
        user_id: 2,
        conversation_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        user_id: 3,
        conversation_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Alice ↔ Eve
      {
        id: 5,
        user_id: 1,
        conversation_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        user_id: 3,
        conversation_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Groupe Creation
      {
        id: 7,
        user_id: 1,
        conversation_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        user_id: 2,
        conversation_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        user_id: 3,
        conversation_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 4. Insert messages
    await queryInterface.bulkInsert('messages', [
      // Alice ↔ Bob
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
      // Bob ↔ Eve
      {
        id: 4,
        conversation_id: 2,
        sender_id: 2, // Bob
        content: 'Salut Eve !',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        conversation_id: 2,
        sender_id: 3, // Eve
        content: 'Coucou Bob, quoi de neuf ?',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Alice ↔ Eve
      {
        id: 6,
        conversation_id: 3,
        sender_id: 1, // Alice
        content: 'Hey Eve !',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        conversation_id: 3,
        sender_id: 3, // Eve
        content: 'Salut Alice !',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('messages', {}, {});
    await queryInterface.bulkDelete('user_conversations', {}, {});
    await queryInterface.bulkDelete('conversations', {}, {});
    await queryInterface.bulkDelete('users', { id: [1, 2, 3] });
  },
};
