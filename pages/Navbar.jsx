//make a next js component?
const Navbar = () => {
    return (
        <div className="navbar bg-base-100 rounded-none fixed top-0 left-0 right-0 z-50">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">Bible Search ✝️</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 space-x-8">
                    <li className=""><a href="/about">About</a></li>
                    <li><a>Login</a></li>
                </ul>
            </div>
        </div>
    )
}


export default Navbar