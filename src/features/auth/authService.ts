import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_auth_token";

export const authService = {
  async saveToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
