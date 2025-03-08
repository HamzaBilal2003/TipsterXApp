import {
  Image, StyleSheet, Text, View, FlatList,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import PortionSelector from '@/componenetsUi/Home/portionSelector';
import { useCallback, useMemo, useRef, useState } from 'react';
import PostItem from '@/componenetsUi/Home/PostItem';
import { styles } from '@/styles/HomeStyle';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Header from '@/componenetsUi/Header';
import { useAuth } from '@/contexts/authContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllPosts } from '@/utils/queries/PostQueries';
import { API_BASE_URL_IMG, API_DOMAIN, API_Images_Domain } from '@/utils/apiConfig';
import Loader from '@/componenetsUi/Loader';
import SpinnerLoader from '@/componenetsUi/SpinnerLoader';
import { RefreshControl } from 'react-native';

export default function HomeScreen() {
  const [selectedPortion, setSelectedPortion] = useState("posts");
  const [selectedComments, setSelectedComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { token, userData } = useAuth();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchAllPosts(token),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const filteredPosts = useMemo(() => {
    if (!posts || !posts.data) {
      return [];
    }
    return posts.data.filter(post =>
      selectedPortion === "posts" ? post.type === "post" : post.type === "announcement"
    );
  }, [posts, selectedPortion]);

  const handleCommentPress = (comments, postId) => {
    setSelectedComments(comments || []);
    setSelectedPostId(postId);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === "") return;
    setCommentLoading(true);
    try {
      const response = await fetch(`https://tipster.hmstech.org/api/posts/create-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: commentText,
          post_id: selectedPostId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCommentLoading(false);
        setCommentText('');
        bottomSheetRef.current?.close();
        queryClient.invalidateQueries({queryKey: ['posts']});
      } else {
        setCommentLoading(false);
      }
    } catch (error) {
      setCommentLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({queryKey: ['posts']});
    setRefreshing(false);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]} />}>
          <View style={{ marginTop: 25 }}>
            <Header profileImage={API_Images_Domain + (userData?.profile_picture?.substring(API_Images_Domain.length + 1) || '')} rNumber={10} />
            <PortionSelector
              options={[
                { name: "Posts", value: "posts" },
                { name: "Announcements", value: "announcements" },
              ]}
              onSelect={setSelectedPortion}
              defaultValue={selectedPortion}
            />
            <View style={{ height: 20 }} />
          </View>

          {isLoading || refreshing ? (
            <Loader color='yellow' />
          ) : (
            <FlatList
              data={filteredPosts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PostItem post={item} onCommentPress={handleCommentPress} />}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 100 }} />}
              scrollEnabled={false}
              removeClippedSubviews={false}
            />
          )}

        </ScrollView>
          {!isLoading && selectedPortion == 'posts' && (
            <Link href={'/createPost'} style={styles.createpost}>
              <View style={styles.createpostCan}>
                <AntDesign name='plus' size={30} color={"black"} />
              </View>
            </Link>
          )}
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        backgroundStyle={{ backgroundColor: "#2B2B2B" }}
      >
        <BottomSheetView style={{ flex: 1, padding: 15 }}>
          <Text style={cstyles.commentHeader}>Comments</Text>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={cstyles.commentInputContainer}>
              <TextInput
                style={cstyles.commentInput}
                placeholder="Write a comment..."
                placeholderTextColor="gray"
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity onPress={handleCommentSubmit} disabled={commentLoading}>
                {commentLoading ? <SpinnerLoader color='yellow' size={20} /> : <Ionicons name="send" size={24} color="yellow" />}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          <FlatList
            data={selectedComments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={cstyles.commentItem}>
                <Image source={{ uri: item.profileImage }} style={cstyles.commentProfileImage} />
                <View>
                  <Text style={cstyles.commentUsername}>{item.username}</Text>
                  <Text style={cstyles.commentText}>{item.content}</Text>
                </View>
              </View>
            )}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const cstyles = StyleSheet.create({
  commentHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomColor: "#4f4f4f",
    borderBottomWidth: 4,
    paddingBottom: 20,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUsername: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  commentText: {
    color: "white",
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginVertical: 10
  },
  commentInput: {
    flex: 1,
    color: "white",
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
});