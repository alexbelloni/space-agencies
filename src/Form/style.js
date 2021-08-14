import styled from 'styled-components'

export const Container = styled.div`
display: flex;
flex-direction: column;
padding: 0 10px;

@media (min-width: 768px){
  width: 700px
}
`
export const Form = styled.form`
h2 {
    color: white;
}
& > *{
    margin: 3px 0;
}
`
export const Input = styled.input`
    width: 100%;
    background-color: white;
    color: black;
    padding: 5px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-style: italic;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
`
export const Button = styled.button`
    font-family: "Overpass",sans-serif;
    display: inline-block;
    background: #EAFE07;
    padding: 0.75rem 1.75rem;
    border: 2px solid #EAFE07;
    color: #000;
    border-radius: 5px;
    font-weight: 700;
    font-size: 1.2rem;
    text-align: center;
    cursor: pointer;
    -webkit-transition: background-color 200ms ease-in-out,color 200ms ease-in-out,border-color 200ms ease-in-out;
    transition: background-color 200ms ease-in-out,color 200ms ease-in-out,border-color 200ms ease-in-out;
    -webkit-font-smoothing: antialiased;
`