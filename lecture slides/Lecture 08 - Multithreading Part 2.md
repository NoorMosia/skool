# Lecture 08: Multithreading Part 2

## Issues with threads

1. No guarantee when a thread will be suspended, i.e.:
   - Cannot be sure if a statement is completed
   - Cannot be sure if a field is read after an assignment is complete
2. Multiple threads accessing the same object/field may conflict, causing data inconsistency
   - This is called a **race condition**

### Example race condition

```java
public class SingleLinkedList {
    public ListNode head;

    public class ListNode {
        ListNode next;
        Object value;
    }

    public SingleLinkedList() {
        head = null;
    }

    public void addHead(Object value) {
        ListNode node = new ListNode(); // (1)
        node.next = head;               // (2)
        node.value = value;             // (3)
        head = node;                    // (4)
    }
}
```

If Thread 1 calls `L.addHead("C")` and Thread 2 calls `L.addHead("D")`, and the threads are suspended partway through steps (1)–(4), the interleaving can corrupt the list (e.g., one of the added nodes is lost because `head` is overwritten).

## Synchronising object access

- Objects/fields need to be locked
- A thread may only proceed with code if it obtained a lock (for the code)
- Once a thread is finished with a lock, it needs to release it
- Java provides a `Lock` object
  - Since Java 5.0; before that you needed to use `synchronized`

### How are locks used?

- Objects to be accessed need to:
  - Create 1 or more `Lock` objects to restrict concurrent access to fields
  - Before using a field, lock a specific lock
  - When finished using the field, unlock the same lock
- A thread must own a lock before it will be allowed to continue processing a method
- If another thread owns the required lock, then the thread blocks & waits for the lock to become available, then tries to obtain it again

```java
public class SingleLinkedList {
    private Lock headLock;   // Declare Lock
    public ListNode head;

    public class ListNode {
        ListNode next;
        Object value;
    }

    public SingleLinkedList() {
        head = null;
        headLock = new ReentrantLock(); // Create Lock
    }

    public void addHead(Object value) {
        ListNode node = new ListNode();
        node.value = value;

        headLock.lock();      // Any other thread cannot go past this
        node.next = head;     // point until this lock is released
        head = node;
        headLock.unlock();    // Release Lock when done
    }
}
```

## Be careful with exceptions

- If locking inside a `try...catch` block, always release the lock in the `finally` block
- Otherwise, the lock might never be unlocked

```java
try {
    // Obtain lock.
    lock.lock();

    // Do "code" that could throw an exception.
    // ...

    // Do NOT put unlock inside try... it could never be called.
    // lock.unlock(); - i.e. NOT here
} catch (Exception e) {
    // Handle exception
} finally {
    // Release lock in finally block.
    lock.unlock();
}
```

## Deadlock

- Two or more threads are waiting to obtain a lock that the other thread already has
- E.g., Thread 1 has Lock A & wants Lock B; Thread 2 has Lock B & wants Lock A
- This is called **Deadlock** (or Deadly Embrace)

### How can deadlock be avoided?

- If a thread has multiple locks (e.g., A, B & C):
  - Always obtain them in the same order & release in reverse order
  - E.g.:
    - If you need A, B, C: lock A, B, C; unlock C, B, A
    - If you need A, C: lock A, C; unlock C, A
- If you have producer/consumer threads (e.g., for memory management), then you can use condition objects

## Condition objects

- Can temporarily release a lock using a condition object, so another thread can proceed
  - The lock is regained later
  - The `await` method (of the condition) is called to release the lock
    - Blocks the thread, i.e., it cannot proceed
- If another method changes the condition that is being awaited, then the `signalAll` method on the same condition object is called
  - All threads awaiting the condition re-evaluate whether they should continue or not
  - Of those deciding to proceed, a random thread is selected to obtain the lock

```java
public class BankAccount {
    private Lock balanceChangeLock;
    private Condition sufficientFundsCondition;
    // ...

    public BankAccount() {
        balanceChangeLock = new ReentrantLock();
        // Create a condition attached to a specific lock
        sufficientFundsCondition = balanceChangeLock.newCondition();
        // ...
    }

    public void withdraw(double amount) {
        balanceChangeLock.lock();
        try {
            // Logical condition being awaited to be true.
            // await() blocks until the condition "changes", i.e. is
            // signalled, and temporarily releases the lock for another
            // thread to use.
            while (balance < amount)
                sufficientFundsCondition.await();
            // ...
        }
        finally {
            balanceChangeLock.unlock();
        }
    }

    public void deposit(double amount) {
        balanceChangeLock.lock();
        try {
            // ...
            // Funds have changed, so let all those awaiting the
            // condition know about it.
            sufficientFundsCondition.signalAll();
        }
        finally {
            balanceChangeLock.unlock();
        }
    }
}
```
