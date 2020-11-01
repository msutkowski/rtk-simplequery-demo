import React from "react";
import { useParams } from "react-router-dom";
import { postApi } from "../../app/services/posts";

export const Post = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post } = postApi.hooks.getPost.useQuery(Number(id));

  return (
    <div>
      <pre>{JSON.stringify(post)}</pre>
    </div>
  );
};
