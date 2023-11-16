import { useState } from "react"


export default function Home() {

  console.log(`api is ${process.env.API}`);

  let [input,setInput] = useState("");
  let [output, setOutput] = useState("");

  function inputHandler(){
    if(input == ""){
      console.log("Add some value");
      setOutput("Add some value");
    }
    else{
      console.log(input);
      setOutput(input);
    }
  }
  
  return (
    <div>
      <div className="Info">
        Info
      </div>
      <div>
        <input onChange={(e) =>{setInput(e.target.value)}}/>
        <button onClick={inputHandler}>Submit</button>
      </div>
      <div className="Output">
        {output}
      </div>
    </div>
  )
}
