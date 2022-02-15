import styled from 'styled-components'
import { Dropshadow } from '../Board/Board.styled'

export const Container = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   flex-direction: column;
   height: auto;
   box-sizing: border-box;
   padding: 5px;
   border: 1px solid;
   border-radius: 4px;
   margin-right: 20px;
   min-width: 150px;
   max-width: 150px;
`

export const TitleContainer = styled.div`
   width: 100%;
   height: auto;
   border-bottom: 1px solid #333;
   margin-bottom: 10px;
`

export const Title = styled.h1`
   font-size: 14px;
   margin: 5px;
`

export const RowContainer = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   flex-direction: column;
   position: relative;
   width: 100%;
   height: 100%;
   border: 1px solid;
`

type RowDropshadowProps = {
   marginTop: number
}

export const RowDropshadow = styled(Dropshadow)<RowDropshadowProps>`
   top: ${({ marginTop }) => {
      console.log(marginTop)
      return `${marginTop}px`
   }};
`

export const DropshadowContainer = styled(Container)`
   width: auto;
   position: absolute;
   border: none;
`
