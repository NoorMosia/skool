# Lecture 05: Fragments

## What is a Fragment?

- Represents a reusable portion of an app's UI
- Defines & manages its own layout, has its own lifecycle & can handle its own input events
- Can't live on its own, so it must be hosted by an Activity (or another fragment)
- Its view hierarchy then becomes part of / attaches to the host's view hierarchy

## Why fragments?

- Different devices
  - Different resolutions & physical sizes
- Problem: to write as little code as possible but support multiple devices
- Solution: break up into reusable parts
  - Fragment: self-contained (behaviour & layout)
  - Fragment is contained in an Activity
  - Different Fragment configurations for different devices
  - Lifetime of a contained Fragment is closely bound to the Activity's

## Activity stacks

- LIFO stack of Activities
- Top-most = active Activity
- As new Activities are started (normally):
  - Pushed onto the stack
  - Previous topmost becomes inactive
  - New Activity becomes active
- When the back button is pushed or activity is closed:
  - The last active Activity is removed to free resources

## Activity states

- **Active**
  - At the top of the stack
  - Is the visible, focused, foreground Activity
  - Android attempts to keep it alive at all costs (will rather kill Activities lower on the stack to recover resources)
  - Paused when another Activity becomes active
- **Paused**
  - Normally not visible; always not focused
  - Treated as active, but no user input events received
  - Killed in extreme circumstances to recover resources
  - Is stopped if it becomes obscured
- **Stopped**
  - Not visible
  - Remains in memory, retains state memory, but is a candidate for termination
  - NB: save data & current UI state
- **Inactive**
  - After being killed, before being launched, it is inactive
  - Removed from the stack & needs to be restarted before it will be displayed & be usable

## Monitoring Activity state changes

| Method | When triggered | What to do |
|---|---|---|
| **onCreate** | Start of full lifecycle | Initialise Activity & inflate UI |
| **onRestoreInstanceState** | Called after onCreate finished (only called if killed since last visible) | Restore UI state |
| **onRestart** | Called before subsequent visible lifetimes of Activity | Load changes, knowing it has already been visible |
| **onStart** | Called at start of visible lifetime | Apply any required UI change now that Activity is visible |
| **onResume** | Called at start of active lifetime | Resume paused UI updates, etc. that were suspended when inactive |
| **onSaveInstanceState** | Called to save UI state changes at end of active lifecycle | Save UI state changes |
| **onPause** | Called at end of active lifetime | Suspend UI updates etc. that don't need to be active when not the foreground Activity |
| **onStop** | Called at end of visible lifetime (may be killed after this) | Suspend UI updates etc. not needed when not visible. Persist all edits or state changes |
| **onDestroy** | Sometimes called at end of full lifecycle | Clean up resources (stop threads, close database connections, etc.) |

## Fragments

- Encapsulated, independent, reusable components
- Own lifetime & UI
- Allows dynamic & flexible UIs to be created
- Each Fragment is tightly bound to the Activity in which it is placed
  - But can be reused/replaced
- Typically follow the lifetime of the parent Activity
  - But after that may follow its own lifetime if added/replaced/removed dynamically from code
    - The parent Activity provides a `FragmentManager` for managing contained Fragments

### How Fragments can be added

- Can be added to the parent Activity View either:
  - In code:
    - Need to load it manually
    - But can dynamically swap Fragments in/out
  - In XML (in the Activity's layout file):
    - Loaded during inflation
    - But cannot swap the Fragment in/out
- Do not appear in the manifest

## Monitoring Fragment state changes

| Method | When triggered | What to do |
|---|---|---|
| **onAttach** | Called when attached to parent Activity | Get reference to parent Activity |
| **onCreate** | Called to initialise creation of Fragment | Initialise Fragment (not UI!!) |
| **onCreateView** | Called when created, so that UI can be created | Create/inflate UI in the provided container |
| **onViewCreated** | Called after the fragment's Views created and initialised | Obtain references to Views, set initial values |
| **onActivityCreated** | Called after Activity & Fragment UI created | Complete initialisation, esp. anything needing the parent to be fully inflated |
| **onStart** | Called at start of visible lifetime | Apply any required UI change now that visible |
| **onResume** | Called at start of active lifetime | Resume paused updates etc. that were suspended |
| **onPause** | Called at end of active lifetime (often killed after this) | Suspend updates etc. Persist edits/state changes |
| **onStop** | Called at end of visible lifetime | Suspend remaining updates etc. not required when not visible |
| **onDestroyView** | Called when the view is being detached | Clean up resources related to the Fragment's View |
| **onDetach** | Called once detached from parent Activity | |
| **onDestroy** | Called at end of lifetime | Clean up resources related to the Fragment, e.g., database connections |

## Steps required to include a Fragment

1. Create the Fragment layout [New → Fragment → Fragment (Blank)]
2. Create the Fragment class
   - Inflate the layout in the class's `onCreateView` event handler (not `onCreate`)
3. Create the Activity layout
   - Add the Fragment in XML OR place a container into which the Fragment will be placed
4. Create the Activity class
   - If the Fragment was not added to the Activity layout, then manually add the Fragment to a container in `onCreate` (& other methods if needed)

It is considered good practice to include any View containers used in any transactions in all layout variations.

## Communication

### Activity → Fragment

- Notify the Fragment of something interesting in the Activity
  - Could have a Fragment listen to an Activity, but since the Activity has a reference to the fragment, it is not necessary
- The Activity obtains a reference to the contained Fragment & calls a method on it
- Can send through parameters when creating the Fragment in a Bundle

### Fragment → Activity

- Notify the Activity of something interesting happening in the Fragment
- Define an interface that the Activity implements, i.e., listeners
  - Call the interface method(s) when something occurs, i.e., notify listeners when something interesting happens

### Fragment ↔ Fragment

- Each Fragment has communication interfaces (for callbacks) as needed
  - i.e., have each fragment listen to the other fragment
- Initial linking between fragments is done by the Activity
- Alternatively, the Activity acts as an intermediary between Fragments
- Could use the publish-subscribe pattern
  - No references required between the Activity & Fragments (de-coupled)
- Could use a ViewModel
