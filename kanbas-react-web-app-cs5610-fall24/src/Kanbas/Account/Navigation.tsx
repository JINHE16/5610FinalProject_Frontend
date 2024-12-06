import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
    const location = useLocation();
    const isActive = (path: string): boolean => location.pathname.startsWith(path);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

    return (
        <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
            {links.includes("Signin") && (
                <Link to={`/Kanbas/Account/Signin`}
                    className={`list-group-item border border-0 mb-2 ${isActive("/Kanbas/Account/Signin") ? "active" : "text-danger"}`}>
                    Signin
                </Link>
            )}
            {links.includes("Signup") && (
                <Link to={`/Kanbas/Account/Signup`}
                    className={`list-group-item border border-0 mb-2 ${isActive("/Kanbas/Account/Signup") ? "active" : "text-danger"}`}>
                    Signup
                </Link>
            )}
            {links.includes("Profile") && (
                <Link to={`/Kanbas/Account/Profile`}
                    className={`list-group-item border border-0 mb-2 ${isActive("/Kanbas/Account/Profile") ? "active" : "text-danger"}`}>
                    Profile
                </Link>
            )}
            {currentUser && currentUser.role === "ADMIN" && (
                <Link to={`/Kanbas/Account/Users`} 
                    className={`list-group-item border border-0 mb-2 ${isActive("/Kanbas/Account/Users") ? "active" : "text-danger"}`}> 
                    Users 
                </Link>
            )}
        </div>
    );
}
