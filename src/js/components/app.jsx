import React from 'react';
import TextField from '@material-ui/core/TextField';

const inputHandler = (cb, e) => cb(e.currentTarget.value);
const form = (fields, handler) => Object.keys(fields).map(
    k => <div key={k}><label>{k}</label><input type="text" value={fields[k]} onChange={inputHandler.bind(this, handler.bind(this, k))} /></div>
    );

export default ({ ...props, ...handlers }) => (
      <div className="main-container">
         <h1>Send some funds without fear of losing them!</h1>
         <div className="block">
            <div>
            Your Address: {props.connectedAddr}
            </div>
            <div className="form">
                {form(props.formData, handlers.updateField)}
            </div>
         </div>
         <input type="button" value="Create Transaction" onClick={handlers.submitTrx.bind(this, props.formData.recipientAddr, props.formData.amount)}/>
     </div>)
