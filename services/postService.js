import  post  from '../models/post.js';

class PostService {
    // Create a post
    static async createPost(userId, postData) {
        const postDetails = await post.create({
            title: postData.title,
            content: postData.content,
            userId: userId,
        });
        return postDetails;
    }

    // Updating post
    static async updatePost(userId, postId, updatedPostData) {
        try {
            const { title, content } = updatedPostData;
            const oldPost = await post.findOne({
                where: {
                    id: postId,
                    userId: userId,
                },
            });
            if (!oldPost) {
                throw new Error('Post not found or user not authorized');
            }
            oldPost.title = title || oldPost.title;
            oldPost.content = content || oldPost.content;
            await oldPost.save();
            return oldPost;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Fetch post by using id
    static async getPostById(postId) {
        return await post.findByPk(postId);
    }

    // Delete post
    static async deletePost(postId) {
        return await post.destroy({ where: { id: postId } });
    }
}

// Default export
export default PostService;
