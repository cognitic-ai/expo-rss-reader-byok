import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as AC from "@bacons/apple-colors";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { fetchRSSFeed, RSSItem, stripHtml, formatDate } from "@/utils/rss";

const RSS_URL = "https://expo.dev/changelog/rss.xml";

export default function IndexRoute() {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const feed = await fetchRSSFeed(RSS_URL);
      setItems(feed.items);
    } catch (err) {
      setError("Failed to load RSS feed");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AC.systemBackground,
        }}
      >
        <ActivityIndicator size="large" color={AC.systemBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: AC.systemBackground,
        }}
      >
        <Text
          selectable
          style={{
            fontSize: 17,
            color: AC.secondaryLabel,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <Pressable
          onPress={() => loadFeed()}
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: AC.systemBlue,
            borderRadius: 8,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
        backgroundColor: AC.systemBackground,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadFeed(true)}
          tintColor={AC.systemBlue}
        />
      }
    >
      <View style={{ padding: 16, gap: 12 }}>
        {items.map((item) => (
          <ArticleCard key={item.guid} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

function ArticleCard({ item }: { item: RSSItem }) {
  return (
    <Link
      href={{
        pathname: "/article",
        params: {
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: item.pubDate,
          imageUrl: item.imageUrl || "",
        },
      }}
      asChild
    >
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: AC.secondarySystemGroupedBackground,
          borderRadius: 12,
          borderCurve: "continuous",
          overflow: "hidden",
          opacity: pressed ? 0.7 : 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        })}
      >
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: "100%",
              height: 200,
              backgroundColor: AC.tertiarySystemFill,
            }}
            contentFit="cover"
            transition={200}
          />
        )}
        <View style={{ padding: 16 }}>
          <Text
            selectable
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: AC.label,
              marginBottom: 6,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {item.description && (
            <Text
              selectable
              style={{
                fontSize: 15,
                color: AC.secondaryLabel,
                marginBottom: 8,
                lineHeight: 20,
              }}
              numberOfLines={3}
            >
              {stripHtml(item.description)}
            </Text>
          )}
          <Text
            selectable
            style={{
              fontSize: 13,
              color: AC.tertiaryLabel,
            }}
          >
            {formatDate(item.pubDate)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
