# Lecture 06: Collections & Regular Expressions

## Collections

### Java Collection Framework

- Collection: an object (data structure) that groups multiple elements together, e.g., a Linked List
- The Collection Framework has 3 main parts: Interfaces, Implementations, Algorithms
- Aims:
  - Reusable data structures
  - Reusable algorithms
  - Leverage multiple CPUs for parallel computation (Java 8+)
- Streaming API: provided to allow a more consistent, fluent API for querying collections

### Main Interfaces

- `Iterable` → `Collection` → `Set` → `SortedSet` → `NavigableSet`
- `Collection` → `List`
- `Collection` → `Queue` → `Deque`
- `Map` → `SortedMap` → `NavigableMap`

### Iterable

- Allows a collection to be iterated through (traversed)
- Iterable has a method that returns an iterator
  - An iterator object controls the navigation process
  - An iterator stores the state of a traversal through the iterable
- Iterator provides methods `hasNext`, `next`, `remove`, …
- Three ways to traverse a collection using an iterator:
  - Using the iterator object
  - Using the foreach notation
  - Using the indices (if the specific collection allows)

### Collection Interface

- Defines a group of elements
  - Unordered
  - No specification of uniqueness
  - Basic behaviour: add/remove, query number of elements, query containment
- Sub-interfaces add additional properties
  - E.g., list adds the notion of position (& order), sets add the notion of uniqueness
- When writing code, use interfaces in preference to implementations (more scalable)

```java
public interface Collection<T>
{
    // Basic Operations
    int size();
    boolean isEmpty();
    boolean contains(T element);
    boolean add(T element);    // Optional
    boolean remove(T element); // Optional
    Iterator<T> iterator();

    // Bulk Operations
    boolean containsAll(Collection<T> c);
    boolean addAll(Collection<T> c);    // Optional
    boolean removeAll(Collection<T> c); // Optional
    boolean retainAll(Collection<T> c); // Optional
    void clear();                       // Optional

    // Array Operations
    T[] toArray();
    T[] toArray(T a[]);
}
```

### List Interface

- Extends the Collection interface
- Adds the concept of position & order
  - get/set elements by position
  - Introduces a new `ListIterator` as well if you need to know the position of the current element
- Implementations: ArrayList, LinkedList, Stack, …

```java
public interface List<T> extends Collection<T>
{
    // Positional Access
    T get(int index);
    T set(int index, T element);                // Optional
    void add(int index, T element);             // Optional
    T remove(int index);                        // Optional
    boolean addAll(int index, Collection<T> c); // Optional

    // Search
    int indexOf(T o);
    int lastIndexOf(T o);

    // Iteration
    ListIterator<T> listIterator();
    ListIterator<T> listIterator(int index);

    // Range-view
    List<T> subList(int from, int to);
}
```

### Set Interface

- Extends the Collection interface
- Introduces the concept of no duplicates to the Collection
- Still does not know about the concept of order
- Implementations: HashSet, LinkedHashSet, TreeSet

### SortedSet Interface

- Adds the concept of ordering to a Set
  - Ordering implies being able to compare two elements
    - done using a Comparator
    - OR the Element implementing the Comparable interface

```java
public interface SortedSet<T> extends Set<T>
{
    // Range-view
    SortedSet<T> subSet(T fromElement, T toElement);
    SortedSet<T> headSet(T toElement);
    SortedSet<T> tailSet(T fromElement);

    // Endpoints
    T first();
    T last();

    // Comparator access
    Comparator<T> comparator();
}
```

### Queue Interface

- Extends the Collection interface
- Adds the concepts of order, adding to the back of the queue, removing from the front
- Implementations:
  - LinkedList, PriorityQueue
  - If you use a PriorityQueue, then you need to provide a comparator/comparable implementation as well

### Map Interface

- Separate hierarchy from a Collection
- Specifies a dictionary
  - <key, value> pairs
  - Unique keys (must be objects)
- Keys are not ordered
- Implementations: HashMap, TreeMap, HashTable, …

```java
public interface Map<K,V>
{
    // Basic Operations
    V put(K key, V value);
    V get(K key);
    V remove(K key);
    boolean containsKey(K key);
    boolean containsValue(K value);
    int size();
    boolean isEmpty();

    // Bulk Operations
    void putAll(Map t);
    void clear();

    // Collection Views
    public Set<K> keySet();
    public Collection<V> values();
    public Set<Entry<K,V>> entrySet();

    // Interface for entrySet elements
    public interface Entry<K,V>
    {
        K getKey();
        V getValue();
        V setValue(V value);
    }
}
```

### SortedMap Interface

- Sorted based on keys
- Similar operations to those found in SortedSet

```java
public interface SortedMap extends Map
{
    Comparator comparator();
    SortedMap subMap(Object fromKey, Object toKey);
    SortedMap headMap(Object toKey);
    SortedMap tailMap(Object fromKey);
    Object firstKey();
    Object lastKey();
}
```

### Collection Class (Algorithms)

- Provides commonly used algorithms that can be applied to many different data structures
- Types of algorithms: Sorting, Min/max, Searching

### How Interfaces, Implementations & Algorithms fit together

- **Interface:** defines the expected behaviour of a data structure
- **Implementation:** specifies how the required behaviour (interface) is implemented
  - Different implementations are better at certain operations, e.g., insertion/deletion with a linked list versus an array list
- **Algorithms:** general algorithms that can be applied to groups of data structures if they provide certain functionality (i.e., have expected behaviour)
  - E.g., the bubble sort algorithm is the same for anything that implements a list

## Collection Streams

- Java 8 introduced a new way to process collections
- Phases:
  - Obtain a stream from a collection
  - Configure the stream for processing
  - Initiate processing
- Each time a stream is processed/filtered, a new stream is created that can act as input to further operations

### Types of Processing Operations

- **Filter:** select specific elements for inclusion; returns true/false
- **Map:** converts a stream into another type, e.g., a stream of Person into a stream of String
- **Min/max:** select the smallest/largest element using some criteria
- **Collect:** processes the stream & converts output to some other form, e.g., List, Map, etc.
- **Count:** processes the stream & returns the number of elements in the stream
- **Reduce:** converts (reduces) the stream into a single value, e.g., the sum of ages

### Parallelism

- Possible to execute processing in parallel (potentially on different CPUs)
- Ordering of calculations is NB!!
  - Instead of `stream()`, use `parallelStream()`
  - Some other considerations:
    - Deciding how to partition data processing to different CPUs
    - How operations interact
    - How to join the results obtained from different CPUs

## Regular Expressions (RegEx)

- Pattern:
  - A string pattern that is searched for in another string
  - Can extract parts of a pattern
  - Described as a string
- A Pattern (object) is compiled from a string (regular grammar)
- A Pattern (object) is matched against another string
  - If the same pattern is used to match against multiple strings, a Matcher (object) should be used (compiling a pattern is expensive to do)

Multi-use matching:

```java
Pattern p = Pattern.compile("a*b");
Matcher m = p.matcher("aaaaab");
```

Single-use matching:

```java
boolean b = Pattern.matches("a*b", "aaaaab");
```

### Predefined character classes

- `.` — Any character (may or may not match line terminators)
- `\d` — A digit: `[0-9]`
- `\D` — A non-digit: `[^0-9]`
- `\h` — A horizontal whitespace character
- `\H` — A non-horizontal whitespace character
- `\s` — A whitespace character: `[ \t\n\x0B\f\r]`
- `\S` — A non-whitespace character: `[^\s]`
- `\v` — A vertical whitespace character
- `\V` — A non-vertical whitespace character
- `\w` — A word character: `[a-zA-Z_0-9]`
- `\W` — A non-word character: `[^\w]`

### Syntax

- `a*` = 0 or more a's
- `a+` = 1 or more a's
- `ab*` = a, followed by zero or more b's
- `[a-z]` = single letter, a, b, c, …, z
- `[a-z]+` = one or more a..z
- `[a-zA-Z]*` = zero or more lowercase or uppercase a-z

Remember:

- `\` is the escape character for the regular grammar
- `"\\\\"` = `\\` = backslash character (if needed in the matching string)
- `"\\d"` = `\d`

Groups:

- `(a+bc*)+` = one or more (one or more a, followed by a b, followed by zero or more c)
  - `()` is known as a capturing group
  - Can name a group, so it can be obtained in code
    - Name specified by `<?name>`
    - E.g., `my name is (<?name>.+), and I am (<?age>\d+) years old`
    - In code, if a match is found, can obtain the name and age text

Quantifiers and anchors:

- `a{3,8}` = 3 to 8 a's
- `a{3}` = exactly 3 a's
- `(a+|0+)b` = (one or more a's) OR (one or more 0's) followed by a b
- Patterns match anywhere in a string, so if you want to specify the start of a string, use `^`, e.g.:
  - `^a+b` = the string must start with one or more a's, followed by a b
