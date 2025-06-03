import { Router } from 'express';
import Message from '../models/Message.ts';
import Conversation from '../models/Conversation.ts';
import { isValidToken, type AuthenticatedRequest } from '../../api/auth.ts';

const MAX_USER_PER_CONVERSATION =
  Number(process.env.MAX_USER_PER_CONVERSATION) || 10;

const router = Router();

router.post(
  '/messages/:channelId',
  isValidToken,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { channelId } = req.params;
      const { content } = req.body;
      const senderId = req.user.id;

      if (!channelId || channelId.trim().length === 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: {
            channel_id: {
              code: 'REQUIRED_FIELD',
              message: 'Channel ID is required',
            },
          },
        });
        return;
      }

      if (!content || content.trim().length === 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: {
            content: {
              code: 'REQUIRED_FIELD',
              message: 'Message content is required and cannot be empty',
            },
          },
        });
        return;
      }

      const conversation = await Conversation.findOne({
        where: {
          channel_id: channelId.trim(),
        },
      });

      if (!conversation) {
        res.status(404).json({
          message: 'Channel not found',
          errors: {
            channelId: {
              code: 'NOT_FOUND',
              message: 'No conversation found for this channel ID',
            },
          },
        });
        return;
      }

      const message = await Message.create({
        conversation_id: conversation.id,
        sender_id: parseInt(senderId, 10),
        content: content.trim(),
      });

      res.status(201).json({
        message: 'Message sent successfully',
        data: {
          id: message.id,
          conversationId: message.conversation_id,
          channelId: conversation.channel_id,
          senderId: message.sender_id,
          content: message.content,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        },
      });
    } catch (err) {
      res.status(500).json({ status: 'Internal server error' });
    }
  }
);

// router.get('/users', UserController.getAll);
// router.get('/conversations', ConversationController.getAll);
// router.get("/messages", MessageController.getAll);

// router.get('/messages', (req, res, next) => {
//   const limit = req.query?.limit;
//   if (limit === null) {
//     res.status(200).json();
//   }
// });

// router.post('/conversations/create', async (req, res, next) => {
//   // check authentification
//   const senderId = 1;

//   const recipients: [] | null = req.body?.recipients;
//   if (
//     recipients === null ||
//     !Array.isArray(recipients) ||
//     recipients.length > MAX_USER_PER_CONVERSATION
//   ) {
//     res.status(400).json({
//       message: 'No recipients found',
//       errors: {
//         sender: {
//           code: '',
//           message: '',
//         },
//       },
//     });
//     return;
//   }

//   recipients.forEach(async (recipientId: string) => {
//     const recipientIdNumber = parseInt(recipientId, 10);
//     if (!Number.isNaN(recipientIdNumber)) {
//       res.status(400).json({
//         message: 'Recipients must contains recipientIds',
//         errors: {
//           sender: {
//             code: '',
//             message: '',
//           },
//         },
//       });
//       return;
//     }

//     const recipient = await userRepository.findById(recipientIdNumber);
//     if (recipient === null) {
//       res.json({
//         message: `${recipientIdNumber} is not a valid recipientId`,
//         errors: {
//           sender: {
//             code: '',
//             message: '',
//           },
//         },
//       });
//       return;
//     }
//   });

//   const newConversation = await Conversation.create({
//     channel_id: crypto.randomUUID(),
//     name: '',
//     is_group: false,
//   });
//   await UserConversation.create({
//     conversation_id: newConversation.id,
//     user_id: senderId,
//   });

//   recipients.forEach(async (recipientId) => {
//     await UserConversation.create({
//       conversation_id: newConversation.id,
//       user_id: recipientId,
//     });
//   });
// });

// router.post('/conversations/:channelId/messages', async (req, res, next) => {
//   // check authentification
//   const senderId = 1;

//   const channelId = parseInt(req.params.channelId, 10);
//   if (Number.isNaN(channelId)) {
//     res.status(400).json({
//       message: 'Invalid Id must be an integer',
//       errors: {
//         sender: {
//           code: '',
//           message: '',
//         },
//       },
//     });
//     return;
//   }

//   const content: string | null = req.body?.content;
//   if (content === null || content.length === 0) {
//     res.status(400).json({
//       message: 'Message must contains content',
//       errors: {
//         sender: {
//           code: '',
//           message: '',
//         },
//       },
//     });
//     return;
//   }

//   const conversation = await conversationRepository.findByChannelId(channelId);
//   if (conversation === null) {
//     res.status(400).json({
//       message: 'No conversation found, need to create the conversation',
//       errors: {
//         sender: {
//           code: '',
//           message: '',
//         },
//       },
//     });
//     return;
//   }

//   const message = await Message.create({
//     content,
//     conversation_id: conversation.id,
//     sender_id: senderId,
//   });
// });

export default router;
