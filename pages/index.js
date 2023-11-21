  //problem that happen here is request price limit
  //

import { useState } from "react"
import OpenAI from "openai";
import { api } from "@/AI/openai1";




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
    apiKey: ,
    dangerouslyAllowBrowser: true,
  });

  async function main() {

    console.log(obj.transactionType)

    const completion = await openai.chat.completions.create({
      messages: [
        // {
        //   role: "system",
        //   content: "You are a helpful assistant designed to output JSON in crypto transactions.",
        // },
        {
          role: "system",
          content: "You are a helpful assistant. When the user describes a crypto transaction, extract and format the details as a JSON object. Ensure to correctly identify the transaction type (buy or sell), the token symbol, and the transaction amount."
        },
        // { role: "user", content: "understand the question and fill this on your own: {transactionType: buy/sell, tokenSymbol: {token we are trying to transact}, tokenAmount: {amount of transaction} }" },
        { role: "user", content: `I will describe a crypto transaction. Please fill in the details in this format: {transactionType: 'buy' or 'sell', tokenSymbol: 'The token's symbol', tokenAmount: 'The amount of the transaction'}. transaction: ${input}.` },

      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });
    console.log(JSON.parse(completion.choices[0].message.content));

    obj = JSON.parse(completion.choices[0].message.content);

    return obj;
  }


  async function clickHandler() {
    if (input == "") {
      console.log("Add some value");
      setOutput("Add some value");
    }
    else {
      console.log(input);
      let ans = await main();
      console.log(`object is ${obj}`);
      setOutput(input);
      errorCheck()
      console.log(obj.tokenSymbol)
    }
  }

  const cryptoCurrencies = ["BTC", "ETH", "BNB", "ADA", "SOL", "XRP", "DOT", "DOGE", "SHIB", "LTC", "LINK", "UNI", "AVAX", "LUNA", "MATIC", "XLM", "VET", "FIL", "TRX", "XTZ", "ATOM"];

  const errorCheck = () => {
    if (obj.transactionType.toLowerCase() === "buy" || obj.transactionType.toLowerCase() === "sell"){
      if (cryptoCurrencies.includes(obj.tokenSymbol) === true){
        if (typeof obj.tokenAmount == "number" || "float"){
          console.log("all clear")
        }
        else{
          console.log("error: amount")
          return "add a different prompt, errors in this one, unable to find amount";}
      }
      else{ 
        console.log("error: token symbol")
        return "add a different prompt, errors in this one, unable to find token symbol"}
    }
    else{
      console.log("error: transaction type")
      return "add a different prompt, errors in this one, unable to find transaction type"
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
