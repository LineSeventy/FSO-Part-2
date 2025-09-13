import { useState } from 'react'

const Course = (props) => {

const total = props.course.parts.reduce((result, item) => result + item.exercises, 0)
  return (
    <>
      <h2>{props.course.name}</h2>
      {props.course.parts.map((part) => (
        <li key={part.id}>
          {part.name} {part.exercises}
        </li>
      ))}

     <strong>Total of {total} exercises</strong>
    </>
  )
}



const App = () => {
const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <>
    <h1>Web Development Curriculum </h1>
      {courses.map(course => (
        <Course key={course.id} course={course} />
      ))}
    </>
  )
}

export default App


