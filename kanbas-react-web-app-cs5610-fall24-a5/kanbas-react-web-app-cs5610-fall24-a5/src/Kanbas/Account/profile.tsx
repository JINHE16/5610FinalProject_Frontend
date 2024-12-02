import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { logoutUser } from "./reducer";
import { useState, useEffect } from "react";
import * as client from "./client";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const updateProfile = async () => {
        const updatedProfile = await client.updateUser(profile);
        dispatch(setCurrentUser(updatedProfile));
    };

    const fetchProfile = () => {
        if (!currentUser) return navigate("/Kanbas/Account/Signin");
        setProfile(currentUser);
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleLogout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/Kanbas/Account/Signin");
    };

    return (
        <div id="wd-profile-screen" className="row container">
            {profile && (
                <div className="col-md-6 col-lg-4">
                    <h1>Profile</h1>
                    <input id="wd-username"
                        value={profile.username}
                        placeholder="username"
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
                    <input id="wd-password"
                        value={profile.password}
                        placeholder="password"
                        type="password"
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
                    <input id="wd-firstname"
                        value={profile.firstName}
                        placeholder="First Name"
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                    <input id="wd-lastname"
                        value={profile.lastName}
                        placeholder="Last Name"
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                    <input id="wd-dob"
                        value={profile.dob}
                        type="date"
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
                    <input id="wd-email"
                        value={profile.email}
                        type="email"
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    <select id="wd-role"
                        className="form-control mb-2"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                    </select>
                    <div>
                        <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
                        <button onClick={handleLogout} className="btn btn-danger w-100">
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>);
}
