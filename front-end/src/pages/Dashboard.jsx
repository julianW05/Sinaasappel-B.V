import React, {Component} from "react";
import {Link} from "react-router-dom";

class Dashboard extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h1>Dashboard
                        <Link to="/dashboard/add" className="btn btn-primary float-right"> Add </Link>
                    </h1>
                </div>
            </div>
        );
    }
}

export default Dashboard;