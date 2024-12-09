import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Session({ children }: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    const location = useLocation();

    const fetchProfile = async () => {
        try {
            // Only fetch profile if not on signin/signup pages
            if (!location.pathname.includes('/Signin') && 
                !location.pathname.includes('/Signup')) {
                const currentUser = await client.profile();
                dispatch(setCurrentUser(currentUser));
            }
        } catch (err: any) {
            console.error(err);
        }
        setPending(false);
    };

    useEffect(() => {
        fetchProfile();
    }, [location.pathname]);

    if (!pending) {
        return children;
    }
}