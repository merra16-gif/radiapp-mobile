import { StyleSheet, Text, View } from "react-native";

export const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accesso RadiApp</Text>
      {/* Qui aggiungeremo il form di login nelle prossime fasi */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});
