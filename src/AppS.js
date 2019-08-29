
import './divtable.css';
 
import React from 'react';
import Amplify, { graphqlOperation }  from "aws-amplify";
import Auth from 'aws-amplify';
import { Connect, SignOut, withAuthenticator } from "aws-amplify-react";
 
import * as queries from './graphql/queries';
import * as subscriptions from './graphql/subscriptions';
 
import aws_config from "./aws-exports";
Amplify.configure(aws_config);
Auth.configure(aws_config);

class App extends React.Component {
  render() {
    return (
      <Connect
        query={graphqlOperation(queries.listTodos)}
        subscription={graphqlOperation(subscriptions.onCreateTodo)}
        onSubscriptionMsg={(prev, { onCreateTodo }) => {
          console.log ( onCreateTodo );
          (prev.listTodos.items).push(onCreateTodo);
        return prev;
      }}>
       
      {({ data: { listTodos }, loading, error }) => {
        if (error) return (<h3>Error</h3>);
        if (loading || !listTodos) return (<h3>Loading...</h3>);
       
        listTodos.items.sort();
        return(
          <div className="divTable redTable">
            <div className="divTableHeading">
              <div className="divTableRow">
                <div className="divTableHead">Todo</div>
                  <div className="divTableHead">ID</div>
                </div>
              </div>
            <div className="divTableBody">
       
              {listTodos.items.map(todo =>
              <div className="divTableRow" key={todo.id}>
              <div className="divTableCell">{todo.name}</div>
              <div className="divTableCell">{todo.id}</div>
            </div>
            )}
       
          </div>
        </div>
        );
      }}
      </Connect>
    );
  }
}

export default withAuthenticator(App, {includeGreetings:true} );