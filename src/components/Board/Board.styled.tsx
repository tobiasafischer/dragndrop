import styled from 'styled-components'

export const Container = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: flex-start;
   width: 100%;
   height: auto;
   border: 1px solid;
   box-sizing: border-box;
   padding: 20px 25px;
   position: relative;
   overflow-x: scroll;
`

type Props = {
   height: number
}

export const Dropshadow = styled.div<Props>`
   border-radius: 3px;
   position: absolute;
   background-color: #ddd;
   height: ${({ height }) => height}px;
   width: 150px;
   z-index: 1;
`

type ColumnDropshadowProps = {
   marginLeft: number
}

export const ColumnDropshadow = styled(Dropshadow)<ColumnDropshadowProps>`
   top: 20px;
   margin-left: ${({ marginLeft }) => marginLeft}px;
`
