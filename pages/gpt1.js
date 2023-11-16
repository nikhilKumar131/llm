import { useState } from "react"
import OpenAI from "openai";
import { api } from "@/AI/openai1";




export default function Home() {


  let [input, setInput] = useState("");
  let [output, setOutput] = useState("");

  const openai = new OpenAI({
    apiKey: api,
    dangerouslyAllowBrowser: true,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
  
    console.log(completion.choices[0]);
  }


  console.log("before main")
  

  function inputHandler() {
    if (input == "") {
      console.log("Add some value");
      setOutput("Add some value");
    }
    else {
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
        <input onChange={(e) => { setInput(e.target.value) }} />
        <button onClick={inputHandler}>Submit</button>
      </div>
      <div className="Output">
        {output}
      </div>
    </div>
  )
}
