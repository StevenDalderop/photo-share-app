import React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';

type myProps = {
    path: string, 
    logged_in: boolean, 
    children: React.ReactNode
};

class PrivateRoute extends React.Component<myProps> {
    constructor(props : myProps) {
        super(props);
    }

    render() {
        return (
            <Route path={this.props.path} render={                
                (props : RouteComponentProps) => {
                    if (!this.props.logged_in) {
                        return <Redirect to="/login" />;
                    }
                    return React.cloneElement(this.props.children as React.ReactElement<any>, 
                        {history: props.history,  match: props.match, location: props.location});              
                }
            }/>
        );
    }
}

export default PrivateRoute;
