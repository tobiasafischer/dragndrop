# Drag and Drop !!

## THIS LIBRARY IS CONFUSING FOR NO REASON SO STRAP IN

# DISCLAIMER PLACEHOLDER AND DROPSHADOW ARE USED INTERCHANGEABLY WE CHANGED THE NAME HALF WAY THROUGH AND NO WAY IN HELL AM I UPDATING IT LOL

## Why are you writing documentation? Don’t they have some?

Sure! react-beautiful-dnd (we will be calling it rbdnd) has [documentation](https://github.com/atlassian/react-beautiful-dnd), but if I am speaking to you straight, the syntax of this library is so confusing and not intuitive at all. 90% of the examples you will find online are also done in classical react with some of the worst practices you will see (a 5 year old learning scratch can do it better lol). Partly this is because the library is no longer being actively maintained, but it is still a super solid library which is pretty versatile. 

## Okay, what variables am I working with?

So, with a lot of react libraries you will see the use of [context](https://reactjs.org/docs/context.html). In rbdnd, on the top level of ANY dragging / dropping we wrap with

```tsx
<DragDropContext />
```

Drag and drop context can actually do quite a bit but for this case, we will focus specifically on onDragEnd (thats a mouthful lol). OnDragEnd is a function that supplies you with a result object

THIS IS A LOT RIGHT?! Don’t worry though we really only care about ***source*** and ***destination*** which we will get into later on. ANYWAYS, think of onDragEnd the same as a form onSubmit which triggers the function when the action is done. 

```tsx
// result example
{
    "draggableId": "de94be5d-24c9-48f8-9253-edb8bfd63953",
    "type": "row",
    "source": {
        "index": 0,
        "droppableId": "a8ba2663-12b5-4c64-affb-871ceaf453b7"
    },
    "reason": "DROP",
    "mode": "FLUID",
    "destination": {
        "droppableId": "a8ba2663-12b5-4c64-affb-871ceaf453b7",
        "index": 1
    },
    "combine": null
}
```

Lets get into the spicy stuff 💯 💅 🔥

So our next variable is the wonderful 

```tsx
<Droppable />
```

Droppable is basically a container that a draggable item is able to be dropped in. It takes a couple of props but really all we care about is ***droppableId***, ***direction***, and ***type***. As you can see above in result,  we see this “droppableId” fella come up OFTEN so get used to them. Basically all this does is lets us identify which thingy we are dropping our drag into so we can manipulate the array appropriately. If you have ONE droppable, you can hardcode the droppableId (because there’s only one thing to drop on duh!), however, for dynamic lists you want to use a custom id (i just used uuid in this case) to differentiate the children (think of it like a key).

If you wanna get a lil more abstract think of Droppable like a container for your draggable children lol.

(if you want the actual props)

```tsx
type Props = {|
  // required
  droppableId: DroppableId,
  // optional
  type?: TypeId,
  mode?: DroppableMode,
  isDropDisabled?: boolean,
  isCombineEnabled?: boolean,
  direction?: Direction,
  ignoreContainerClipping?: boolean,
  renderClone?: DraggableChildrenFn,
  getContainerForClone?: () => HTMLElement,
  children: (DroppableProvided, DroppableStateSnapshot) => Node,
|};

type DroppableMode = 'standard' | 'virtual';
type Direction = 'horizontal' | 'vertical'
```

Now for the real juicer of this library, the bad boy, the cool kid, etc. which is 

```tsx
<Draggable />
```

Draggable is what is attached to the actual container you wish to drag into the droppable areas. The syntax of draggableId (like a uuid or any unique identifier for dynamically instantiated draggables, or such as droppable, if its a singular draggable piece, you can choose any id) and an index which is used to determine the position of the object you are dragging (when mapping your array just do 

```tsx
{arr.map(({content, id}, idx) => <Component key={id} id={id} idx={idx}>{item}</Component>)}
```

(if you want the actual props)

```tsx
type Props = {|
  // required
  draggableId: DraggableId,
  index: number,
  children: DraggableChildrenFn,
  // optional
  isDragDisabled: ?boolean,
  disableInteractiveElementBlocking: ?boolean,
  shouldRespectForcePress: ?boolean,
|};
```

## Okay! are you still with me? now let’s complicate everything 😳💅

SO, this library isn’t just sunshine and rainbows of Draggables and Droppables... let me introduce to you the lovely ***provided*** and ***snapshot.*** I am going to assume that this syntax is brand new to you so bear with me.

Immediately following any Droppable or Draggable, you must provide a function underneath that holds the variables of provided and snapshot objects. These objects are used to distribute props to the jsx and act as the core functionality of this library.

Now, although they have near identical syntax, there is DroppableProvided and DraggableProvided with the exact same input but with a few discrepancies.

```tsx
type DroppableProvided = {|
  innerRef: (?HTMLElement) => void,
  droppableProps: DroppableProps,
  placeholder: ?Node,
|};

type DroppableProps = {|
  // used for shared global styles
  'data-rbd-droppable-context-id': ContextId,
  // Used to lookup. Currently not used for drag and drop lifecycle
  'data-rbd-droppable-id': DroppableId,
|};
```

```tsx
type DraggableProvided = {|
  innerRef: (HTMLElement) => void,
  draggableProps: DraggableProps,
  // will be null if the draggable is disabled
  dragHandleProps: ?DragHandleProps,
|};
```

Let’s start with Droppable,  droppable has a provided object which holds (as shown above) innerRef, droppableProps, and placeholder (we will get into placeholder later). A brief introduction into what the props actually do is

| innerRef | ref obj to put on container to allow the div to be dropped into |
| --- | --- |
| droppableProps | the functionality of the droppability that is tied to the div |
| placeholder | div that acts as the placeholder for the obj you are dragging |

So, let’s dive in and get this show on the road

[https://codesandbox.io/s/github/tobiasafischer/dragndrop/tree/main/](https://codesandbox.io/s/github/tobiasafischer/dragndrop/tree/main/)

```tsx
import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Column from '../Column/Column'
import { useDragDrop } from '../DragDropProvider'
import { ColumnDropshadow, Container } from './Board.styled'

const Board: React.FC = () => {
   const { handleDragEnd, handleDragStart, handleDragUpdate, colDropshadowProps, columns } =
      useDragDrop()

   return (
      <DragDropContext
         onDragEnd={handleDragEnd}
         onDragStart={handleDragStart}
         onDragUpdate={handleDragUpdate}
      >
         {/* we put our id and type on the droppable */}
         <Droppable droppableId="all-columns" direction="horizontal" type="column">
						{/* notice our provided object destructured */
            {(provided, snapshot) => (
               {/* immedietely have our (in this case columns) mapped */}
							 {/* provide id and index IMPORTANT */} 
               <Container id="task-board" {...provided.droppableProps} ref={provided.innerRef}>
                  {columns.map((column, columnIndex) => (
                     <Column key={column.id} column={column} columnIndex={columnIndex} />
                  ))}
                  {/* put placeholder on same level as mapping in place of it 
									think of it like you are having a placeholder for the mapped items */}
                  {provided.placeholder}
                  {snapshot.isDraggingOver && (
                     <ColumnDropshadow
                        marginLeft={colDropshadowProps.marginLeft}
                        height={colDropshadowProps.height}
                     />
                  )}
               </Container>
            )}
         </Droppable>
      </DragDropContext>
   )
}

export default Board
```

As you can see upfront it can get really confusing and overwhelming, but if you are able to break it down into these sections you can start to fill in the bigger picture. Now, let’s discuss the draggable implementation  by filling out the Column component as shown above.

```tsx
import React, { useEffect } from 'react'
import {
   Draggable,
   DraggableProvided,
   Droppable,
   DroppableProvided,
   DroppableStateSnapshot,
} from 'react-beautiful-dnd'
import { ColumnType } from '../../assets/api'
import { useDragDrop } from '../DragDropProvider'
import { Row } from '../Row'
import {
   Container,
   DropshadowContainer,
   RowContainer,
   RowDropshadow,
   Title,
   TitleContainer,
} from './Column.styled'

type Props = {
   column: ColumnType
   columnIndex: number
}

const Column: React.FC<Props> = ({ column, columnIndex }) => {
   const { rowDropshadowProps } = useDragDrop()

   return (
	    {/* we declare that this whole div is going to be draggable by adding the id and index */}
      <Draggable draggableId={column.id} index={columnIndex}>
				 {/* immedietely declare your provided object */}         
				 {(provided: DraggableProvided) => (
						{/* 
							This this is where we declare that this div is going to be draggable
							by providing the draggableProps spread and the innerRef		
						*/}
            <Container {...provided.draggableProps} ref={provided.innerRef}>
               <TitleContainer>
                  <Title {...provided.dragHandleProps}>{column.title}</Title>
               </TitleContainer>
               <Droppable droppableId={column.id} type="task">
                  {(prov: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                     <RowContainer ref={prov.innerRef} {...prov.droppableProps}>
                        {column.tasks.map((task, taskIndex) => (
                           <Row key={task.id} task={task} index={taskIndex} />
                        ))}
                        {prov.placeholder}
                        <DropshadowContainer>
                           {snapshot.isDraggingOver && (
                              <RowDropshadow
                                 marginTop={rowDropshadowProps.marginTop}
                                 height={rowDropshadowProps.height}
                              />
                           )}
                        </DropshadowContainer>
                     </RowContainer>
                  )}
               </Droppable>
            </Container>
         )}
      </Draggable>
   )
}

export default Column
```

Perfect! You made your first drag and drop for the columns, which drag left to right and vice versa. Now let’s spice things up for a sec and add some rows

Hooooonnnneeesssstttllllyyyyyy Rows are going to be the exact same as Column but actually way easier TRUST ME.

```tsx
import React from 'react'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { TaskType } from '../../assets'

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 4px;
   width: 100%;
   height: 50px;
   margin-bottom: 10px;
   border: 1px solid;
`

type Props = {
   task: TaskType
   index: number
}

const Row: React.FC<Props> = ({ task, index }) => (
   <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
				{/* we dont wanna drag by a title so we put both our draggable
						and dragHandleProps so we can drag it by the div itself (across columns
						too... WOOOWWWWWWWW big brain		
				*/}
         <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
         >
            {task.content}
         </Container>
      )}
   </Draggable>
)

export default Row
```

So now that our brains are 5x the normal size, let’s get them a little bigger with the actual logic behind our code so we can actually persist our dragging.

Okay so let’s start off easy with something that we know! Remember all the way back up north about our DragDropContext and specifically onDragEnd? We’ll get locked and loaded because that’s coming up RIGHT NOW.

```tsx
// result is this
{
	draggableId: "e4eb8b2c-7c5b-452a-ad8b-d5ad6526a874",
	type: "row",
	source: {
		index: 0,
		droppableId: "d0f94f38-958a-4df3-a620-20679fb1d1b1"
	},
	reason: "DROP",
	mode: "FLUID",
	destination: {
		droppableId: "4b999fd1-4450-4e6b-94a8-8d8f99b26349",
		index: 1
	},
	combine: null,
}
// ^ 90% of this is absolutely useless

const handleDragEnd = (result: DropResult) => {
  // if there is no destination, theres nothing to manipulate so lets
  // nope out of there REAL quick
  if (!result.destination) return

  // we only care about source and destination so lets just grab those
  const { source, destination } = result

  // if our droppableId is all-columns that means that we are
  // dragging columns around because remember we did not have to
  // dynamically instantiate our top level droppable so we hard coded
  // the id
  if (source.droppableId === 'all-columns') {

     // we go this function to handle the column movement
     handleColumnMove(source, destination)
  } else {

     // else its a row move so we go here
     handleRowMove(source, destination)
  }
}
```

Ok NOT TOO SHABBY right ?! I am glad you’re still with me because up next is when the fun begins 

Let’s start with handleColumnMove

also here’s the props we working with

```tsx
// this is for task board so task and row are interchangable
export type TaskType = {
   content: string
   id: any
}

export type TaskColumnType = {
   id: any
   title: string
   rows: TaskType[]
}

export type TaskBoardType = {
   title: string
   columns: TaskColumnType[]
}

type Props = (
	 // this is just setState
   setColumns: React.Dispatch<React.SetStateAction<TaskColumnType[]>>,
   source: DraggableLocation, // { draggableId, index }
   destination: DraggableLocation, // { draggableId, index }
) => void
```

handleColumnMove

```tsx
type TaskBoardType = {
   title: string
   columns: TaskColumnType[]
}
// our column state is just Columns ^

const handleColumnMove: DragDropProps = (source, destination) =>
  // rememeber that source and dest are just { draggableId, index }
  // moving columns (:
  setColumns((prev) => {
		 // this is some computer science stuff with mutability go ask justin lol
     const updated = [...prev]
     // remove source column
     const [removed] = updated.splice(source.index, 1)
     // insert source column at new destination
     updated.splice(destination.index, 0, removed)
     return updated
  })
```

Easy right? now let’s get to the pain

Now for the rows, remember that there is two conditions we need to account for...

the first of these conditions is moving the rows in the same column, and the other is to account for moving rows BETWEEN columns.

```tsx
// determining if its diff col or same col for row movement
const handleRowMove: DragDropProps = (source, destination) => {
  // droppableId is in reference to what column it is so if they are the same,
  // then both droppableId's are the same,
  // if its diff columns then they not the same
  // btw since columns are dynamically instantiated, the droppableId i used is uuid

  if (source.droppableId !== destination.droppableId) {
     moveRowDifferentColumn(source, destination)
  } else {
     moveRowSameColumn(source, destination)
  }
}
```

```tsx
// props are the same ^^
export const moveRowDifferentColumn: Props = (setColumns, source, destination) => {
   // moving rows between columns
   setColumns((prev) => {
			const updated = [...prev]
      // filter out which column is the source and which is the destination
      const [sourceColumn] = updated.filter(({ id }) => id === source.droppableId)
      const [destinationColumn] = updated.filter(({ id }) => id === destination.droppableId)

      // extract the rows from the columnn
      const sourceRow = sourceColumn.rows
      const destinationRow = destinationColumn.rows

      // remove the source item
      const [removed] = sourceRow.splice(source.index, 1)
      // insert the source item at the new index
      destinationRow.splice(destination.index, 0, removed)

      return updated
   })
}
```

```tsx
// same props ^^
export const moveRowSameColumn: Props = (setColumns, source, destination) => {
   // moving rows in same column
   setColumns((prev) => {
			const updated = [...prev]
      // isolate the row of the column we want to adjust
      const [{ rows }] = updated.filter(({ id }) => id === source.droppableId)
      // remove the source item
      const [removed] = rows.splice(source.index, 1)
      // insert the source item at the new index
      rows.splice(destination.index, 0, removed)
      return updated
   })
}
```

### Ok I REALLY NEED YOUR ATTENTION FOR THIS ONE, let’s talk about custom placeholders.

let’s say in this specific project you are required to have a custom placeholder to display the droppable area for the item you are dragging. Honestly, this library doesn’t love when you do this, but this is Tobias code and Tobias code works best in chaos 😈 🔥

So you know how we discussed the onDragEnd prop on DragDropContext ? well let me introduce you to their cousins onDragStart and onDragUpdate

If onDragEnd triggers on the release of the dragging, then onDragStart triggers when the dragging begins, and the onDragUpdate is triggered once the item you are dragging interacts with another.

updated DragDropContext ! and state

```tsx
const [colDropshadowProps, setColDropshadowProps] = useState<{ marginLeft: number; height: number }>({
  marginLeft: 0,
  height: 0,
})
const [rowDropshadowProps, setRowDropshadowProps] = useState<{ marginTop: number; height: number }>({
  marginTop: 0,
  height: 0,
})

// jsx
<DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragUpdate={handleDragUpdate}>
```

okay! so lets start appropriately with onDragStart. onDragStart takes in an event which renders out to ... 

```tsx
// row event
{
	draggableId: "d38b1d78-4f5e-47dd-b939-74e1a95ac761"
	type: "row"
	source: {
		droppableId: "53405e67-3c88-42a7-8ca7-a51ef5923726"
		index: 0
	}
	mode: "FLUID"
}

// column event
{
	draggableId: "53405e67-3c88-42a7-8ca7-a51ef5923726"
	type: "column"
	source: {
		droppableId: "all-columns"
		index: 0
	}
	mode: "FLUID"
}
```

Again, with this type of stuff 90% of it is useless so all we actually care about is “type” and “source”, specifically index

Then our onDragStart function will execute as such:

```tsx
const handleDragStart = (event) => {
  // the destination and source colIndex will be the same for start
  const { index } = event.source
  if (event.type === 'column') {
     handleDropshadowColumn(event, index, index)
  } else {
     handleDropshadowRow(event, index, index)
  }
}
```

Not too bad right? Before we jump into the logic of the placeholder, lets get onDragUpdate out of the way because they are quite similar

like discussed above, onDragUpdate is triggered once a draggable item is moved (repositioning)

```tsx
const handleDragUpdate = (event) => {
  const { source, destination } = event
  if (!destination) return
  if (event.type === 'column') {
     handleDropshadowColumn(event, destination.index, source.index)
  } else {
     handleDropshadowRow(event, destination.index, source.index)
  }
}
```

Cool! so as you can see they are pretty similar because ultimately they serve the same function, just two different edge cases

Now let’s dig into the meat of the problem starting with column

```tsx
// handle the manipulation of placeholder for column
type ColumnDropshadowProps = (
   event: any,
   setColDropshadowProps: React.Dispatch<
      React.SetStateAction<{
         marginLeft: number
         height: number
      }>
   >,
   destinationIndex: number,
   sourceIndex: number,
) => void

const handleDropshadowColumn: ColumnDropshadowProps = (event, destinationIndex, sourceIndex) => {
  // isolate element we are dragging
  const draggedElement: Element | Node | null = getDraggedElement(event.draggableId)!
     .parentNode!.parentNode
  // if nothing is being dragged return
  if (!draggedElement) return
  // isolate the height of element to determine the height of element being dragged
  const { clientHeight } = draggedElement as Element
  // returning the manipulated array of dom elements
  const updatedChildrenArray: Element[] = getUpdatedChildrenArray(
     draggedElement as Element,
     destinationIndex,
     sourceIndex,
  )
  // grabbing the # for marginLeft
  const marginLeft = getStyle(
     updatedChildrenArray,
     destinationIndex,
     'marginRight',
     'clientWidth',
  )
  // setting props
  setColDropshadowProps({
     height: clientHeight,
     marginLeft,
  })
}
```

So yeah, it’s a lot, but in simple terms we are:

- isolating the element we are dragging
- switching the position inside of the array to determine where we need to place the placeholder
- then grab the offset of the column to determine where the column placeholder will snap to and we are putting that into a style object for the offset from the starting position of the parent div (will explain later on)

Now let’s talk about those helper functions in there of getUpdatedArray, getDraggedElement, and getStyle

```tsx
const getDraggedElement = (draggableId) => {
   const queryAttr = 'data-rbd-drag-handle-draggable-id'
   const domQuery = `[${queryAttr}='${draggableId}']`
   const draggedElement = document.querySelector(domQuery)
   return draggedElement
}const getUpdatedChildrenArray = (
   draggedElement: Element,
   destinationIndex: number,
   sourceIndex: number,
) => {
   // grab children of the node
   const child: Element[] = [...draggedElement!.parentNode!.children]

   // if the indexes are the same (onDragStart) just return the dom array
   if (destinationIndex === sourceIndex) return child
   // get the div of item being dragged
   const draggedItem = child[sourceIndex]

   // remove source
   child.splice(sourceIndex, 1)

   // return updated array by inputting dragged item
   return child.splice(0, destinationIndex, draggedItem)
}
```

Alrighty, so getDraggedElement is returning the placeholder domElement by isolating it by its attribute in the html (if you go to the live site and to tasks/general you can see this queryAttr attached to a div and that div is the invisible placeholder put up by { provided.placeholder }.

```tsx

// updating the array of the placeholder by switching out the source and destination index
const getUpdatedArray = (
   draggedElement: Element,
   event,
   destinationIndex: number,
   sourceIndex: number,
) => {
   // grab children of the node
   const children = [...draggedElement!.parentNode!.children]
   // if the indexes are the same (onDragStart) just return the dom array
   if (destinationIndex === sourceIndex) return children
   // get the div of item being dragged
   const draggedItem = children[sourceIndex]

   // remove source
   children.splice(sourceIndex, 1)

   // return updated array by inputting dragged item
   return children.splice(0, destinationIndex, draggedItem)
}
```

This function rearranges the dom array to determine where to place the placeholder to determine the offset of the placeholder

```tsx
const getStyle = (
   updatedChildrenArray: Element[],
   destinationIndex: number,
   property: string,
   clientDirection: 'clientHeight' | 'clientWidth',
) =>
   updatedChildrenArray.slice(0, destinationIndex).reduce((total, curr) => {
      // get the style object of the item
      const style = window.getComputedStyle(curr)
      // isolate the # of the property desired
      const prop = parseFloat(style[property])
      return total + curr[clientDirection] + prop
   }, 0)
```

So honestly, I am not 100% on what this actually does, I am pretty sure it is 

- getting the width of each object
- getting the margin which we are setting in our style
- getting the summation of it to determine how far from the origin it is

lets say our width is 300px, with 10px on each side so our effective size is 320px

and now lets calculate what the 3rd index position (#4 in the array) by doing

320 * 4 = 1280

so our placeholder is roughly 1280px from the origin (this is not actually how it works but this is the closest my brain can get lmfao)

```tsx
// handle the manipulation of placeholder for row
type RowDropshadowProps = (
   event: any,
   setRowDropshadowProps: React.Dispatch<
      React.SetStateAction<{
         marginTop: number
         height: number
      }>
   >,
   destinationIndex: number,
   sourceIndex: number,
) => void

const handleDropshadowRow: RowDropshadowProps = (event, destinationIndex, sourceIndex) => {
      // isolating the element being dragged
      const draggedElement = getDraggedElement(event.draggableId)
      // if we aint draggin anything return
      if (!draggedElement) return
      // isolate the height of element to determine the height of element being dragged
      const { clientHeight } = draggedElement as Element
      // returning the manipulated array of dom elements
      const updatedChildrenArray: Element[] = getUpdatedChildrenArray(
         draggedElement as Element,
         destinationIndex,
         sourceIndex,
      )
      // grabbing the # for marginTop
      const marginTop = getStyle(
         updatedChildrenArray,
         destinationIndex,
         'marginBottom',
         'clientHeight',
      )
      // setting our props
			// also the + 2 and all that other stuff is just
			// bc i couldnt get it to work so if you wanna see it done right
			// its DragDropContext.tsx in context/taskboard
      setRowDropshadowProps({
         height: clientHeight + 2,
         marginTop: marginTop + 2 * destinationIndex,
      })
   }
```

For the row it is extremely similar as well with a few discrepancies , mainly we aren’t grabbing parent nodes bc we put the draggable on the div itself, not the title

Cool! so now we have everything working, now we just need to actually make our placeholder div.

```tsx
type DropshadowProps = {
   height: number
}

export const Dropshadow = styled.div<DropshadowProps>`
   border-radius: 3px;
   background-color: #ddd;
   width: 302px;
   height: ${({ height }) => height}px;
   z-index: 1;
`

type ColumnDropshadowProps = {
   marginLeft: number
}

export const ColumnDropshadow = styled(Dropshadow)<ColumnDropshadowProps>`
   margin-left: ${({ marginLeft }) => marginLeft - 1}px;
   position: absolute;
`

type RowDropshadowProps = {
   marginTop: number
}

export const RowDropshadow = styled(Dropshadow)<RowDropshadowProps>`
   margin-top: ${({ marginTop }) => `${marginTop}px`};
`
```

so bc our row and column drop shadows are going to be super similar we are going to make a generic Dropshadow component and utilize inheritance 

so notice that we are inputting our height taken from our props on both row and column, but our margin will render out different via marginLeft && marginTop for column and row respectively 

NOW let me give you some future advice that took me an entire day to debug and make me question my entire career and qualifications 

so when I originally did the planning of how drop shadows worked, I obviously used position: absolute; for the dropshadow, and generally when using absolute, your immediate reaction will be utilizing top, bottom, right, left. 

This was my horrible mistake. Little did my tiny peanut monkey brain know, that top, bottom, right, left, only cares about the current viewport / effective size of the container WITHOUT CARING about the ACTUAL size of it (with accounting for scrolling)

so when i was developing the feature, it worked perfectly because my container did not overflow, but the moment i tested for edge cases, dropshadow would be wildly offbase with the scroll offset because my calculations are in relativity to actual size being applied to a div that ONLY cares about viewport


so my next thought was “OK let’s account for the scroll offset and take the difference so our calculations are accurate”

i went through the whole process of making a hook that gathers the scroll offset and fires off EVERY PIXEL SCROLLED returning the offset number that i can subtract, but it was obviously slow so  i needed to throttle it.

now the issue is throttling it too hard will result in a choppy animation, but not throttling it enough will cause heavy memory issues. So i did my if (counter % 2 === 0) and all that jazz until I had epiphany after i shit you not 6 hours of debugging

its supposed to mean over engineering its a stretch i know

“would margin work? if i make the parent container position: absolute; and float that container below the task board could i not do position: absolute; on the div?”

went through that all and messed with z-indexes but manipulating z-indexes gave me issues of when dragging a row, it would appear behind. So after so much time messing with z-indexes i went back to square one: how do i utilize margin and absolute without needing the parent

dont show this to paolo

now, i know you’re asking yourself: “TOBIAS !?! HOW ARE YOU NOT AWARE THAT YOU CAN USE MARGIN ANNNNND ABSOLUTE TOGETHER?!?!??!?! YOU'RE SOOOOO GOOD AT CSS WTFFFF?!??!?!” I know, I know, as a humble man myself (i would never personally call myself humble but it’s just what i have heard and who am i to deny what the people call me), i can accept defeat no matter how much it gave me an existential crisis and crushed my ego

so lets put it all back together and go with my original plan but instead of left we use margin-left and instead of top we use margin-top !!!

so yeah there’s the struggle right there, thanks for reading (((’: 
