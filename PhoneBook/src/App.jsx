import axios from 'axios'
import { useEffect, useState } from 'react'
import personService from "./services/person"
import "./styles/app.css"
const Filter = ({value,onChange,onCheck,foundPerson}) => {
  
  return(<>
            <p>filter shown with <input value={value} onChange={onChange} /></p>
          <button onClick={onCheck}>Check</button>

        {foundPerson && (
          <p>
            Found: {foundPerson.name} {foundPerson.number}
          </p>
        )}
  </>)
}

const AddPersonForm =({onSubmit,newName,newNumber,setNewName,setNumber}) => {
  return(
    <>
          <h3>Add a new</h3>
      <form onSubmit={onSubmit}>
        <div>
          Name: <input value={newName} onChange={(event)=> setNewName( event.target.value)}/>
        </div>
        <div>
          Number: <input value={newNumber} type='tel' onChange={(event)=> setNumber( event.target.value)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form >
    </>
  )
}

const NumberList = ({persons,deleteBtn}) => (
  <>
        <h3>Numbers</h3>
      {persons.length < 0 ? 
      <>...</> 
    :persons.map((person)=>
    <div key={person.id}>
    <div>{person.name}  {person.number} 
    <button onClick={()=> deleteBtn(person.id)}>delete</button> </div>
  
      </div>) } 
  </>
)
const Notification = ({message}) => {
  if(message === null){
    return null
  }
  return(
    <div className='error'>
      {message}
    </div>

  )

}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [checkValue,setCheckValue] = useState('')
  const [foundPerson, setFoundPerson] = useState(null)
  const [msg,setMsg] = useState("Error Happened Here")
  const [show, setShow] = useState(false)

  const deleteBtn = (id) =>{
  const person = persons.find(p => p.id === id);
    if(window.confirm('delete this number')){
      axios.delete(`http://localhost:3001/persons/${id}`)
      .then(()=> {
        setPersons(persons.filter(p => p.id !== id))
        setMsg(`${person.name} is deleted`)
        setShow(true)
        setTimeout(() => setShow(false), 3000)
      })
      .catch(err => {
        setMsg(`The person ${person.name} was not found Error Message: ${err}`);
        setPersons(persons.filter(p => p.id !== id));
        setShow(true)
        setTimeout(() => setShow(false), 3000)
      });
    }else{
      alert('Cancelled')
    }


  }
  useEffect(()=>{
    personService
    .getAll()
    .then(response => {
      setPersons(response.data)

    })
    },[])
  

  const handleCheckBtn = () => {
  const person = persons.find(person => person.name === checkValue)
    setFoundPerson(person || null)
  }

  if(!Number.isInteger(Number(newNumber))){
      alert("Not a Number")
      return
    }
  


  const addName = (event) => {
    event.preventDefault()


    if(persons.some(person => person.name === newName)){
      alert(newName + " is already Added")
      return
    }

    const nameObject = {
      name: newName,
      number:newNumber,

    }
    personService
    .create(nameObject)
    .then(response => {
    setPersons(persons.concat(response.data))
    setMsg(`New Person Added: ${nameObject.name}`)
    setShow(true)
    setTimeout(() => setShow(false), 3000)
    setNewName('')
    setNumber('')
  })
  }


  return (
    <div>
      <h2>Phonebook</h2>
      {show? <Notification message={msg}/> : null}
        <Filter
        value={checkValue}
        onChange={e => setCheckValue(e.target.value)}
        onCheck={handleCheckBtn}
        foundPerson={foundPerson}
        />

      <AddPersonForm
      onSubmit={addName}
      setNewName={setNewName}
      setNumber={setNumber}
      newName={newName}
      newNumber={newNumber}
      />

      <NumberList
      persons={persons}
      deleteBtn={deleteBtn}
      />
    </div>
  )
}

export default App