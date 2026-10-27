registerLecture({
  id: "02",
  title: "L02: Basic Android UI Views",
  blurb: "View hierarchy, sizing, layouts, buttons, text, images, containers, adapters, RecyclerView.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "What does the `wrap_content` value for layout_width / layout_height do?",
      options: [
        "Sizes the view to the dimensions required by its content",
        "Makes the view as big as its parent will allow",
        "Sets an absolute density-independent pixel size",
        "Hides the view until content is added"
      ],
      answer: 0,
      explanation: "`wrap_content` tells the view to size itself to its content; `match_parent` makes it as big as the parent allows."
    },
    {
      type: "mcq",
      prompt: "Which value makes a view become as big as its parent view group will allow?",
      options: ["`wrap_content`", "`match_parent`", "`fill_content`", "`10dp`"],
      answer: 1,
      explanation: "`match_parent` expands the view to the size the parent allows."
    },
    {
      type: "mcq",
      prompt: "In the View hierarchy, what is a ViewGroup?",
      options: [
        "A leaf node the user interacts with, like a Button",
        "A container that holds 0+ Views and other ViewGroups",
        "An XML file defining the layout",
        "A read-only text component"
      ],
      answer: 1,
      explanation: "A ViewGroup contains 0+ Views & other ViewGroups; it is an interior node of the scene graph, e.g. LinearLayout."
    },
    {
      type: "mcq",
      prompt: "Which layout is recommended for arranging Views in terms of other Views, instead of the legacy layouts?",
      options: ["LinearLayout", "ConstraintLayout", "ScrollView", "GridView"],
      answer: 1,
      explanation: "Constraint Layout arranges Views relative to other Views and is preferred over the legacy layouts."
    },
    {
      type: "mcq",
      prompt: "Which attribute is important for obtaining a reference to a View from code?",
      options: ["Its colour", "Its font", "Its id", "Its layout_width"],
      answer: 2,
      explanation: "The id is important for obtaining a reference to the View from code."
    },
    {
      type: "mcq",
      prompt: "Which Text View is read/write (the user can type into it)?",
      options: ["`TextView`", "`EditText`", "`Label`", "`ImageView`"],
      answer: 1,
      explanation: "`TextView` is read-only (like a Label); `EditText` is read/write."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Which layouts commonly require an Adapter?",
      options: ["RecyclerView (ListView)", "GridView", "Spinner", "ConstraintLayout"],
      answers: [0, 1, 2],
      explanation: "RecyclerView, GridView and Spinner need adapters. ConstraintLayout does not."
    },
    {
      type: "multi",
      prompt: "Which image formats does Android support (per the lecture)?",
      options: ["JPEG", "PNG", "GIF", "SVG-only"],
      answers: [0, 1, 2],
      explanation: "Android supports JPEG, PNG, GIF, BMP among others. 'SVG-only' is not a listed format."
    },
    {
      type: "multi",
      prompt: "An Adapter-based View arrangement has which elements in common (MVC)?",
      options: [
        "A collection of raw data to be displayed",
        "An item View that can display a single element of data",
        "An Adapter that maps data to an item View",
        "A compiled machine-code binary"
      ],
      answers: [0, 1, 2],
      explanation: "Raw data, an item View, an Adapter doing the mapping, and a container View that uses the Adapter."
    },
    {
      type: "multi",
      prompt: "Which layout types does a RecyclerView support?",
      options: ["Linear", "Grid", "Staggered Grid", "ConstraintLayout"],
      answers: [0, 1, 2],
      explanation: "RecyclerView supports Linear, Grid, Staggered Grid and custom layouts."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "An Activity contains a single RootView, just like in JavaFX.",
      answer: true,
      explanation: "Correct. The root view is often a container or layout such as LinearLayout or ScrollView."
    },
    {
      type: "tf",
      prompt: "When using images as a resource, making them very large is fine because Android optimises them automatically.",
      answer: false,
      explanation: "Do not make images too large as they consume a lot of memory."
    },
    {
      type: "tf",
      prompt: "RecyclerView optimises memory usage for large lists.",
      answer: true,
      explanation: "Correct. It is similar to ListView but optimises memory usage for large lists and has more features."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "To create a custom RecyclerView, you define a class that extends `RecyclerView.{{blank}}` to hold details about a recycled view, and a class that extends `RecyclerView.{{blank}}` to create the Views and set the data.",
      blanks: [["ViewHolder"], ["Adapter"]],
      explanation: "ViewHolder holds a recycled view's details; Adapter handles creating views and setting data."
    }
  ]
});
