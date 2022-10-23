import { action } from "./App"

export default function OperationButton ({dispatch, operation }) {
    return <button 
        onClick={() => dispatch({type: action.choose_operation, payload: { operation } }) }
      >
        {operation}
      </button>
}