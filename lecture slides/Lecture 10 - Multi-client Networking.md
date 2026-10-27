# Lecture 10: Multi-client Networking

## Limitations of basic networking

1. Server can communicate with multiple clients, BUT only one at a time
2. Communication is VERY ordered:
   - Half-duplex communication, i.e., 1st send, then receive, etc.
   - Cannot send & receive at the same time, in any order, i.e., not full-duplex
3. Homogeneous (simple, same type) messages

The underlying reason for all three: a single thread for everything.

### Single client at a time

- Reason: a single thread handles everything
- Solution:
  - Connection Request Handling thread
  - Thread per connection

### Half-duplex communication

- Reason: reading from an input stream is a blocking operation
- Solution:
  - Reading thread
  - Writing thread
  - i.e., full duplex

### Homogeneous messages

- Reason: simple user-defined encoding was used
  - Need a way to distinguish the type of messages
  - Need a way to have parameters
- Solution: use data formats to serialise more complex data
  - Existing formats, e.g., XML, JSON
  - Object streams
  - Own, custom format

## Communication Protocol

Need rules for:

- How data is encoded
- How messages will be exchanged & what the responses will be
- If any server/client obeys all rules, then they are interchangeable

Example rules:

- When a client connects to the server, then the server does X
- When the client sends message X, then the server does Y [& potentially returns Z (to 1+ clients)]
- When the client sends X, then the server returns A; client sends Y, server returns B…

## Some considerations

- Many UI SDKs do not allow I/O operations
- Centralised data structure(s) needed on the Server
- Many threads → potential race conditions
  - Clients reading/writing the data structure
- Writing to clients

One solution's thread layout:

- **Server**
  - UI Thread
  - Connection Accepting Thread
  - Thread-safe Data Structure(s)
  - Per connection: Read Thread (thread-safe), Write Thread (thread-safe)
- **Client**
  - UI Thread
  - Read Thread (thread-safe)
  - Write Thread (thread-safe)

## Example: Chat server & Android client

### Components

**Server**

- Console app
- Groups Data Structure
- Connection Thread
- Object streams
- Read Thread
- Write Thread + message Queue
- Client message + apply
- Server message (data only)

**Client**

- UI + Thread
- Adapters
- Object streams
- Read Thread
- Write Thread + message Queue
- Notification system
- Client message (data only)
- Server message (data only)

### Communication protocol (example)

When connected:

- Client sends `SetHandle(handle)`
  - Server sets & sends `HandleSet(newHandle)`
- Server lets the client join "lobby" & sends the list of groups to the client

When the client wants a list of groups:

- Client sends `ListGroups()`
  - Server returns `GroupsListed(list of group names)`

When the client wants to create a new chat group:

- Client sends `AddGroup(group name)`
  - Server sends all clients `GroupsListed(list of group names)`

When the client wants to send a message on a chat group:

- Client sends `SendChatMessage(message)`
  - Server sends all clients in the group `ChatMessageReceived(group, handle, msg, timestamp)`
