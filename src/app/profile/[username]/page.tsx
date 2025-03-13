import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.actions";
import { notFound } from "next/navigation";
import React from "react";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Checkout ${user.username}'s profile page.`,
  };
}
async function ProfilePageServer({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);

  if (!user) notFound();

  const [posts, likedPosts, currentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={currentUserFollowing}
    />
  );
}

export default ProfilePageServer;
