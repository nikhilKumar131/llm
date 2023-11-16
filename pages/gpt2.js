import { useState } from "react"
import OpenAI from "openai";
import { api } from "@/AI/openai1";
import dotenv from 'dotenv';

dotenv.config();



export default function Home() {


  // const api = process.env.API;
  // console.log(`key is ${api}`);

  let [input, setInput] = useState("");
  let [output, setOutput] = useState("");
  let [obj, setObj] = useState({
    "transactionType": "not defined",
    "tokenSymbol": "not defined",
    "tokenAmount": 0
  });


  // let obj = {
  //   "transactionType": "not defined",
  //   "tokenSymbol": "not defined",
  //   "tokenAmount": 0
  // }

  const openai = new OpenAI({
    apiKey: api,
    dangerouslyAllowBrowser: true,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'extract data and infer [transactionType(sell/buy), tokenSymbol , tokenAmount]' },
      { role: 'user', content: input }],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0].message.content);
    setObj(completion.choices[0].message.content)
    return completion.choices[0].message.content;
  }



  async function clickHandler() {
    if (input == "") {
      console.log("Add some value");
      setOutput("Add some value");
    }
    else {
      console.log(input);
      let ans = await main();
      console.log(obj);
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
        <button onClick={clickHandler}>Submit</button>
      </div>
      <div className="Output">
        {output}
      </div>
    </div>
  )
}
