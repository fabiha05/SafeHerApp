// context/ReportsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase';

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  // Add a new report to Firestore
  const addReport = async (reportData) => {
    try {
      console.log('📝 Adding report to Firestore...');
      
      if (!currentUser) {
        throw new Error('User must be logged in to submit reports');
      }

      const reportWithMetadata = {
        title: reportData.title || '',
        description: reportData.description || '',
        isAnonymous: reportData.isAnonymous || false,
        // User info
        userId: currentUser.uid,
        userName: reportData.isAnonymous ? null : (reportData.reporterName || currentUser.displayName || 'Unknown'),
        userEmail: reportData.isAnonymous ? null : (reportData.reporterEmail || currentUser.email),
        userPhone: reportData.isAnonymous ? null : reportData.reporterPhone,
        userCnic: reportData.isAnonymous ? null : reportData.reporterCnic,
        // Media and location
        image: reportData.image || null,
        location: reportData.location || null,
        // Metadata
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'reports'), reportWithMetadata);
      console.log('✅ Report added with ID:', docRef.id);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Error adding report:', error);
      throw new Error('Failed to save report: ' + error.message);
    }
  };

  // Update an existing report
  const updateReport = async (reportId, reportData) => {
    try {
      console.log('📝 Updating report:', reportId);
      
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        title: reportData.title || '',
        description: reportData.description || '',
        isAnonymous: reportData.isAnonymous || false,
        userName: reportData.isAnonymous ? null : reportData.reporterName,
        userEmail: reportData.isAnonymous ? null : reportData.reporterEmail,
        userPhone: reportData.isAnonymous ? null : reportData.reporterPhone,
        userCnic: reportData.isAnonymous ? null : reportData.reporterCnic,
        image: reportData.image || null,
        location: reportData.location || null,
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ Report updated successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating report:', error);
      throw new Error('Failed to update report: ' + error.message);
    }
  };

  // Delete a report
  const deleteReport = async (reportId) => {
    try {
      console.log('🗑️ Deleting report:', reportId);
      await deleteDoc(doc(db, 'reports', reportId));
      console.log('✅ Report deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting report:', error);
      throw new Error('Failed to delete report: ' + error.message);
    }
  };

  // STEP 1: Temporary removeReport alias to stop the error
  const removeReport = async (reportId) => {
    console.warn('⚠️ removeReport called - please update to deleteReport');
    console.trace('removeReport stack trace - find where this is called from');
    return deleteReport(reportId);
  };

  // Get user's reports (real-time updates)
  useEffect(() => {
    if (!currentUser) {
      setReports([]);
      setLoading(false);
      return;
    }

    console.log('🔍 Setting up reports listener for user:', currentUser.uid);
    
    const reportsQuery = query(
      collection(db, 'reports'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reportsQuery, 
      (snapshot) => {
        const reportsData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          reportsData.push({
            id: doc.id,
            ...data,
            // Convert Firestore timestamp to Date
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });
        
        console.log('📄 Reports updated:', reportsData.length, 'reports');
        setReports(reportsData);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error fetching reports:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const value = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    // STEP 1: Temporary alias to prevent errors
    removeReport,
    loading
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};