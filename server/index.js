import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// --- In-memory data store ---
const contacts = [];
const chats = [
  {
    id: "chat1",
    users: ["Alice Johnson", "Bob Smith"],
    messages: [
      {
        id: uuid(),
        text: "Hey there!",
        sender: "Alice",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        seenBy: ["Alice Johnson"],
      },
    ],
  },
];

app.post("/contacts", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const exists = contacts.find((c) => c.name === name);
  if (exists) {
    return res.status(409).json({ error: "Contact already exists" });
  }

  contacts.push({ name });
  res.status(201).json({ name });
});

app.get("/contacts", (req, res) => {
  res.json(contacts);
});

app.get("/chats/:id", (req, res) => {
  const chat = chats.find((c) => c.id === req.params.id);
  if (!chat) return res.status(404).json({ error: "Chat not found" });
  res.json(chat);
});

app.post("/chats", (req, res) => {
  const { creator, contactName } = req.body;
  console.log("chat request: ", { creator, contactName });
  if (!creator || !contactName) {
    return res
      .status(400)
      .json({ error: "creator and contactName are required" });
  }

  // Check both users exist in contacts
  if (
    !contacts.find((c) => c.name === creator) ||
    !contacts.find((c) => c.name === contactName)
  ) {
    console.log("users not found");
    return res.status(404).json({ error: "One or both users not found" });
  }

  // Check if chat already exists between these two users (unordered)
  let existingChat = chats.find(
    (chat) =>
      chat.users.length === 2 &&
      chat.users.includes(creator) &&
      chat.users.includes(contactName)
  );

  if (existingChat) {
    console.log("chat already exists");
    return res.status(200).json(existingChat);
  }

  const newChat = {
    id: uuid(),
    users: [creator, contactName],
    messages: [],
  };

  chats.push(newChat);
  console.log("chat created: ", newChat);
  res.status(201).json(newChat);
});

app.get("/chats", (req, res) => {
  const user = req.query.user;
  console.log("user: ", user);
  const filteredChats = user
    ? chats.filter((chat) => chat.users.includes(user))
    : [];

  console.log("filteredChats: ", filteredChats);
  const minimalChats = filteredChats.map(({ id, users, messages }) => {
    const lastMessage = messages[messages.length - 1];
    const unreadCount = messages.filter((m) => !m.seenBy.includes(user)).length;

    return {
      id,
      users,
      lastMessage: lastMessage?.text || null,
      timestamp: lastMessage?.timestamp || null,
      unreadCount,
    };
  });

  res.json(minimalChats);
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected", socket.id);

  socket.on("join-chat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`👥 Joined chat room: ${chatId}`);
  });

  socket.on("join-user", ({ user }) => {
    socket.join(user);
    console.log(`👤 Joined user room: ${user}`);
  });

  socket.on("send-message", ({ chatId, text, sender }) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    const newMessage = {
      id: uuid(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seenBy: [sender],
    };
    io.to(chatId).emit("message", newMessage);

    chat.messages.push(newMessage);
    console.log(`📤 Broadcasting to room ${chatId}:`, newMessage);

    chat.users.forEach((user) => {
      const unreadCount = chat.messages.filter(
        (m) => !m.seenBy.includes(user)
      ).length;
      io.to(user).emit("chat-updated", {
        id: chat.id,
        users: chat.users,
        lastMessage: newMessage.text,
        timestamp: newMessage.timestamp,
        unreadCount,
      });
    });
  });

  socket.on("mark-seen", ({ chatId, user, messageId }) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    console.log("mark seen: ", { chatId, user, messageId });
    let updated = false;

    if (messageId) {
      const msg = chat.messages.find((m) => m.id === messageId);
      if (msg && !msg.seenBy.includes(user)) {
        msg.seenBy.push(user);
        updated = true;

        io.to(chatId).emit("message-seen", {
          messageId: msg.id,
          seenBy: msg.seenBy,
        });
      }
    } else {
      chat.messages.forEach((m) => {
        if (!m.seenBy.includes(user)) {
          m.seenBy.push(user);
          updated = true;
          io.to(chatId).emit("message-seen", {
            messageId: m.id,
            seenBy: m.seenBy,
          });
        }
      });
    }

    if (updated) {
      chat.users.forEach((chatUser) => {
        const unreadCount = chat.messages.filter(
          (m) => !m.seenBy.includes(chatUser)
        ).length;

        io.to(chatUser).emit("chat-updated", {
          id: chat.id,
          users: chat.users,
          lastMessage: chat.messages.at(-1)?.text || "",
          timestamp: chat.messages.at(-1)?.timestamp || "",
          unreadCount,
        });
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
