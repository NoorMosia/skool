registerGuide({
  id: "06",
  title: "L06: Collections & Regular Expressions",
  blurb: "Work with data in memory and validate text: pick a collection, iterate it, filter with streams, and match with regex (including the 9-digit number the exam loves).",

  recipes: [
    // ============================================================
    {
      name: "Choose a collection and iterate it",
      goal: "Hold a group of items in the right structure and loop over them.",
      tags: ["Collections", "Iterable"],
      steps: [
        {
          do: "Pick the structure that matches your need.",
          body: [
            { list: [
              "`List` (ArrayList): ordered, indexable, duplicates allowed.",
              "`Set` (HashSet): no duplicates, unordered.",
              "`Map` (HashMap): key to value, unique keys.",
              "`Queue` (LinkedList / PriorityQueue): FIFO or priority order."
            ]},
            { note: "Declare the variable as the interface, e.g. `List<String> x = new ArrayList<>();`. Coding to the interface keeps the code flexible." }
          ]
        },
        {
          do: "Create one and add items.",
          body: [
            { code:
"import java.util.*;\n" +
"\n" +
"List<String> books = new ArrayList<>();\n" +
"books.add(\"WRPV301\");\n" +
"books.add(\"WRPV302\");\n" +
"\n" +
"Map<String, Integer> stock = new HashMap<>();\n" +
"stock.put(\"WRPV301\", 100);", lang: "java" }
          ]
        },
        {
          do: "Iterate with a for-each loop.",
          body: [
            { code:
"for (String code : books) {\n" +
"    System.out.println(code);\n" +
"}\n" +
"\n" +
"for (Map.Entry<String, Integer> e : stock.entrySet()) {\n" +
"    System.out.println(e.getKey() + \" = \" + e.getValue());\n" +
"}", lang: "java" },
            { note: "A for-each works on anything Iterable. Behind it is an iterator with hasNext / next / remove." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Filter and transform with streams",
      goal: "Query a collection in a readable pipeline instead of manual loops.",
      tags: ["Streams"],
      steps: [
        {
          do: "Build a stream pipeline: filter, map, collect.",
          body: [
            { code:
"import java.util.stream.Collectors;\n" +
"\n" +
"List<String> thirdYear = books.stream()\n" +
"        .filter(code -> code.contains(\"3\"))       // keep some\n" +
"        .map(code -> code.toUpperCase())           // transform each\n" +
"        .collect(Collectors.toList());             // gather results", lang: "java" },
            { note: "The arrow `->` is a lambda, a small inline function. `code -> code.contains(\"3\")` means: take one item called `code`, return whether it contains a 3. filter keeps elements, map changes each element (even its type), collect gathers the output into a List or Map." }
          ]
        },
        {
          do: "Reduce a stream to a single value when you need a total.",
          body: [
            { code:
"int totalStock = stock.values().stream()\n" +
"        .reduce(0, (a, b) -> a + b);", lang: "java" },
            { note: "Each stream operation returns a NEW stream, so operations chain. Use `parallelStream()` to spread work across CPUs when order does not matter." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Search a list with a regex pattern",
      goal: "Find items whose text matches a pattern, like the server's SEARCH command.",
      tags: ["RegEx", "Pattern"],
      steps: [
        {
          do: "Compile the pattern once, then test each item.",
          body: [
            { code:
"import java.util.regex.Pattern;\n" +
"\n" +
"Pattern pattern = Pattern.compile(\"WRPV3.*\");\n" +
"for (String code : books) {\n" +
"    if (pattern.matcher(code).matches()) {\n" +
"        // code matches the pattern\n" +
"    }\n" +
"}", lang: "java" },
            { note: "Reuse a compiled Pattern when matching many strings, because compiling is expensive. `matches()` requires the WHOLE string to match." }
          ]
        },
        {
          do: "Know the patterns the exam uses.",
          body: [
            { list: [
              "`WRPV3.*` matches anything starting with WRPV3.",
              "`^[A-Z]{4}3\\d{2}$` matches 4 letters, a 3, then 2 digits: all third-year codes.",
              "`a{3,8}` is 3 to 8 a's; `a+` is one or more; `a*` is zero or more."
            ]}
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Validate input with regex (9 digits)",
      goal: "Reject bad input before acting on it, e.g. a membership or student number that must be exactly 9 digits.",
      tags: ["RegEx", "Validation"],
      steps: [
        {
          do: "Use String.matches for a one-off check.",
          body: [
            { code:
"String number = editNumber.getText().toString().trim();\n" +
"if (!number.matches(\"\\\\d{9}\")) {\n" +
"    // invalid: show a message and stop\n" +
"    return;\n" +
"}\n" +
"// valid: continue", lang: "java" },
            { note: "In a Java string literal you escape the backslash, so the regex `\\d{9}` is written `\"\\\\d{9}\"`. `matches` anchors to the whole string, so `^` and `$` are implied." }
          ]
        },
        {
          do: "Prove it with a couple of cases.",
          body: [
            { list: [
              "`\"206008384\"` has 9 digits, so it passes.",
              "`\"20600838\"` has 8 digits, so it fails.",
              "`\"2060083X4\"` contains a letter, so it fails."
            ]}
          ]
        }
      ]
    }
  ]
});
