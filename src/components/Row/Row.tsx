import React from 'react'
import styled from 'styled-components'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'
import { TaskType } from '../../assets'

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 26px;
   width: 100%;
   box-sizing: border-box;
   padding: 5px 10px;
   border: 1px solid #333;
   border-radius: 4px;
   font-size: 14px;
   margin-bottom: 10px;
`

type Props = {
   task: TaskType
   index: number
}

const Row: React.FC<Props> = ({ task, index }) => (
   <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
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
