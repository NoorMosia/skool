# Lecture 02: Basic Android UI Views

## Android View Hierarchy

### Introduction

- View:
  - Base class from which many other UI controls extend
- Activities contain a single RootView (just like JavaFX)
- The root view is often a container or layout
  - E.g., LinearLayout or ScrollView

### Typical procedure

- Drag-and-drop a View onto the Layout, or edit the Layout's XML directly
- Style the View (hard-coded or styled)
- Attach an event handler in the Layout

### Typical attributes

- Id – important for obtaining a reference to the View from code
- Sizing
- Colours
- Fonts

### Sizing

- Has a `layout_width` and `layout_height` property
- Can be set differently:
  - `wrap_content` tells your view to size itself to the dimensions required by its content
  - `match_parent` tells your view to become as big as its parent view group will allow
  - absolute size can be set by specifying the density independent pixel size, e.g., `10dp`

## Layouts

UI is built of ViewGroups & Views.

- A View is a leaf node & typically represents something the user can see & interact with, e.g., a Button
- A ViewGroup contains 0+ Views & other ViewGroups
  - Typically invisible to the user & manages the positions & sizes of objects it contains
  - Are interior nodes of the Scene Graph tree, e.g., Linear Layout
- Can choose a different root LayoutView Group: right-click & choose "Convert View"

### Types of layouts

- Many different layouts
- A lot are similar to what was encountered in JavaFX
  - Linear Layout: for arranging Views horizontally or vertically
  - Constraint Layout: for arranging Views in terms of other Views (use this flexible layout instead of the legacy ones)

### Layouts requiring Adapters

- Just like in JavaFX, certain layouts need adapters to tell Android which layout to use for a specific element in a list & populate it with the correct values
- The most common layouts requiring an adapter are:
  - RecyclerView (ListView)
  - GridView
  - Spinner

## Buttons

Different kinds of buttons:

- "Vanilla" buttons
- Toggles
  - check box, switch, toggle button, ...
- Grouped buttons
  - radio buttons, chips, ...
- Can attach an event handler for `onClick` either in the editor or from code
- Grouped & toggles also have `onCheckChange` event handlers

## Text

### Text Views

- Text Views come in:
  - read-only mode (e.g., Labels in JavaFX) - `TextView`
  - read/write - `EditText`, etc.
- Can listen for text entry events:
  - key
  - focus change

## Images

### Image formats

- Images are a type of Drawable found in Android
- You can have your own custom drawables if you want (in XML and/or code)
- Android supports a number of image formats, including: JPEG, PNG, GIF, BMP
- When using images as a resource, do not make images too large as they consume a lot of memory
- Android has a Canvas class, which functions in a similar fashion to the Canvas class in JavaFX
  - You may make your own (custom) Drawable, which draws onto a canvas

## Containers

- A number of containers are provided:
  - ScrollView
  - RecyclerView
  - Spinner
- A container contains other Views & decides which, if any, to display at any given time
- It specifies the type of user interactions possible
- It may optimise the views by recycling views

## Adapter-based Views

A number of Views are Adapter-based. What they have in common is:

- A collection of raw data to be displayed - typically knows nothing of View (MVC)
- An item View that can display a single element of data (MVC)
- An Adapter that knows how to do the mapping from data => item View and has a reference to the data collection (MVC)
- A container View (e.g., ListView, RecyclerView, GridView, ...) that uses an Adapter (MVC)
- Some views have built-in Adapters for simple mappings

## Recycler View

- Similar to ListView, but has many additional features
- Can use a layout other than Linear (supports Linear, Grid, Staggered Grid & custom)
- Optimises memory usage for large lists

### Creating a custom Recycler View

- Define a layout for each individual data element
- Define a class that extends `RecyclerView.ViewHolder` to hold details about a specific view being recycled
- Define a class that extends `RecyclerView.Adapter` to handle the creation of the Views & to set the data in a particular view
- Can optionally set additional settings, such as decorators
