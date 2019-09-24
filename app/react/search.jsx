import React from "react";
import {render} from 'react-dom';

const SearchList = (props) => <div>Hey you! {props.request}!</div>;


class Search extends React.Component {
    state = {
        request: "",
    };

    onRequest = event =>
        this.setState({
            request: event.target.value
        });

    render = () => (
        <div>
            <input type="text" name="search" onChange={this.onRequest} />

            <SearchList request={this.state.request} />
        </div>
    )
};

render(<Search/>, document.getElementById('search_form'));