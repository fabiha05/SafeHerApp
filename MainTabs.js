function MainTabs() {
  const { t, language } = useLanguage(); // ✅ language add kiya
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Journal") iconName = "book-outline";
          else if (route.name === "Resources") iconName = "albums-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: t("home") }}
      />
      <Tab.Screen
        name="Journal"
        component={Journal}
        options={{ tabBarLabel: t("journal") }}
      />
      <Tab.Screen
        name="Resources"
        component={Resources}
        options={{ tabBarLabel: t("resources") }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: t("profile") }}
      />
    </Tab.Navigator>
  );
}
