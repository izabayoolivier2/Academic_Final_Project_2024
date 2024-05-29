// withAuth.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./firebase/config";
import Loader from "../components/loader"

const withAuth = (WrappedComponent: React.FC) => {
  const AuthComponent: React.FC = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        // Update the authentication state
        setIsAuthenticated(!!user);
      });

      // Make sure to unsubscribe when the component unmounts
      return () => {
        unsubscribe();
      };
    }, []);

    // If authentication state is still unknown, don't render anything
    if (isAuthenticated === null) {
      return <Loader loading={true} color={"#0975D8"} />;
    }

    // If the user is not authenticated, redirect to the login page immediately
    if (!isAuthenticated) {
      router.push("/login");
      return null;
    }

    // Render the wrapped component if user is authenticated
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
