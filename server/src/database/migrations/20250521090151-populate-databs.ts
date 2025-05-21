import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert('users', [
      {id:1, username: 'Alice', password: 'alice123' },
      {id:2, username: 'Bob', password: 'bob123' },
    ]);

    await queryInterface.bulkInsert('conversations', [
      {id:1, user_a: 1, user_b: 2 },
    ]);

    await queryInterface.bulkInsert('messages', [
      {
        conv_id: 1,
        date: new Date(),
        sender_id:1,
        content: 'Salut Bob !',
      },
      {
        conv_id: 1,
        date: new Date(),
        sender_id:2,
        content: 'Salut Alice, ça va ?',
      },
      {
        conv_id: 1,
        date: new Date(),
        sender_id:1,
        content: 'Oui nickel, merci !',
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('messages', {}, {});
    await queryInterface.bulkDelete('conversations', {}, {});
    await queryInterface.bulkDelete('users', {
       id: [1, 2],
    });
  },
};
