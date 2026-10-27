registerLecture({
  id: "10",
  title: "L10: Multi-client Networking",
  blurb: "Limitations of basic networking, threading solutions, communication protocols, chat example.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "What is the underlying reason basic networking handles only one client at a time, half-duplex, with simple messages?",
      options: [
        "A single thread for everything",
        "Insufficient bandwidth",
        "UDP being used",
        "Missing internet permission"
      ],
      answer: 0,
      explanation: "All three limitations trace back to using a single thread for everything."
    },
    {
      type: "mcq",
      prompt: "'Half-duplex' communication means:",
      options: [
        "Send and receive at the same time in any order",
        "First send, then receive, etc. — not at the same time",
        "Only the server can send",
        "Only the client can send"
      ],
      answer: 1,
      explanation: "Half-duplex: first send, then receive, etc. — you cannot send and receive at the same time (that would be full-duplex)."
    },
    {
      type: "mcq",
      prompt: "What is the solution to the 'single client at a time' limitation?",
      options: [
        "A connection request handling thread plus a thread per connection",
        "Switching from TCP to UDP",
        "Removing the UI thread",
        "Using a single shared socket"
      ],
      answer: 0,
      explanation: "Solution: a connection-request handling thread and a thread per connection."
    },
    {
      type: "mcq",
      prompt: "What makes full-duplex communication possible?",
      options: [
        "A single read/write thread",
        "Separate reading and writing threads",
        "Blocking the UI thread",
        "Disabling object streams"
      ],
      answer: 1,
      explanation: "A separate reading thread and writing thread give full-duplex communication."
    },
    {
      type: "mcq",
      prompt: "A communication protocol defines rules for:",
      options: [
        "How data is encoded and how messages are exchanged",
        "The screen layout of the client",
        "The device's CPU scheduling",
        "The app's install permissions"
      ],
      answer: 0,
      explanation: "A protocol defines how data is encoded and how messages are exchanged (and the responses)."
    },
    {
      type: "mcq",
      prompt: "In the chat example, when a client wants a list of groups it sends ListGroups(); what does the server return?",
      options: [
        "`HandleSet(newHandle)`",
        "`GroupsListed(list of group names)`",
        "`ChatMessageReceived(...)`",
        "`AddGroup(group name)`"
      ],
      answer: 1,
      explanation: "The server returns GroupsListed(list of group names)."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "What are the three stated limitations of the basic networking covered earlier?",
      options: [
        "Server can communicate with multiple clients, but only one at a time",
        "Communication is half-duplex (ordered send then receive)",
        "Homogeneous (simple, same-type) messages",
        "No internet permission is possible"
      ],
      answers: [0, 1, 2],
      explanation: "One-at-a-time, half-duplex, and homogeneous messages are the three limitations."
    },
    {
      type: "multi",
      prompt: "To support more complex (heterogeneous) messages, which solutions are suggested?",
      options: [
        "Existing data formats, e.g. XML, JSON",
        "Object streams",
        "Your own custom format",
        "Sending only raw single bytes"
      ],
      answers: [0, 1, 2],
      explanation: "Use XML/JSON, object streams, or a custom format to serialise more complex data."
    },
    {
      type: "multi",
      prompt: "Which are stated considerations for a multi-client server?",
      options: [
        "Many UI SDKs do not allow I/O operations",
        "Centralised data structure(s) are needed on the server",
        "Many threads mean potential race conditions",
        "The server must use UDP"
      ],
      answers: [0, 1, 2],
      explanation: "UI SDKs often forbid I/O, centralised data is needed, and many threads risk race conditions. UDP is not required."
    },
    {
      type: "multi",
      prompt: "In the one-solution thread layout, which threads/structures are marked thread-safe?",
      options: [
        "The server's shared Data Structure(s)",
        "The per-connection Read Thread",
        "The per-connection Write Thread",
        "The client's UI Thread"
      ],
      answers: [0, 1, 2],
      explanation: "The data structure(s), read threads and write threads are marked thread-safe. The UI thread is not in that list."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "Reading from an input stream being a blocking operation is the reason half-duplex communication occurs with a single thread.",
      answer: true,
      explanation: "Correct. Because reads block, a single thread can't read and write at once — hence separate read/write threads for full duplex."
    },
    {
      type: "tf",
      prompt: "If any server/client obeys all the rules of a communication protocol, they are interchangeable.",
      answer: true,
      explanation: "Correct. A shared protocol makes compliant servers/clients interchangeable."
    },
    {
      type: "tf",
      prompt: "In the chat example, when a client sends SendChatMessage, only the sender is updated.",
      answer: false,
      explanation: "The server sends ChatMessageReceived(group, handle, msg, timestamp) to ALL clients in the group."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "When the client first connects, it sends `SetHandle(handle)` and the server responds with `{{blank}}(newHandle)`.",
      blanks: [["HandleSet", "HandleSet(newHandle)"]],
      explanation: "The server sets and sends HandleSet(newHandle), then lets the client join the lobby."
    }
  ]
});
