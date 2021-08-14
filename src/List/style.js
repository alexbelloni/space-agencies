import styled from 'styled-components'

export const Container = styled.div`
display: flex;
flex-direction: column;
padding: 0 10px;

@media (min-width: 768px){
    width: 700px
  }
`

export const Agency = styled.div`
display: flex;
flex-direction: column;
width: 100%;
cursor: pointer;
`