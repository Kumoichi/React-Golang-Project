import React from 'react'
// import "./App.css";
import {Container} from "semantic-ui-react";
import ToDoList from "./To-Do-List";

const App = () => {
  return (
    <div>
      <Container>
        <ToDoList></ToDoList>
      </Container>
    </div>
  )
}

export default App