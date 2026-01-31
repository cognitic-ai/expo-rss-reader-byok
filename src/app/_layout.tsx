import { ThemeProvider } from "@/components/theme-provider";
import * as AC from "@bacons/apple-colors";
import { Stack } from "expo-router/stack";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

let isLiquidGlassAvailable: () => boolean;
try {
  const glassEffect = require("expo-glass-effect");
  isLiquidGlassAvailable = glassEffect.isLiquidGlassAvailable;
} catch {
  isLiquidGlassAvailable = () => false;
}

const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : isLiquidGlassAvailable()
    ? {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          color: AC.label as any,
        },
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      }
    : {
        headerTransparent: true,
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerBlurEffect: "systemChromeMaterial",
        headerBackButtonDisplayMode: "default",
      };

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={AppleStackPreset}>
        <Stack.Screen
          name="index"
          options={{
            title: "Expo Changelog",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="article"
          options={{
            title: "Article",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="info"
          options={{
            href: null,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
