import { useLocalSearchParams } from "expo-router";
import { ScrollView, View, Text, Pressable } from "react-native";
import * as AC from "@bacons/apple-colors";
import * as WebBrowser from "expo-web-browser";
import { formatDate, stripHtml } from "@/utils/rss";

export default function ArticleRoute() {
  const params = useLocalSearchParams<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
  }>();

  const handleOpenLink = async () => {
    if (params.link) {
      await WebBrowser.openBrowserAsync(params.link);
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
        backgroundColor: AC.systemBackground,
      }}
    >
      <View style={{ padding: 20 }}>
        <Text
          selectable
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: AC.label,
            marginBottom: 12,
            lineHeight: 34,
          }}
        >
          {params.title}
        </Text>

        <Text
          selectable
          style={{
            fontSize: 15,
            color: AC.tertiaryLabel,
            marginBottom: 24,
          }}
        >
          {params.pubDate ? formatDate(params.pubDate) : ""}
        </Text>

        <Text
          selectable
          style={{
            fontSize: 17,
            color: AC.label,
            lineHeight: 26,
            marginBottom: 32,
          }}
        >
          {stripHtml(params.description || "")}
        </Text>

        <Pressable
          onPress={handleOpenLink}
          style={({ pressed }) => ({
            backgroundColor: AC.systemBlue,
            borderRadius: 12,
            borderCurve: "continuous",
            paddingVertical: 14,
            paddingHorizontal: 20,
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              color: "white",
              fontSize: 17,
              fontWeight: "600",
            }}
          >
            Read Full Article
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
