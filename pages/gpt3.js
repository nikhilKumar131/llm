  //problem that happen here is request price limit
  //

  import { useState } from "react"
  import OpenAI from "openai";
  import { api } from "@/AI/openai1";
  import dotenv from 'dotenv';
  
  
  
  
  export default function Home() {
  
  
    // const api = process.env.API;
    // console.log(`key is ${api}`);
  
    let [input, setInput] = useState("");
    let [output, setOutput] = useState("");
    let obj = {
      transactionType: "not defined",
      tokenSymbol: "not defined",
      tokenAmount: 0
    };
  
  
  
    const openai = new OpenAI({
      apiKey: api,
      dangerouslyAllowBrowser: true,
    });
  
    async function main() {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'from the given text find the transaction type considered here, output: "Buy"/"Sell"' },
        { role: 'user', content: input }],
        model: "gpt-3.5-turbo",
      });
  
      const completion2 = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'find the token or cypto that is being talked about here to sell or buy, output: Token Symbol' },
        { role: 'user', content: input }],
        model: "gpt-3.5-turbo",
      });
  
      const completion3 = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'find the amount of token or cypto that is being talked about here to sell or buy, output: (amt in integer)' },
        { role: 'user', content: input }],
        model: "gpt-3.5-turbo",
      });
  
  
  
  
      console.log(completion.choices[0].message.content);
      console.log(completion2.choices[0].message.content);
      console.log(completion3.choices[0].message.content);
  
      obj.transactionType = (completion.choices[0].message.content);
      obj.tokenSymbol = (completion2.choices[0].message.content);
      obj.tokenAmount = (completion3.choices[0].message.content);
  
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
  