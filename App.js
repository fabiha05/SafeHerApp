import { View, Text } from 'react-native';
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPassword";
import Home from "./screens/Home";
import Journal from "./screens/Journal";
import Resources from "./screens/Resources";
import Profile from "./screens/Profile";
import ReportScreen from "./screens/ReportScreen";
import ChatScreen from "./screens/ChatScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import EmergencyContacts from "./screens/EmergencyContacts";
import SafetyPlanScreen from "./screens/SafetyPlanScreen";
import AdminDashboard from "./screens/AdminDashboard";
import AdminReportsScreen from "./screens/AdminReportsScreen";
import NotificationsScreen from './screens/NotificationsScreen';

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { ReportsProvider } from "./context/ReportsContext";
import { UserProvider, useUser } from "./context/UserContext";
import { ContactsProvider } from "./context/ContactsContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
    console.log('❌ ERROR BOUNDARY CAUGHT:', error);
    console.log('📝 ERROR STACK:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>App Error</Text>
          <Text style={{ marginTop: 10 }}>Check the console for details</Text>
          <Text style={{ marginTop: 20, fontSize: 12, textAlign: 'center' }}>
            {this.state.error?.toString()}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function MainTabs() {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#E12764",
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { 
          backgroundColor: "#F7E8EB",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Journal") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "Resources") {
            iconName = focused ? "albums" : "albums-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: t("home") }} />
      <Tab.Screen name="Journal" component={Journal} options={{ tabBarLabel: t("journal") }} />
      <Tab.Screen name="Resources" component={Resources} options={{ tabBarLabel: t("resources") }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: t("profile") }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isDark } = useTheme();
  const { currentUser, loading } = useUser();

  console.log("🔍 AppNavigator - currentUser:", currentUser);
  console.log("🔍 AppNavigator - loading:", loading);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          // User is NOT logged in - show auth screens
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : currentUser.role === "admin" ? (
          // User is ADMIN - show admin screens
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
            <Stack.Screen name="ReportScreen" component={ReportScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="EmergencyScreen" component={EmergencyScreen} />
            <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
            <Stack.Screen name="SafetyPlanScreen" component={SafetyPlanScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        ) : (
          // User is REGULAR USER - show main app
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ReportScreen" component={ReportScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="EmergencyScreen" component={EmergencyScreen} />
            <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
            <Stack.Screen name="SafetyPlanScreen" component={SafetyPlanScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App component
export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ContactsProvider>
              <ReportsProvider>
                <AppNavigator />
              </ReportsProvider>
            </ContactsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}