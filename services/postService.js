import db from '../models/index.cjs';

class PostService {
    // Create a post
    static async createPost(userId, postData) {
        const postDetails = await db.post.create({
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
            const oldPost = await db.post.findOne({
                where: {
                    id: postId,
                    userId: userId,
                },
                attributes: ['id', 'title', 'content', 'userId'],
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
        return await db.post.findByPk(postId);
    }

    // Delete post
    static async deletePost(postId) {
        return await db.post.destroy({ where: { id: postId } });
    }
    // Paginated Post
    static async getPaginatedPost(page, pageSize) {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const { count, rows } = await db.post.findAndCountAll({ limit, offset });
        return { count, rows };
    }
}

// Default export
export default PostService;
