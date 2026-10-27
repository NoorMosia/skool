registerLecture({
  id: "06",
  title: "L06: Collections & Regular Expressions",
  blurb: "Collection framework interfaces, implementations, algorithms, streams, and regular expression syntax.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "How many main parts does the Java Collection Framework have?",
      options: ["2", "3", "4", "5"],
      answer: 1,
      explanation: "Three main parts: Interfaces, Implementations, and Algorithms."
    },
    {
      type: "mcq",
      prompt: "Which interface introduces the concept of no duplicates?",
      options: ["List", "Set", "Queue", "Map"],
      answer: 1,
      explanation: "The Set interface introduces the concept of no duplicates (but not order)."
    },
    {
      type: "mcq",
      prompt: "Which interface adds the concept of position & order to a Collection?",
      options: ["Set", "List", "SortedSet", "Map"],
      answer: 1,
      explanation: "The List interface adds position & order (get/set by index)."
    },
    {
      type: "mcq",
      prompt: "A Map specifies a dictionary of what?",
      options: [
        "Ordered unique elements",
        "<key, value> pairs with unique keys",
        "A FIFO sequence",
        "A sorted set of values"
      ],
      answer: 1,
      explanation: "A Map specifies a dictionary of <key, value> pairs with unique keys; it is a separate hierarchy from Collection."
    },
    {
      type: "mcq",
      prompt: "To order elements in a SortedSet, an element can implement which interface?",
      options: ["Iterable", "Comparable", "Runnable", "Serializable"],
      answer: 1,
      explanation: "Ordering is done using a Comparator OR the element implementing the Comparable interface."
    },
    {
      type: "mcq",
      prompt: "Which Java version introduced the new stream way of processing collections?",
      options: ["Java 5", "Java 7", "Java 8", "Java 11"],
      answer: 2,
      explanation: "Java 8 introduced streams for processing collections."
    },
    {
      type: "mcq",
      prompt: "Which stream operation reduces the stream into a single value, e.g. the sum of ages?",
      options: ["Filter", "Map", "Reduce", "Count"],
      answer: 2,
      explanation: "Reduce converts (reduces) the stream into a single value."
    },
    {
      type: "mcq",
      prompt: "To process a stream in parallel, which method is used instead of stream()?",
      options: ["`concurrentStream()`", "`parallelStream()`", "`multiStream()`", "`asyncStream()`"],
      answer: 1,
      explanation: "Use parallelStream() instead of stream() to process in parallel."
    },
    {
      type: "mcq",
      prompt: "In regex, what does `a*` match?",
      options: ["Exactly one a", "One or more a's", "Zero or more a's", "Any character except a"],
      answer: 2,
      explanation: "`a*` = 0 or more a's; `a+` = 1 or more a's."
    },
    {
      type: "mcq",
      prompt: "If the same regex pattern is used to match against multiple strings, what should be used?",
      options: ["A new Pattern each time", "A Matcher object", "A Scanner", "A Comparator"],
      answer: 1,
      explanation: "A Matcher object should be used because compiling a pattern is expensive."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Which are aims of the Collection Framework?",
      options: [
        "Reusable data structures",
        "Reusable algorithms",
        "Leverage multiple CPUs for parallel computation (Java 8+)",
        "Automatic network serialisation"
      ],
      answers: [0, 1, 2],
      explanation: "Reusable data structures, reusable algorithms, and parallel computation. Network serialisation is not an aim."
    },
    {
      type: "multi",
      prompt: "Which are implementations of the Set interface?",
      options: ["HashSet", "LinkedHashSet", "TreeSet", "ArrayList"],
      answers: [0, 1, 2],
      explanation: "HashSet, LinkedHashSet and TreeSet implement Set. ArrayList is a List."
    },
    {
      type: "multi",
      prompt: "Which three types of algorithms does the Collection (algorithms) class provide?",
      options: ["Sorting", "Min/max", "Searching", "Encryption"],
      answers: [0, 1, 2],
      explanation: "Sorting, Min/max, and Searching. Encryption is not listed."
    },
    {
      type: "multi",
      prompt: "Which are the three phases of stream processing?",
      options: [
        "Obtain a stream from a collection",
        "Configure the stream for processing",
        "Initiate processing",
        "Serialise the stream to disk"
      ],
      answers: [0, 1, 2],
      explanation: "Obtain, configure, then initiate processing. Each processing step produces a new stream."
    },
    {
      type: "multi",
      prompt: "Which statements about Iterable/iterators are correct?",
      options: [
        "Iterable has a method that returns an iterator",
        "An iterator stores the state of a traversal",
        "Iterator provides hasNext, next, remove",
        "An iterator guarantees elements are unique"
      ],
      answers: [0, 1, 2],
      explanation: "Iterable returns an iterator; the iterator holds traversal state and provides hasNext/next/remove. Uniqueness is a Set concept, not an iterator one."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "When writing code, you should use implementations in preference to interfaces because it is more scalable.",
      answer: false,
      explanation: "The opposite: use interfaces in preference to implementations — it is more scalable."
    },
    {
      type: "tf",
      prompt: "In regex, the backslash `\\` is the escape character for the regular grammar.",
      answer: true,
      explanation: "Correct. e.g. \"\\\\d\" represents \\d, and \"\\\\\\\\\" represents a literal backslash."
    },
    {
      type: "tf",
      prompt: "In regex, patterns only match at the start of a string by default.",
      answer: false,
      explanation: "Patterns match anywhere in a string by default; use ^ to anchor to the start."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "In regex, a capturing group is written with {{blank}} and can be named so it can be obtained in code.",
      blanks: [["()", "parentheses", "( )", "round brackets"]],
      explanation: "() is a capturing group; a name is specified by <?name>."
    },
    {
      type: "fill",
      prompt: "The quantifier `a{3,8}` means 3 to 8 a's, while `a{3}` means exactly {{blank}} a's.",
      blanks: [["3", "three"]],
      explanation: "a{3} = exactly 3 a's; a{3,8} = 3 to 8 a's."
    }
  ]
});
