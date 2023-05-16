import { NavLink, Outlet, useSearchParams } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="row">
            <h1 className="col-md-12">Dashboard</h1>

            <nav className="row">
                <div className="col-md-12 DashNavItem">
                    <NavLink to="Test">another test page</NavLink>
                </div>
                <div className="col-md-12 DashNavItem">
                    <NavLink to="Add">Add something</NavLink>
                </div>
            </nav>

            <Outlet />
        </div>
    )
}