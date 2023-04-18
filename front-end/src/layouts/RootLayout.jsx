import { Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="root-layout">
      <header className="row">
        <h1 className="col-md-4">Camping website</h1>
        <nav className="col-md-8">
            <div className="row main-nav">
                <div className="col-md-1">
                    <NavLink to="/">Home</NavLink>
                </div>
                <div className="col-md-1">
                    <NavLink to="Dashboard">Dashboard</NavLink>
                </div>
            </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}