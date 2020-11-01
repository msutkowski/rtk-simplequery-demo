import React, { useState } from "react";
import { Post, postApi } from "../../app/services/posts";

const EditablePostName = ({
  name: initialName,
  onUpdate,
}: {
  name: string;
  onUpdate: (name: string) => void;
}) => {
  const [name, setName] = useState(initialName);

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setName(value);

  const handleUpdate = () => onUpdate(name);

  return (
    <div>
      <input type="text" onChange={handleChange} value={name} />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

const PostRow = ({ data: { id, name } }: { data: Post }) => {
  const [editingId, setEditingId] = useState<null | number>(null);
  const [updatePost, updateResult] = postApi.hooks.updatePost.useMutation();
  const [deletePost, deleteResult] = postApi.hooks.deletePost.useMutation();

  return (
    <li key={id}>
      {editingId === id ? (
        <EditablePostName
          name={name}
          onUpdate={(name) =>
            updatePost({ id, name })
              .then((result) => {
                // handle the success!
                console.log("Update Result", result);
                setEditingId(null);
              })
              .catch((error) => console.error("Update Error", error))
          }
        />
      ) : (
        <React.Fragment>
          {name} <button onClick={() => setEditingId(id)}>Edit</button>
          <button onClick={() => deletePost(id)}>Delete</button>
        </React.Fragment>
      )}
    </li>
  );
};

export const PostsList = () => {
  const { data: posts } = postApi.hooks.getPosts.useQuery();

  return (
    <div>
      <h3>Posts</h3>
      <hr />
      {posts?.map((post) => (
        <PostRow key={post.id} data={post} />
      ))}
    </div>
  );
};
