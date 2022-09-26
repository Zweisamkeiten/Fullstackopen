// vim: set ft=javascriptreact :

import { useState } from "react";

const App = () => {
  const [persons, setpersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setnewName] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    console.log(event.target.value);

    // 防止用户能够添加已经存在于电话簿中的名字
    const names = persons.map((person) => person.name);
    if (names.includes(newName)) {
      window.alert(`${newName} is already added to phonebook`);
      return;
    }

    const person = {
      name: newName,
    };

    setpersons(persons.concat(person));
    setnewName("");
  };

  const handleNameChange = (event) => {
    setnewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map((person) => (
          <p key={person.name}>{person.name}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
