import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    Dimensions,
    Share,
    Pressable
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";
import { API_BASE_URL, } from "@/utils/apiConfig";
import { LikePost } from "@/utils/queries/PostQueries";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authContext";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import PostActionModal from "../profile/PostActionModal";
import { tabsIcon } from "@/assets/icons/icon";
import SpinnerLoader from "../SpinnerLoader";

const { width, height } = Dimensions.get("window");

interface PostItemProps {
    post: {
        comments_count: number;
        content: string;
        id: number;
        image_1: string;
        image_2: string;
        image_3: string;
        likes_count: number;
        recent_comments: any[];
        timestamp: string;
        images: string[];
        view_count: number;
        share_count: number;
        user: {
            id: number;
            username: string;
            profile_picture: string
        };
    };
    onCommentPress: (value: any[]) => void;
}
interface postType {
    comments_count: number;
    content: string;
    id: number;
    image_1: string;
    image_2: string;
    image_3: string;
    likes_count: number;
    recent_comments: any[];
    timestamp: string;
    view_count: number;
    share_count: number;
    user: {
        id: number;
        username: string;
        profile_picture: string
    };
}

const PostItem: React.FC<PostItemProps> = ({ post, onCommentPress }) => {
    // // console.log("postData : from post :", post)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisibleBottomSheet, setModalVisibleBottomSheet] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [selectedUserId, setselectedUserId] = useState<number | null>(null);

    const openModal = (postId: number, userId: number) => {
        setSelectedPostId(postId);
        setModalVisibleBottomSheet(true);
        setselectedUserId(userId)
    };
    const { token, userData } = useAuth();
    const [ImagesData, setImagesData] = useState<string[]>([]);
    // State for BottomSheet visibility

    const images = Object.values(post).filter((value): value is string =>
        typeof value === "string" &&
        (value.startsWith("https://tipster.hmstech.org/storage/posts/") || value.startsWith("https://tipster.hmstech.org/storage/posts/"))
    );

    useEffect(() => {
        setImagesData(images);
    }, [post]);

    const handlePress = () => {
        // Map recent comments to the correct structure expected by onCommentPress
        const commentsForThisPost = post.recent_comments.map(comment => ({
            id: comment.id.toString(),
            username: comment.user.username,
            profileImage: comment.user.profile_picture,
            content: comment.content,
            time: "Just now", // Adjust time formatting if needed
            likes: 0,
        }));

        onCommentPress(commentsForThisPost,post.id); // Pass the comments to the callback
    };


    const openImageSlider = (index: number) => {
        setSelectedImage(index);
        setCurrentIndex(index);
        setModalVisible(true);
    };

    const handleScroll = (event: any) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(newIndex);
    };
    const [likesCount, setLikesCount] = useState(post.likes_count);

    const [isLiked, setIsLiked] = useState(false); // Initialize based on user interaction

    const { mutate: handleLike, isPending: likeLoading } = useMutation({
        mutationKey: ["like"],
        mutationFn: async () => {
            const response = await LikePost(post.id, token);
            return response.data; // Ensure response contains `data`
        },
        onSuccess: (response) => {
            // console.log("Post like/unlike response:", response);

            if (response) {
                setLikesCount(response.likes_count);

                setIsLiked(response.is_liked);
            }
        },
        onError: (error) => {
            console.error("Error liking/unliking post:", error);
        },
    });
    const [shareCount, setShareCount] = useState(post.share_count);
    const { mutate: handleShare, isPending: sharing } = useMutation({
        mutationKey: ["share"],
        mutationFn: async () => {
            const response = await fetch("https://tipster.hmstech.org/api/posts/share", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // If token is required
                },
                body: JSON.stringify({
                    user_id: userData?.id, // Ensure user ID is available
                    post_id: post.id
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to share post");
            }

            const data = await response.json();
            return data;
        },
        onSuccess: async () => {
            // Increase share count locally
            setShareCount((prev) => prev + 1);

            // Open Android Share Dialog with Post Content
            try {
                await Share.share({
                    message: post.content, // Only share text
                });
            } catch (error) {
                console.error("Error sharing post:", error);
            }
        },
        onError: (error) => {
            console.error("Error sharing post:", error);
        },
    });
    const { navigate, reset } = useNavigation<NavigationProp<any>>();

    const handleProfile = (id: number) => {
        if (id == userData?.id){
            return false;
        }
        navigate("profile", {
            context: "signup",
            userId: id,
        });
    }

    return (
        <>
            <View style={styles.postContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => handleProfile(post.user.id)} activeOpacity={0.7}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <Image source={{ uri: post.user.profile_picture }} style={styles.profileImage} />
                            <View>
                                <Text style={styles.username}>{post.user.username}</Text>
                                <Text style={styles.time}>{post.timestamp}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Pressable onPress={() => openModal(post.id, post.user.id)} style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                        {/* {post.underReview && <T zext style={{ backgroundColor: "yellow", padding: 5, paddingInline: 10, borderRadius: 50, opacity: 0.9 }}>Under Review</T>} */}
                        <Ionicons name="ellipsis-vertical" size={20} color="white" />
                    </Pressable>
                </View>

                {/* Content */}
                <Text style={styles.content}>{post.content}</Text>

                {/* Image Grid */}
                {ImagesData && ImagesData && ImagesData.length > 0 && (
                    <View style={styles.imageGrid}>
                        {images.length === 1 ? (
                            <TouchableOpacity onPress={() => openImageSlider(0)}>
                                <Image source={{ uri: ImagesData[0] }} style={styles.fullWidthImage} />
                            </TouchableOpacity>
                        ) : ImagesData.length === 3 ? (
                            <View style={styles.threeImagesGrid}>
                                <TouchableOpacity onPress={() => openImageSlider(0)} style={styles.largeImageWrapper}>
                                    <Image source={{ uri: ImagesData[0] }} style={styles.largeImage} />
                                </TouchableOpacity>
                                <View style={styles.smallImagesWrapper}>
                                    <TouchableOpacity onPress={() => openImageSlider(1)} style={styles.smallImageWrapper}>
                                        <Image source={{ uri: ImagesData[1] }} style={styles.smallImage} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => openImageSlider(2)} style={styles.smallImageWrapper}>
                                        <Image source={{ uri: ImagesData[2] }} style={styles.smallImage} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.twoColumnGrid}>
                                {ImagesData.slice(0, 4).map((image, index) => (
                                    <TouchableOpacity key={index} onPress={() => openImageSlider(index)} style={styles.imageWrapper}>
                                        <Image source={{ uri: image }} style={styles.gridImage} />
                                        {images.length > 4 && index === 3 && (
                                            <View style={styles.overlay}>
                                                <Text style={styles.overlayText}>+{images.length - 4}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Post Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleLike()} disabled={likeLoading} style={styles.actionItem}>
                        {likeLoading ? <SpinnerLoader size={20} color="white" />  : <AntDesign name={isLiked ? "like1" : "like2"} size={20} color="white" />}
                        <Text style={styles.actionText}>{likesCount} Likes</Text>
                    </TouchableOpacity>


                    {/* rank */}
                    <View style={styles.actionItem}>
                        <TouchableOpacity style={styles.actionItem} onPress={() => {
                            handlePress()
                        }}>
                            <FontAwesome name="comment-o" size={20} color="white" />
                            <Text style={styles.actionText}>{post.comments_count} Comments</Text>
                        </TouchableOpacity>
                    </View>

                    {/* rank */}
                    <View style={styles.actionItem}>
                        <TouchableOpacity style={styles.actionItem}
                        // onPress={() => {
                        //     handlePress()
                        // }}
                        >
                            <Image source={tabsIcon.tabRank} style={{ width: 20, height: 20 }} />
                            <Text style={styles.actionText}>Rank</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity onPress={() => handleShare()} disabled={sharing} style={styles.actionItem}>
                        <FontAwesome name="share" size={20} color="white" />
                        <Text style={styles.actionText}>{shareCount}</Text>
                    </TouchableOpacity>

                    <View style={styles.actionItem}>
                        <FontAwesome name="eye" size={20} color="white" />
                        <Text style={styles.actionText}>{post.view_count}</Text>
                    </View> */}
                </View>

                {/* Full-Screen Image Slider Modal */}
                <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <View style={styles.modalBackground}>
                        <FlatList
                            data={ImagesData}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            initialScrollIndex={selectedImage}
                            getItemLayout={(data, index) => ({
                                length: width,
                                offset: width * index,
                                index,
                            })}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.fullscreenImage} />
                            )}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                        />

                        {/* Dynamic Pagination Dots */}
                        {images && images.length > 1 && <View style={styles.pagination}>
                            {images?.map((_, index) => (
                                <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
                            ))}
                        </View>}

                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close-circle" size={40} color="white" />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
            {selectedPostId && (
                <PostActionModal
                    visible={modalVisibleBottomSheet}
                    onClose={() => setModalVisibleBottomSheet(false)}
                    postId={selectedPostId}
                    userId={selectedUserId}
                />
            )}
        </>
    );
};

export default PostItem;

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "#222",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    username: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    time: {
        color: "gray",
        fontSize: 12,
    },
    content: {
        color: "white",
        marginTop: 10,
    },
    imageGrid: {
        marginTop: 10,
    },
    fullWidthImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    threeImagesGrid: {
        flexDirection: "row",
        gap: 5,
    },
    largeImageWrapper: {
        flex: 2,
    },
    largeImage: {
        width: "100%",
        height: 180,
        borderRadius: 8,
    },
    smallImagesWrapper: {
        flex: 1,
        justifyContent: "space-between",
    },
    smallImageWrapper: {
        flex: 1,
    },
    smallImage: {
        width: "100%",
        height: 87,
        borderRadius: 8,
    },
    twoColumnGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
    },
    gridImage: {
        width: "100%",
        height: 120,
        borderRadius: 8,
    },
    imageWrapper: {
        flexBasis: "48%",
        position: "relative",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 120,
        borderRadius: 8,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    overlayText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingVertical: 10,
    },
    actionItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    actionText: {
        color: "white",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullscreenImage: {
        width: width,
        height: height,
        resizeMode: "contain",
    },
    pagination: {
        position: "absolute",
        bottom: "20%",
        flexDirection: "row",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "yellow",
        padding: 5,
        borderRadius: 10
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "gray",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "yellow",
    },
    closeButton: {
        position: "absolute",
        top: 20,
        right: 20,
    },
});
