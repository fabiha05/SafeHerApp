import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  getDocs
} from "firebase/firestore";
import { auth, db } from "../firebase";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase Admin Credentials
  const ADMIN_EMAILS = ["admin@app.com"];

  // Check if user is admin
  const isAdmin = (email) => ADMIN_EMAILS.includes(email);

  // Signup for normal users
  const signup = async (userData) => {
    try {
      const { email, password, fullName, phone, cnic } = userData;
      
      console.log("🔐 Starting signup for:", email);
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Firebase auth user created, UID:", user.uid);

      // Update user profile with display name
      await updateProfile(user, {
        displayName: fullName
      });

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        email: email,
        fullName: fullName,
        phone: phone || "",
        cnic: cnic || "",
        role: isAdmin(email) ? "admin" : "user",
        isBlocked: false,
        createdAt: new Date().toISOString()
      };

      console.log("📝 Creating user document in Firestore...");
      await setDoc(doc(db, "users", user.uid), userDoc);
      console.log("✅ User document created in Firestore");

      // Set current user
      setCurrentUser(userDoc);
      console.log("🎉 Signup completed successfully");
      return { success: true, user: userDoc };
    } catch (error) {
      console.log("❌ Signup error:", error.code, error.message);
      let errorMessage = "Signup failed. Please try again.";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already exists!";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address!";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak!";
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Login (admin + normal users)
  const login = async (email, password) => {
    try {
      console.log("🔐 Login attempt for:", email);
      
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Firebase auth success, UID:", user.uid);

      // Get user data from Firestore
      console.log("📄 Fetching user data from Firestore...");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      console.log("📄 User document exists:", userDoc.exists());
      
      if (!userDoc.exists()) {
        console.log("❌ User document not found in Firestore");
        throw new Error("User data not found!");
      }

      const userData = userDoc.data();
      console.log("👤 User data retrieved:", userData);

      // Check if user is blocked
      if (userData.isBlocked) {
        console.log("🚫 User is blocked");
        await signOut(auth);
        throw new Error("blocked");
      }

      console.log("🎉 Login successful, setting current user");
      setCurrentUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.log("❌ Login error:", error.code, error.message);
      let errorMessage = "Login failed. Please try again.";
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address!";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled!";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found!";
          break;
        case "auth/wrong-password":
          errorMessage = "Invalid password!";
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      console.log("🚪 Logging out user...");
      await signOut(auth);
      setCurrentUser(null);
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw error;
    }
  };

  // Block/unblock user
  const toggleBlockUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentStatus = userDoc.data().isBlocked;
        await updateDoc(userRef, {
          isBlocked: !currentStatus
        });
        
        // If the blocked user is currently logged in, log them out
        if (currentUser && currentUser.uid === userId && !currentStatus) {
          await logout();
        }
        
        return { success: true };
      }
      
      return { success: false, error: "User not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Get all users (for admin)
  const getAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().role !== "admin") { // Exclude admin from user list
          users.push({ id: doc.id, ...doc.data() });
        }
      });
      return users;
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log("🔍 Setting up auth state listener...");
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Auth state changed, user:", user ? user.uid : "null");
      
      if (user) {
        // User is signed in
        try {
          console.log("📄 Fetching user data for UID:", user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("👤 User data found:", userData);
            
            if (!userData.isBlocked) {
              console.log("✅ Setting current user, navigation should happen automatically");
              setCurrentUser(userData);
            } else {
              console.log("🚫 User is blocked, signing out...");
              // User is blocked, sign them out
              await signOut(auth);
              setCurrentUser(null);
            }
          } else {
            console.log("❌ User document not found in Firestore");
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
          setCurrentUser(null);
        }
      } else {
        // User is signed out
        console.log("👋 User signed out");
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    toggleBlockUser,
    getAllUsers,
    loading
  };

  return (
   // return (
  <UserContext.Provider value={value}>
    {children}  {/* ✅ FIXED - always render children */}
  </UserContext.Provider>
);
    //<UserContext.Provider value={value}>
      //{!loading && children}
    //</UserContext.Provider>
  //);
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};