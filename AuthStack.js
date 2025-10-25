function AuthStack() {
  const { currentUser } = useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentUser ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : currentUser.role === "admin" ? (
        // Admin ke liye
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      ) : (
        // Normal user ke liye
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ReportScreen" component={ReportScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="EmergencyScreen" component={EmergencyScreen} />
          <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
          <Stack.Screen name="SafetyPlanScreen" component={SafetyPlanScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
