"use strict";

export default {
  async up(queryInterface: { createTable: (arg0: string, arg1: { id: { type: any; primaryKey: boolean; autoIncrement: boolean; } | { type: any; primaryKey: boolean; autoIncrement: boolean; } | { type: any; primaryKey: boolean; autoIncrement: boolean; } | { type: any; primaryKey: boolean; autoIncrement: boolean; }; username?: { type: any; allowNull: boolean; unique: boolean; }; password?: { type: any; allowNull: boolean; }; createdAt: { allowNull: boolean; type: any; defaultValue: any; } | { allowNull: boolean; type: any; defaultValue: any; } | { allowNull: boolean; type: any; defaultValue: any; } | { allowNull: boolean; type: any; defaultValue: any; }; updatedAt: { allowNull: boolean; type: any; defaultValue: any; } | { allowNull: boolean; type: any; defaultValue: any; } | { allowNull: boolean; type: any; defaultValue: any; } | { allowNull: boolean; type: any; defaultValue: any; }; channel_id?: { type: any; allowNull: boolean; }; conversation_id?: { type: any; allowNull: boolean; references: { model: string; key: string; }; onUpdate: string; onDelete: string; } | { type: any; allowNull: boolean; references: { model: string; key: string; }; onUpdate: string; onDelete: string; }; sender_id?: { type: any; allowNull: boolean; references: { model: string; key: string; }; onUpdate: string; onDelete: string; }; content?: { type: any; allowNull: boolean; }; user_id?: { type: any; allowNull: boolean; references: { model: string; key: string; }; onUpdate: string; onDelete: string; }; }) => any; }, Sequelize: { INTEGER: any; STRING: any; DATE: any; literal: (arg0: string) => any; TEXT: any; }) {
    // Users
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Conversations
    await queryInterface.createTable("conversations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      channel_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Messages
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "conversations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // UserConversations
    await queryInterface.createTable("user_conversations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "conversations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface: { dropTable: (arg0: string) => any; }, Sequelize: any) {
    await queryInterface.dropTable("user_conversations");
    await queryInterface.dropTable("messages");
    await queryInterface.dropTable("conversations");
    await queryInterface.dropTable("users");
  },
};