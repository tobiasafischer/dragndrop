# Drag and Drop !!

## Why are you writing documentation? Don’t they have some?

Documentation for react-beautiful-dnd, also known as rbdnd, is indeed available and can be found here. However, it is important to note that some developers may find the syntax of this library to be complex and unintuitive. It is worth mentioning that a significant portion of the online examples are implemented using traditional React practices that may not adhere to recommended coding standards. Consequently, it is advisable to exercise caution when referring to such examples. Despite the library no longer being actively maintained, it remains a reliable and versatile solution.

## Okay, what variables am I working with?

Now, in the context of react-beautiful-dnd and similar React libraries, the use of [context](https://reactjs.org/docs/context.html) is a common pattern. Within rbdnd, it is customary to encapsulate the top-level component responsible for drag and drop functionality with a specific context wrapper.

```tsx
<DragDropContext />
```

The onDragEnd function within the drag and drop context plays a significant role and offers extensive capabilities. However, for the purpose of this case, we will focus specifically on the onDragEnd function, which provides a result object.

The onDragEnd function might initially appear overwhelming, but fear not, as we will concentrate primarily on two key properties: source and destination, which will be discussed in more detail later on. It is helpful to conceptualize onDragEnd as analogous to the onSubmit function of a form, triggering the execution of the associated logic upon completion of the drag and drop action.

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

Our next variable is

```tsx
<Droppable />
```

Droppable serves as a container that enables the placement of a draggable item. While it possesses multiple properties, our primary focus lies on the essential ones, namely droppableId, direction, and type. As demonstrated in the aforementioned output, the "droppableId" identifier frequently appears, thus warranting familiarity with it. Essentially, this identifier allows us to determine the specific element into which we are dropping our draggable item, facilitating appropriate manipulation of the corresponding array. In scenarios where a single droppable area suffices (owing to the presence of only one possible target), hardcoding the droppableId is a viable option. However, when dealing with dynamic lists, it is advisable to employ a custom identifier (such as uuid, as illustrated in this instance) to differentiate the individual child elements, akin to using a key.

For a more abstract perspective, one can liken Droppable to a container that accommodates draggable children.

(If you require the specific properties)

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

Now for the real meat of the library:

```tsx
<Draggable />
```

Draggable refers to the component that is affixed to the designated container, allowing it to be dragged into the droppable regions. The draggableId syntax, resembling a universally unique identifier (UUID) or any other distinctive identifier for dynamically generated draggables, plays a crucial role. Alternatively, for singular draggable elements like droppable, any desired identifier can be chosen. Additionally, an index parameter is utilized to ascertain the object's position during the array mapping process.

```tsx
{
	arr.map(({ content, id }, idx) => (
		<Component key={id} id={id} idx={idx}>
			{item}
		</Component>
	));
}
```

(If you require the specific properties)

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

In addition to the Draggables and Droppables, this library introduces the notable entities known as provided and snapshot. As I assume that this syntax may be unfamiliar to you, kindly allow me to provide an explanation.

Following the declaration of any Droppable or Draggable component, it is necessary to include a function that encapsulates the variables of the provided and snapshot objects. These objects play a pivotal role in distributing props to the JSX elements and serve as the core functionality of this library.

Although their syntax is strikingly similar, it is important to note that there exist two distinct entities: DroppableProvided and DraggableProvided. Despite their shared input, a few discrepancies set them apart.

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

Now, let us delve into the functionality of Droppable. Within Droppable, you will encounter the provided object, which includes the following properties: innerRef, droppableProps, and placeholder (which will be further discussed later). To provide a brief overview of these props:

| innerRef       | A reference object that is applied to the container, enabling the div to be a drop target. |
| -------------- | ------------------------------------------------------------------------------------------ |
| droppableProps | The set of functionalities associated with the droppable nature of the div.                |
| placeholder    | A div element that acts as a placeholder for the object being dragged.                     |

Okay! Here is the code we will be working with:
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

The initial impression may appear perplexing and overwhelming due to the complex nature of the topic at hand. However, by breaking it down into distinct sections, one can gradually assemble a comprehensive understanding of the subject matter. With this approach in mind, let us now delve into the implementation of the draggable functionality by examining the Column component, as illustrated in the aforementioned code snippet.

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

Excellent! You have successfully implemented your initial drag and drop functionality for the columns, allowing them to be dragged from left to right and vice versa. Now, let's take a moment to enhance the interaction by introducing rows.

Honestly, implementing rows follows the exact same process as columns, but in fact, it is even easier. Trust me on this, and you'll see how straightforward it is.

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
						too)
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

Now that we have expanded our understanding significantly, let us further enrich our knowledge by exploring the underlying logic of our code, which will enable us to effectively persist our dragging operations.

To begin, let's revisit the familiar concept we previously discussed, the DragDropContext, and more specifically, the onDragEnd event. Prepare yourself, as we are about to dive deep into this essential aspect of our implementation.

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
  // if there is no destination, theres nothing to manipulate so lets exit
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

Impressive progress thus far, wouldn't you agree? I appreciate your continued engagement, as we are now about to embark on an exciting phase of our implementation.

Firstly, let's focus on the handleColumnMove function, which marks the beginning of our exciting journey. Additionally, allow me to provide you with an overview of the props we will be working with in this context.

```tsx
// this is for task board so task and row are interchangable
export type TaskType = {
	content: string;
	id: any;
};

export type TaskColumnType = {
	id: any;
	title: string;
	rows: TaskType[];
};

export type TaskBoardType = {
	title: string;
	columns: TaskColumnType[];
};

type Props = (
	// this is just setState
	setColumns: React.Dispatch<React.SetStateAction<TaskColumnType[]>>,
	source: DraggableLocation, // { draggableId, index }
	destination: DraggableLocation, // { draggableId, index }
) => void;
```

handleColumnMove

```tsx
type TaskBoardType = {
	title: string;
	columns: TaskColumnType[];
};
// our column state is just Columns ^

const handleColumnMove: DragDropProps = (source, destination) =>
	// rememeber that source and dest are just { draggableId, index }
	// moving columns (:
	setColumns((prev) => {
		// this is some computer science stuff with mutability go ask justin lol
		const updated = [...prev];
		// remove source column
		const [removed] = updated.splice(source.index, 1);
		// insert source column at new destination
		updated.splice(destination.index, 0, removed);
		return updated;
	});
```

The preceding steps have proven to be relatively straightforward, wouldn't you agree? However, it is now time to confront a more challenging aspect of our implementation.

When it comes to handling rows, we must consider two distinct conditions. Firstly, we need to address the movement of rows within the same column. Secondly, we must account for the scenario where rows are being moved between columns. These conditions require careful consideration and appropriate handling to ensure the smooth operation of our drag and drop functionality.

```tsx
// determining if its diff col or same col for row movement
const handleRowMove: DragDropProps = (source, destination) => {
	// droppableId is in reference to what column it is so if they are the same,
	// then both droppableId's are the same,
	// if its diff columns then they not the same
	// btw since columns are dynamically instantiated, the droppableId i used is uuid

	if (source.droppableId !== destination.droppableId) {
		moveRowDifferentColumn(source, destination);
	} else {
		moveRowSameColumn(source, destination);
	}
};
```

```tsx
// props are the same ^^
export const moveRowDifferentColumn: Props = (setColumns, source, destination) => {
	// moving rows between columns
	setColumns((prev) => {
		const updated = [...prev];
		// filter out which column is the source and which is the destination
		const [sourceColumn] = updated.filter(({ id }) => id === source.droppableId);
		const [destinationColumn] = updated.filter(({ id }) => id === destination.droppableId);

		// extract the rows from the columnn
		const sourceRow = sourceColumn.rows;
		const destinationRow = destinationColumn.rows;

		// remove the source item
		const [removed] = sourceRow.splice(source.index, 1);
		// insert the source item at the new index
		destinationRow.splice(destination.index, 0, removed);

		return updated;
	});
};
```

```tsx
// same props ^^
export const moveRowSameColumn: Props = (setColumns, source, destination) => {
	// moving rows in same column
	setColumns((prev) => {
		const updated = [...prev];
		// isolate the row of the column we want to adjust
		const [{ rows }] = updated.filter(({ id }) => id === source.droppableId);
		// remove the source item
		const [removed] = rows.splice(source.index, 1);
		// insert the source item at the new index
		rows.splice(destination.index, 0, removed);
		return updated;
	});
};
```

### Your utmost attention is requested as we delve into a crucial topic: custom placeholders.

Consider a scenario in which your specific project necessitates the use of a custom placeholder to visually represent the droppable area for the item being dragged. It is worth noting that while this library may not inherently support this customization, but it is possible with a little bit of hacking.

Now, let us revisit the onDragEnd prop we previously discussed within the DragDropContext and allow me to introduce you to its counterparts: onDragStart and onDragUpdate.

While onDragEnd triggers upon the release of the drag operation, onDragStart is invoked at the onset of dragging, and onDragUpdate is triggered whenever the dragged item interacts with another element.

This marks an updated state of our DragDropContext and the associated state variables, which will be pivotal in our continued exploration.

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
	draggableId: 'd38b1d78-4f5e-47dd-b939-74e1a95ac761';
	type: 'row';
	source: {
		droppableId: '53405e67-3c88-42a7-8ca7-a51ef5923726';
		index: 0;
	}
	mode: 'FLUID';
}

// column event
{
	draggableId: '53405e67-3c88-42a7-8ca7-a51ef5923726';
	type: 'column';
	source: {
		droppableId: 'all-columns';
		index: 0;
	}
	mode: 'FLUID';
}
```

Again, with this type of stuff 90% of it is useless so all we actually care about is “type” and “source”, specifically index

Then our onDragStart function will execute as such:

```tsx
const handleDragStart = (event) => {
	// the destination and source colIndex will be the same for start
	const { index } = event.source;
	if (event.type === 'column') {
		handleDropshadowColumn(event, index, index);
	} else {
		handleDropshadowRow(event, index, index);
	}
};
```

Not too bad right? Before we jump into the logic of the placeholder, lets get onDragUpdate out of the way because they are quite similar

like discussed above, onDragUpdate is triggered once a draggable item is moved (repositioning)

```tsx
const handleDragUpdate = (event) => {
	const { source, destination } = event;
	if (!destination) return;
	if (event.type === 'column') {
		handleDropshadowColumn(event, destination.index, source.index);
	} else {
		handleDropshadowRow(event, destination.index, source.index);
	}
};
```

Cool! so as you can see they are pretty similar because ultimately they serve the same function, just two different edge cases

Now let’s dig into the meat of the problem starting with column

```tsx
// handle the manipulation of placeholder for column
type ColumnDropshadowProps = (
	event: any,
	setColDropshadowProps: React.Dispatch<
		React.SetStateAction<{
			marginLeft: number;
			height: number;
		}>
	>,
	destinationIndex: number,
	sourceIndex: number,
) => void;

const handleDropshadowColumn: ColumnDropshadowProps = (event, destinationIndex, sourceIndex) => {
	// isolate element we are dragging
	const draggedElement: Element | Node | null = getDraggedElement(event.draggableId)!.parentNode!
		.parentNode;
	// if nothing is being dragged return
	if (!draggedElement) return;
	// isolate the height of element to determine the height of element being dragged
	const { clientHeight } = draggedElement as Element;
	// returning the manipulated array of dom elements
	const updatedChildrenArray: Element[] = getUpdatedChildrenArray(
		draggedElement as Element,
		destinationIndex,
		sourceIndex,
	);
	// grabbing the # for marginLeft
	const marginLeft = getStyle(updatedChildrenArray, destinationIndex, 'marginRight', 'clientWidth');
	// setting props
	setColDropshadowProps({
		height: clientHeight,
		marginLeft,
	});
};
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

Alrighty, so getDraggedElement is returning the placeholder domElement by isolating it by its attribute in the html

```tsx
// updating the array of the placeholder by switching out the source and destination index
const getUpdatedArray = (
	draggedElement: Element,
	event,
	destinationIndex: number,
	sourceIndex: number,
) => {
	// grab children of the node
	const children = [...draggedElement!.parentNode!.children];
	// if the indexes are the same (onDragStart) just return the dom array
	if (destinationIndex === sourceIndex) return children;
	// get the div of item being dragged
	const draggedItem = children[sourceIndex];

	// remove source
	children.splice(sourceIndex, 1);

	// return updated array by inputting dragged item
	return children.splice(0, destinationIndex, draggedItem);
};
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
		const style = window.getComputedStyle(curr);
		// isolate the # of the property desired
		const prop = parseFloat(style[property]);
		return total + curr[clientDirection] + prop;
	}, 0);
```

To be frank, I do not possess complete certainty regarding the precise functionality of this code snippet. However, based on my understanding, it appears to involve the following steps:

-Acquiring the width measurement of each object.
-Retrieving the margin value specified within the associated style.
-Calculating the cumulative sum of the widths and margins to determine the offset from the origin.
-Allow me to provide an illustrative example. Suppose we have an object with a width of 300px, accompanied by a 10px margin on each side, resulting in an effective width of 320px.

To determine the position of the object at the 3rd index (4th in the array), we can perform the following calculation:

320px \* 4 = 1280px

Hence, the placeholder is approximately 1280px away from the origin. It is important to note that while this example is provided for explanatory purposes, it may not accurately represent the precise inner workings of the code. Please bear in mind that this explanation reflects the extent of my understanding.

```tsx
// handle the manipulation of placeholder for row
type RowDropshadowProps = (
	event: any,
	setRowDropshadowProps: React.Dispatch<
		React.SetStateAction<{
			marginTop: number;
			height: number;
		}>
	>,
	destinationIndex: number,
	sourceIndex: number,
) => void;

const handleDropshadowRow: RowDropshadowProps = (event, destinationIndex, sourceIndex) => {
	// isolating the element being dragged
	const draggedElement = getDraggedElement(event.draggableId);
	// if we aint draggin anything return
	if (!draggedElement) return;
	// isolate the height of element to determine the height of element being dragged
	const { clientHeight } = draggedElement as Element;
	// returning the manipulated array of dom elements
	const updatedChildrenArray: Element[] = getUpdatedChildrenArray(
		draggedElement as Element,
		destinationIndex,
		sourceIndex,
	);
	// grabbing the # for marginTop
	const marginTop = getStyle(
		updatedChildrenArray,
		destinationIndex,
		'marginBottom',
		'clientHeight',
	);

	setRowDropshadowProps({
		height: clientHeight + 2,
		marginTop: marginTop + 2 * destinationIndex,
	});
};
```

For the row it is extremely similar as well with a few discrepancies, mainly we aren’t grabbing parent nodes bc we put the draggable on the div itself, not the title

Cool! so now we have everything working, now we just need to actually make our placeholder div.

```tsx
type DropshadowProps = {
	height: number;
};

export const Dropshadow = styled.div<DropshadowProps>`
	border-radius: 3px;
	background-color: #ddd;
	width: 302px;
	height: ${({ height }) => height}px;
	z-index: 1;
`;

type ColumnDropshadowProps = {
	marginLeft: number;
};

export const ColumnDropshadow = styled(Dropshadow)<ColumnDropshadowProps>`
	margin-left: ${({ marginLeft }) => marginLeft - 1}px;
	position: absolute;
`;

type RowDropshadowProps = {
	marginTop: number;
};

export const RowDropshadow = styled(Dropshadow)<RowDropshadowProps>`
	margin-top: ${({ marginTop }) => `${marginTop}px`};
`;
```

In order to streamline the implementation of drop shadows for both row and column components, we will create a generic Dropshadow component and leverage inheritance. It is worth noting that while the height value is retrieved from the props for both rows and columns, the margin will be rendered differently using marginLeft for columns and marginTop for rows.

Now, allow me to offer some valuable advice based on my previous experience, which involved an entire day of debugging and questioning my professional qualifications.

During the initial planning phase of drop shadow functionality, I utilized position: absolute for the drop shadow element. As is often the case when working with absolute positioning, my instinct was to employ top, bottom, right, and left properties. However, I made a critical mistake. I failed to recognize that top, bottom, right, and left properties are determined solely based on the viewport or the effective size of the container, without taking into account the actual size (including scrollable content).

Initially, everything appeared to be functioning perfectly since my container did not overflow. However, upon testing for edge cases, I discovered that the drop shadow was significantly misaligned due to the scroll offset. To rectify this issue, my initial solution involved accounting for the scroll offset by calculating the difference and adjusting my calculations accordingly. To accomplish this, I created a hook that constantly monitored the scroll offset, firing an event for every pixel scrolled. However, this approach proved to be slow and necessitated throttling.

Finding the optimal balance between a smooth animation and memory efficiency became a daunting task. After numerous attempts, including implementing a counter-based throttling mechanism, I finally had an epiphany after six hours of relentless debugging.

In a moment of inspiration, I questioned whether utilizing margin would provide a viable solution. I pondered if positioning the parent container as absolute and placing it below the task board would allow me to use absolute positioning on the div itself. Despite exploring this approach, experimenting with z-indexes, and adjusting the layout, I encountered issues where dragging a row caused it to appear behind other elements. After extensively manipulating z-indexes and revisiting various techniques, I realized that I needed to return to square one: how to effectively combine margin and absolute positioning without relying on a parent container.

I must admit that I was initially unaware of the seamless integration of margin and absolute positioning. It took a significant amount of time and self-reflection, as well as a blow to my ego and an existential crisis, to come to this realization. However, as a humble individual (although I would not ordinarily label myself as such, it is what others have described me as /s), I can accept defeat and acknowledge my growth from this experience.

In conclusion, let us reintegrate all the elements and adhere to the original plan. Instead of using left, we will utilize margin-left, and instead of top, we will employ margin-top.

I appreciate your patience in reading through this account of my struggle. Thank you.
