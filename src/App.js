
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css"

export const action = {
  add_digit: 'add-digit',
  choose_operation: 'choose-operation',
  clear: 'clear',
  delete_digit: 'delete-digit',
  evaluate: 'evaluate'

}


function reducer(state, {type, payload}){
  switch(type) {
    case action.add_digit:
      if (state.overwrite) {
        return {
          ...state,
          currentcmdop : payload.digit,
          overwrite : false,
        }
      }
      if (payload.digit === "0" && state.currentcmdop === "0") { 
        return state 
      } 
      if (payload.digit === "." && state.currentcmdop.includes(".")) {
       return state
      }
      return {
        ...state,
        currentcmdop: `${state.currentcmdop || ""}${payload.digit}`,

      }
    case action.choose_operation:
      if (state.currentcmdop == null && state.previouscmdop == null ) {
        return state
      }

      if (state.currentcmdop == null) {
        return {

        
        ...state,
        operation: payload.operation,

        }
      }

      if (state.previouscmdop == null ) {
        return {
          ...state,
          operation: payload.operation,
          previouscmdop: state.currentcmdop,
          currentcmdop: null, 
        }
      }

      return {
        ...state,
        previouscmdop: evaluate(state),
        operation: payload.operation,
        currentcmdop: null

      }


    case action.clear:
      return {}
    case action.delete_digit:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentcmdop: null


        }

      }
      if (state.currentcmdop == null ) return state
      if (state.currentcmdop.length === 1) {
        return { ...state, currentcmdop : null}
      }

      return {
        ...state,
        currentcmdop : state.currentcmdop.slice(0, -1)
      }
    case action.evaluate:
      if (state.operation == null || state.currentcmdop == null || state.previouscmdop == null ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previouscmdop: null,
        operation: null,
        currentcmdop : evaluate(state),
      }
  }
}

function evaluate ( { currentcmdop, previouscmdop, operation}) {
  const prev = parseFloat(previouscmdop)
  const current = parseFloat (currentcmdop)
  if (isNaN(prev) || isNaN (current))  return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current 
      break
    case "-":
      computation = prev - current
      break 
    case "*":
      computation = prev * current
      break 
    case "/":
      computation = prev / current
      break 
  }
  return computation.toString()
}


const integer_formatter = new Intl.NumberFormat ("en-us", {
  maximumFractionDigits: 0,

})

function formatcmd(cmd) {
  if (cmd = null) return 
  const [integer, decimal] = cmd.split(".")
  if (decimal == null) return integer_formatter.format(integer)
  return `${integer_formatter.format(integer)}.${decimal}`
}

function App() {
  const [{currentcmdop, previouscmdop, operation}, dispatch] = useReducer(reducer,{})
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previouscmd">
          {formatcmd(previouscmdop)} {operation}
          </div>
        <div className="currentcmd">
          {formatcmd(currentcmdop)}
          </div>
      </div>
      <button className="span-two" 
      onClick={() => dispatch({type : action.clear}) }
      >
        AC
      </button>
      <button onClick={() => dispatch({type : action.delete_digit}) }>DEL</button>
      <OperationButton operation= "/" dispatch={dispatch} />
      <DigitButton digit= "1" dispatch={dispatch} />
      <DigitButton digit= "2" dispatch={dispatch} />
      <DigitButton digit= "3" dispatch={dispatch} />
      <OperationButton operation= "*" dispatch={dispatch} />
      <DigitButton digit= "4" dispatch={dispatch} />
      <DigitButton digit= "5" dispatch={dispatch} />
      <DigitButton digit= "6" dispatch={dispatch} />
      <OperationButton operation= "+" dispatch={dispatch} />
      <DigitButton digit= "7" dispatch={dispatch} />
      <DigitButton digit= "8" dispatch={dispatch} />
      <DigitButton digit= "9" dispatch={dispatch} />
      <OperationButton operation= "-" dispatch={dispatch} />
      <DigitButton digit= "." dispatch={dispatch} />
      <DigitButton digit= "0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type : action.evaluate}) }>=</button>
    </div>
  )
}

export default App;
